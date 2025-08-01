// src/pages/admin/FeedbackManagementPage.tsx
// Updated for i18n

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminFeedback, ReviewFilterType, FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackCard } from '@/features/admin/components/Feedback/FeedbackCard';
import { Search, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { PaginationControls } from '@/components/common/PaginationControls';
import { cn } from '@/lib/utils';

type ReviewFilter = ReviewFilterType;
type SortKey = 'submitted_at' | 'rating';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 9;

export default function FeedbackManagementPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'submitted_at', direction: 'desc' });

  const { feedbackQuery, updateFeedbackMutation } = useAdminFeedback(currentPage, ITEMS_PER_PAGE, reviewFilter);

  const sortedAndFilteredFeedback = useMemo(() => {
    if (!feedbackQuery.data?.reviews) return [];
    let feedbackItems = [...feedbackQuery.data.reviews];
    if (searchTerm.trim()) {
        feedbackItems = feedbackItems.filter(item => 
          item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    feedbackItems.sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        let comparison = 0;
        if (sort.key === 'rating') {
            comparison = Number(aValue) - Number(bValue);
        } else {
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
            showToast(t('common.success'), 'success');
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : t('common.error');
            showToast(`${t('common.error')}: ${errorMessage}`, 'error');
        }
    });
  };

  const tabLabels = {
    pending: t('admin.feedback.statuses.pending'),
    approved: t('admin.feedback.statuses.approved'),
    archived: t('admin.feedback.statuses.archived'),
    all: t('admin.feedback.statuses.all')
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.feedback.title')} ({feedbackQuery.data?.total || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder={t('admin.feedback.searchPlaceholder')}
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
                        <div className="space-y-2"><Label>{t('admin.feedback.sortBy')}</Label>
                            <RadioGroup value={sort.key} onValueChange={(v) => setSort(s => ({...s, key: v as SortKey}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-date">{t('admin.feedback.date')}</Label><RadioGroupItem value="submitted_at" id="sort-date"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-rating">{t('admin.feedback.rating')}</Label><RadioGroupItem value="rating" id="sort-rating"/></div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2"><Label>{t('admin.feedback.direction')}</Label>
                           <RadioGroup value={sort.direction} onValueChange={(v) => setSort(s => ({...s, direction: v as SortDirection}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-desc">{t('admin.feedback.desc')}</Label><RadioGroupItem value="desc" id="sort-desc"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-asc">{t('admin.feedback.asc')}</Label><RadioGroupItem value="asc" id="sort-asc"/></div>
                           </RadioGroup>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>
      
      <div className="border-b-2 border-gray-200">
        <div className="flex justify-start">
            {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map(filterKey => (
                <button 
                  key={filterKey}
                  onClick={() => handleFilterChange(filterKey)}
                  className={cn(
                      "px-4 py-3 text-sm font-medium transition-colors",
                      reviewFilter === filterKey 
                        ? "text-cta border-b-2 border-cta" 
                        : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tabLabels[filterKey]}
                </button>
            ))}
        </div>
      </div>
      
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
                    <p>{t('admin.feedback.noReviews')}</p>
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