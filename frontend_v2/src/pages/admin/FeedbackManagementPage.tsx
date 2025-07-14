// src/pages/admin/FeedbackManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminFeedback, Feedback, FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackCard } from '@/features/admin/components/Feedback/FeedbackCard';
import { Search, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

type ReviewFilter = 'all' | 'approved' | 'archived';

export default function FeedbackManagementPage() {
  const { showToast } = useToast();
  
  // State for pagination, filtering, and searching
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data and mutations from the dedicated hook
  const { feedbackQuery, updateFeedbackMutation } = useAdminFeedback(currentPage);

  // Memoized filtering logic based on the fetched data and UI state
  const filteredFeedback = useMemo(() => {
    let feedback = feedbackQuery.data?.reviews || [];
    
    // Filter by active sub-tab (approved/archived)
    if (reviewFilter === 'approved') {
      feedback = feedback.filter(item => item.is_approved);
    } else if (reviewFilter === 'archived') {
      feedback = feedback.filter(item => item.is_archived);
    }
    
    // Filter by search term
    if (searchTerm) {
      feedback = feedback.filter(item => 
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return feedback;
  }, [feedbackQuery.data, reviewFilter, searchTerm]);
  
  // Handler to call the update mutation
  const handleUpdateReview = async (variables: { reviewId: number; payload: FeedbackUpdatePayload }) => {
    try {
      await updateFeedbackMutation.mutateAsync(variables);
      showToast('Review updated successfully.', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showToast(`Failed to update review: ${errorMessage}`, 'error');
    }
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
            {/* These buttons are placeholders for future sorting/filtering functionality */}
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button>
        </div>
      </div>
      
      {/* Sub-navigation tabs for filtering */}
      <Tabs value={reviewFilter} onValueChange={(val) => setReviewFilter(val as ReviewFilter)}>
          <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="approved">الموافق عليها</TabsTrigger>
              <TabsTrigger value="archived">المؤرشفة</TabsTrigger>
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
            {/* Pagination controls would go here */}
        </>
      )}
    </div>
  );
}