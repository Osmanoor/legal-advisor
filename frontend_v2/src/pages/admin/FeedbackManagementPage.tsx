// src/pages/admin/FeedbackManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminFeedback, ReviewFilterType , FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackCard } from '@/features/admin/components/Feedback/FeedbackCard';
import { Search, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { PaginationControls } from '@/components/common/PaginationControls';

type ReviewFilter = ReviewFilterType;

const ITEMS_PER_PAGE = 12; // Adjusted for a 4-column layout

export default function FeedbackManagementPage() {
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // The hook now receives the currentPage and itemsPerPage
  const { feedbackQuery, updateFeedbackMutation } = useAdminFeedback(currentPage, ITEMS_PER_PAGE, reviewFilter);

  // Client-side search on the current page's data
  const filteredFeedback = useMemo(() => {
    if (!feedbackQuery.data?.reviews) return [];
    
    if (searchTerm.trim() === '') {
      return feedbackQuery.data.reviews;
    }
    
    return feedbackQuery.data.reviews.filter(item => 
      item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feedbackQuery.data, searchTerm]);

  // Reset to page 1 whenever the filter changes
  const handleFilterChange = (val: string) => {
    setCurrentPage(1);
    setReviewFilter(val as ReviewFilter);
  }
  
  const handleUpdateReview = async (variables: { reviewId: number; payload: FeedbackUpdatePayload }) => {
    updateFeedbackMutation.mutate(variables, {
        onSuccess: () => {
            showToast('Review updated successfully.', 'success');
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            showToast(`Failed to update review: ${errorMessage}`, 'error');
        }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">إدارة التقييمات ({feedbackQuery.data?.total || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder="Search by user or comment..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button>
        </div>
      </div>
      
      {/* Sub-navigation tabs for filtering */}
      <Tabs value={reviewFilter} onValueChange={handleFilterChange}>
          <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
      </Tabs>
      
      {/* Content Display Area */}
      {feedbackQuery.isLoading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : feedbackQuery.isError ? (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertDescription>{feedbackQuery.error.message}</AlertDescription>
        </Alert>
      ) : (
        <>
            {filteredFeedback.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredFeedback.map(item => (
                    <FeedbackCard 
                        key={item.id} 
                        item={item}
                        onUpdate={handleUpdateReview}
                        isUpdating={updateFeedbackMutation.isPending && updateFeedbackMutation.variables?.reviewId === item.id}
                    />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>No reviews found for this filter.</p>
                </div>
            )}
            <div className="mt-8">
                <PaginationControls
                    currentPage={feedbackQuery.data?.current_page || 1}
                    totalPages={feedbackQuery.data?.pages || 1}
                    onPageChange={setCurrentPage}
                    totalItems={feedbackQuery.data?.total || 0}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </>
      )}
    </div>
  );
}