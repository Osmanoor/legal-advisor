// src/features/feedback/components/FeedbackForm.tsx

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { StarRatingInput } from '@/components/ui/StarRatingInput';
import { Separator } from '@/components/ui/separator';
import { useFeedback } from '@/hooks/api/useFeedback'; // <-- Import the new hook
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';
import { trackEvent } from '@/lib/analytics';

interface PreviewSettings {
  show_name: boolean;
  show_workplace: boolean;
  show_job_title: boolean;
  show_profile_picture: boolean;
}

export const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    show_name: true,
    show_workplace: false,
    show_job_title: false,
    show_profile_picture: true,
  });

  const { showToast } = useToast();
  const { submitFeedbackMutation } = useFeedback();

  const handleSettingChange = (key: keyof PreviewSettings) => {
    setPreviewSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        showToast("Please select a rating before submitting.", "error");
        return;
    }

    submitFeedbackMutation.mutate({
      rating,
      comment,
      preview_settings: previewSettings,
    }, {
        onSuccess: (data) => {
            trackEvent({ event: 'feedback_submitted', rating: rating });
            showToast(data.message || "Thank you for your feedback!", "success");
            // Optionally, you can reset the form or disable it here
            setRating(0);
            setComment('');
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || 'Failed to submit feedback.';
            showToast(errorMessage, 'error');
        }
    });
  };

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Label className="font-medium">التقييم</Label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div className="text-right">
          <Label htmlFor="comment" className="font-medium mb-2 inline-block">ملاحظاتك</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="أكتب ملاحظاتك هنا"
            className="min-h-[140px]"
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-4 mb-4">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-500">الإعدادت</span>
              <Separator className="flex-1" />
          </div>
           
           <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-end gap-3"><Label htmlFor="show_name" className="text-sm font-light cursor-pointer">إظهار الاسم</Label><Checkbox id="show_name" checked={previewSettings.show_name} onCheckedChange={() => handleSettingChange('show_name')} /></div>
                <div className="flex items-center justify-end gap-3"><Label htmlFor="show_job_title" className="text-sm font-light cursor-pointer">إظهار المسمى الوظيفي</Label><Checkbox id="show_job_title" checked={previewSettings.show_job_title} onCheckedChange={() => handleSettingChange('show_job_title')} /></div>
                <div className="flex items-center justify-end gap-3"><Label htmlFor="show_profile_picture" className="text-sm font-light cursor-pointer">إظهار صورة البروفايل</Label><Checkbox id="show_profile_picture" checked={previewSettings.show_profile_picture} onCheckedChange={() => handleSettingChange('show_profile_picture')} /></div>
                <div className="flex items-center justify-end gap-3"><Label htmlFor="show_workplace" className="text-sm font-light cursor-pointer">إظهار جهة العمل</Label><Checkbox id="show_workplace" checked={previewSettings.show_workplace} onCheckedChange={() => handleSettingChange('show_workplace')} /></div>
           </div>
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={submitFeedbackMutation.isPending}>
          {submitFeedbackMutation.isPending ? <LoadingSpinner size="sm" /> : "إرسال التقييم"}
        </Button>
      </form>
    </Card>
  );
};