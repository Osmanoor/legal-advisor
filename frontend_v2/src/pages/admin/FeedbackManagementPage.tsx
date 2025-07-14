// File: src/pages/admin/FeedbackManagementPage.tsx
// @updated - Removed delete logic to align with the new dialog-focused design.

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminFeedback, Feedback } from '@/hooks/api/useAdminFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackCard } from '@/features/admin/components/Feedback/FeedbackCard';
import { Search, Filter, ArrowDownUp } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

type FilterType = 'all' | 'featured';

export default function FeedbackManagementPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { feedbackQuery, updateFeedbackMutation } = useAdminFeedback();
  
  const [activeTab, setActiveTab] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeedback = useMemo(() => {
    let feedback = feedbackQuery.data || [];
    if (activeTab === 'featured') {
      feedback = feedback.filter(item => item.isFeatured);
    }
    if (searchTerm) {
      feedback = feedback.filter(item => 
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return feedback;
  }, [feedbackQuery.data, activeTab, searchTerm]);
  
  const handleUpdate = async (data: Partial<Feedback> & { id: string }) => {
    try {
      await updateFeedbackMutation.mutateAsync(data);
      showToast('Feedback updated successfully.', 'success');
    } catch {
      showToast('Failed to update feedback.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">التعليقات ({feedbackQuery.data?.length || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder="Search..." 
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
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as FilterType)}>
          <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="featured">المعروضة</TabsTrigger>
          </TabsList>
      </Tabs>
      
      {feedbackQuery.isLoading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : feedbackQuery.error ? (
        <Alert variant="destructive"><AlertDescription>{feedbackQuery.error.message}</AlertDescription></Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeedback.map(item => (
            <FeedbackCard 
                key={item.id} 
                item={item}
                onUpdate={handleUpdate}
                isUpdating={updateFeedbackMutation.isPending && updateFeedbackMutation.variables?.id === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}