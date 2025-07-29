import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Feedback, FeedbackUpdatePayload } from '@/hooks/api/useAdminFeedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { MoreVertical, Star, CheckCircle, Archive, RotateCcw, User, Briefcase, Building, Image as ImageIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';

interface FeedbackCardProps {
  item: Feedback;
  onUpdate: (variables: { reviewId: number; payload: FeedbackUpdatePayload }) => void;
  isUpdating: boolean;
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
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

  const handleUpdate = (payload: FeedbackUpdatePayload) => {
    onUpdate({ reviewId: item.id, payload });
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card className="p-4 relative h-full flex flex-col min-h-[220px]">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-8 h-8" onClick={() => setIsDialogOpen(true)}>
            <MoreVertical className="w-5 h-5" />
        </Button>

        <CardContent className="p-0 text-right flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <img src={item.user_profile_picture_url || '/images/avatars/avatar1.png'} alt={item.user_name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{item.user_name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">{item.comment}</p>
          
          <div className="mt-auto pt-3">
            <Separator className="my-3 bg-gray-200" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                <span>{new Date(item.submitted_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.is_approved && <Badge className="bg-green-100 text-green-700">Approved</Badge>}
                {item.is_archived && <Badge variant="outline">Archived</Badge>}
                {!item.is_approved && !item.is_archived && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Pending</Badge>}
              </div>
               <StarRatingDisplay rating={item.rating} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogContent className="sm:max-w-lg p-6" dir={direction}>
              {/* Custom Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <img src={item.user_profile_picture_url || '/images/avatars/avatar1.png'} alt={item.user_name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold">{item.user_name}</p>
                    </div>
                </div>
                <DialogClose />
              </div>

              {/* Rating and Date Row */}
              <div className="flex justify-between items-center mb-4">
                 <StarRatingDisplay rating={item.rating} />
                 <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{new Date(item.submitted_at).toLocaleString()}</span>
                 </div>
              </div>

              {/* Comment */}
              <div className="py-4">
                <p className="text-sm text-gray-700 text-right">{item.comment || "لا يوجد تعليق."}</p>
              </div>

              {/* Separator */}
              <Separator className="my-4" />

              {/* Settings */}
              <div>
                  <h4 className="font-semibold text-right mb-3">إعدادات العرض التي اختارها المستخدم:</h4>
                  <div className="grid grid-cols-2 gap-2 text-right">
                      <SettingDisplay icon={User} label="إظهار الاسم" isEnabled={item.preview_settings.show_name} />
                      <SettingDisplay icon={Briefcase} label="إظهار المسمى الوظيفي" isEnabled={item.preview_settings.show_job_title} />
                      <SettingDisplay icon={ImageIcon} label="إظهار صورة الملف الشخصي" isEnabled={item.preview_settings.show_profile_picture} />
                      <SettingDisplay icon={Building} label="إظهار جهة العمل" isEnabled={item.preview_settings.show_workplace} />
                  </div>
              </div>
              
              <DialogFooter className="pt-6 flex-col-reverse sm:flex-row  gap-2">
                  <div className="flex gap-2">
                    {!item.is_archived && (
                        <Button variant="outline" onClick={() => handleUpdate({ is_archived: true })} disabled={isUpdating}>
                            <Archive className="ml-2 h-4 w-4"/> أرشفة
                        </Button>
                    )}
                    {(item.is_approved || item.is_archived) && (
                         <Button variant="ghost" onClick={() => handleUpdate({ is_approved: false, is_archived: false })} disabled={isUpdating}>
                            <RotateCcw className="ml-2 h-4 w-4"/> نقل إلى قيد المراجعة
                         </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    {!item.is_approved && (
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdate({ is_approved: true })} disabled={isUpdating}>
                            {isUpdating ? <LoadingSpinner size="sm" /> : <CheckCircle className="ml-2 h-4 w-4"/>}
                            موافقة
                        </Button>
                    )}
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
};