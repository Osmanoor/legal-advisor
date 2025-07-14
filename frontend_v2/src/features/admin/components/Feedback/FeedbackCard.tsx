// src/features/admin/components/Feedback/FeedbackCard.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Feedback, FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface FeedbackCardProps {
  item: Feedback;
  onUpdate: (variables: { reviewId: number; payload: FeedbackUpdatePayload }) => void;
  isUpdating: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item, onUpdate, isUpdating }) => {
  const { direction } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(item.is_approved);
  const [isArchived, setIsArchived] = useState(item.is_archived);

  const handleSave = () => {
    const payload: FeedbackUpdatePayload = {};
    if (isApproved !== item.is_approved) {
        payload.is_approved = isApproved;
    }
    if (isArchived !== item.is_archived) {
        payload.is_archived = isArchived;
    }
    
    if (Object.keys(payload).length > 0) {
        onUpdate({ reviewId: item.id, payload });
    }
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card className="p-4 relative h-full flex flex-col">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-8 h-8" onClick={() => setIsDialogOpen(true)}>
            <MoreHorizontal className="w-5 h-5" />
        </Button>

        <CardContent className="p-0 text-right flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <img src={'/images/avatars/avatar1.png'} alt={item.user_name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{item.user_name}</p>
              <StarRating rating={item.rating} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">{item.comment}</p>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-xs text-gray-400">{new Date(item.submitted_at).toLocaleDateString()}</p>
            {item.is_approved && <Badge className="bg-green-100 text-green-700">Approved</Badge>}
            {item.is_archived && <Badge variant="outline">Archived</Badge>}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md p-6" dir={direction}>
              <DialogHeader>
                <DialogTitle>Update Review Status</DialogTitle>
                <DialogDescription>
                    Manage the visibility and status of the review from "{item.user_name}".
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Switch id="approve-switch" checked={isApproved} onCheckedChange={setIsApproved} />
                      <Label htmlFor="approve-switch">Show on landing page</Label>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Switch id="archive-switch" checked={isArchived} onCheckedChange={setIsArchived} />
                      <Label htmlFor="archive-switch">Archive this review</Label>
                  </div>
              </div>
              
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? <LoadingSpinner size="sm" /> : "Save Changes"}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
};