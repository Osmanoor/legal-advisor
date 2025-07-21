import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Feedback, FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Star, CheckCircle, Archive, RotateCcw, User, Briefcase, Building, Image as ImageIcon } from 'lucide-react';
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

const SettingDisplay = ({ icon, label, isEnabled }: { icon: React.ElementType, label: string, isEnabled: boolean }) => (
    <div className={`flex items-center gap-2 p-2 rounded-md ${isEnabled ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
        {React.createElement(icon, { className: "w-4 h-4" })}
        <span className="text-sm">{label}</span>
    </div>
);

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item, onUpdate, isUpdating }) => {
  const { direction } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // The handler now sends a specific, clean payload for each action
  const handleUpdate = (payload: FeedbackUpdatePayload) => {
    onUpdate({ reviewId: item.id, payload });
    // The dialog will close, and the list will refetch, showing the updated state.
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
            <img src={item.user_profile_picture_url || '/images/avatars/avatar1.png'} alt={item.user_name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{item.user_name}</p>
              <StarRating rating={item.rating} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">{item.comment}</p>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-xs text-gray-400">{new Date(item.submitted_at).toLocaleDateString()}</p>
            <div className="flex gap-2">
                {item.is_approved && <Badge className="bg-green-100 text-green-700">Approved</Badge>}
                {item.is_archived && <Badge variant="outline">Archived</Badge>}
                {!item.is_approved && !item.is_archived && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Pending</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg p-6" dir={direction}>
              <DialogHeader className="text-right">
                <DialogTitle className="text-xl">Review Details</DialogTitle>
                <DialogDescription>From: {item.user_name} on {new Date(item.submitted_at).toLocaleString()}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-end"><StarRating rating={item.rating} /></div>
                <div className="p-4 bg-gray-50 rounded-md border max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700">{item.comment || "No comment provided."}</p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-right mb-2">User's chosen display settings:</h4>
                    <div className="grid grid-cols-2 gap-2 text-right">
                        <SettingDisplay icon={User} label="Show Name" isEnabled={item.preview_settings.show_name} />
                        <SettingDisplay icon={Briefcase} label="Show Job Title" isEnabled={item.preview_settings.show_job_title} />
                        <SettingDisplay icon={ImageIcon} label="Show Profile Picture" isEnabled={item.preview_settings.show_profile_picture} />
                        <SettingDisplay icon={Building} label="Show Workplace" isEnabled={item.preview_settings.show_workplace} />
                    </div>
                </div>
              </div>
              
              <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
                  <div className="flex gap-2">
                    {/* Only show if it's not already archived */}
                    {!item.is_archived && (
                        <Button variant="outline" onClick={() => handleUpdate({ is_archived: true })} disabled={isUpdating}>
                            <Archive className="mr-2 h-4 w-4"/> Archive
                        </Button>
                    )}
                    {/* Only show if it's not already pending */}
                    {(item.is_approved || item.is_archived) && (
                         <Button variant="ghost" onClick={() => handleUpdate({ is_approved: false, is_archived: false })} disabled={isUpdating}>
                            <RotateCcw className="mr-2 h-4 w-4"/> Move to Pending
                         </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    {/* Only show 'Approve' if it's not already approved */}
                    {!item.is_approved && (
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdate({ is_approved: true })} disabled={isUpdating}>
                            {isUpdating ? <LoadingSpinner size="sm" /> : <CheckCircle className="mr-2 h-4 w-4"/>}
                            Approve
                        </Button>
                    )}
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
};