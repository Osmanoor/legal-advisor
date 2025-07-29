// src/pages/admin/FeedbackManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useAdminFeedback, ReviewFilterType, FeedbackUpdatePayload, Feedback } from '@/hooks/api/useAdminFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackCard } from '@/features/admin/components/Feedback/FeedbackCard';
import { Search, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { PaginationControls } from '@/components/common/PaginationControls';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

type ReviewFilter = ReviewFilterType;
type SortKey = 'submitted_at' | 'rating';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 9; // Adjusted for a 3-column layout

export default function FeedbackManagementPage() {
  const { showToast } = useToast();
  const {direction} = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'submitted_at', direction: 'desc' });

  const { feedbackQuery, updateFeedbackMutation } = useAdminFeedback(currentPage, ITEMS_PER_PAGE, reviewFilter);

  const sortedAndFilteredFeedback = useMemo(() => {
    if (!feedbackQuery.data?.reviews) return [];

    let feedbackItems = [...feedbackQuery.data.reviews];
    
    // Client-side search
    if (searchTerm.trim()) {
        feedbackItems = feedbackItems.filter(item => 
          item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sorting
    feedbackItems.sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        
        let comparison = 0;
        if (sort.key === 'rating') {
            comparison = Number(aValue) - Number(bValue);
        } else { // 'submitted_at' is a string
            comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
        }
        
        return sort.direction === 'desc' ? -comparison : comparison;
    });

    return feedbackItems;
  }, [feedbackQuery.data, searchTerm, sort]);

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

  const tabLabels = {
    archived: "المؤرشفة",
    approved: "الموافق عليها",
    pending: "قيد المراجعة",
    all: "الكل"
  };

  return (
    <div className="space-y-6">
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
            <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button></PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                    <div className="space-y-4 text-right p-2">
                        <div className="space-y-2"><Label>ترتيب حسب</Label>
                            <RadioGroup value={sort.key} onValueChange={(v) => setSort(s => ({...s, key: v as SortKey}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-date">التاريخ</Label><RadioGroupItem value="submitted_at" id="sort-date"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-rating">التقييم</Label><RadioGroupItem value="rating" id="sort-rating"/></div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2"><Label>الاتجاه</Label>
                           <RadioGroup value={sort.direction} onValueChange={(v) => setSort(s => ({...s, direction: v as SortDirection}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-desc">تنازلي</Label><RadioGroupItem value="desc" id="sort-desc"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-asc">تصاعدي</Label><RadioGroupItem value="asc" id="sort-asc"/></div>
                           </RadioGroup>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>
      
      <Tabs dir={direction} value={reviewFilter} onValueChange={handleFilterChange}>
          <TabsList >
              {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map(filterKey => (
                  <TabsTrigger 
                    key={filterKey}
                    value={filterKey}
                  >
                    {tabLabels[filterKey]}
                  </TabsTrigger>
              ))}
          </TabsList>
      </Tabs>
      
      {feedbackQuery.isLoading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : feedbackQuery.isError ? (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertDescription>{feedbackQuery.error.message}</AlertDescription>
        </Alert>
      ) : (
        <>
            {sortedAndFilteredFeedback.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {sortedAndFilteredFeedback.map(item => (
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