// File: src/features/admin/components/Feedback/FeedbackCard.tsx
// @updated - Replaced popover/small dialog with the new comprehensive dialog.

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Feedback } from '@/hooks/api/useAdminFeedback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Star, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';


interface FeedbackCardProps {
  item: Feedback;
  onUpdate: (updatedItem: Partial<Feedback> & { id: string }) => void;
  isUpdating: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

// Settings state interface
interface SettingsState {
    canRestrictUser: boolean;
    canManageComplaints: boolean;
    canManagePermissions: boolean;
    canAccessSystemSettings: boolean;
    isFeatured: boolean; // Added isFeatured here to manage it with other settings
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item, onUpdate, isUpdating }) => {
  const { t, direction } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
      canRestrictUser: item.canRestrictUser,
      canManageComplaints: item.canManageComplaints,
      canManagePermissions: item.canManagePermissions,
      canAccessSystemSettings: item.canAccessSystemSettings,
      isFeatured: item.isFeatured
  });

  useEffect(() => {
    if (item) {
        setSettings({
            canRestrictUser: item.canRestrictUser,
            canManageComplaints: item.canManageComplaints,
            canManagePermissions: item.canManagePermissions,
            canAccessSystemSettings: item.canAccessSystemSettings,
            isFeatured: item.isFeatured,
        });
    }
  }, [item]);


  const handleSettingChange = (key: keyof SettingsState, value: boolean) => {
      setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({ id: item.id, ...settings });
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card className="p-4 relative">
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 w-8 h-8" onClick={() => setIsDialogOpen(true)}>
            <MoreHorizontal className="w-5 h-5" />
        </Button>

        <CardContent className="p-0 text-right">
          <div className="flex items-center gap-3 mb-3">
            <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{item.userName}</p>
              <StarRating rating={item.rating} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4">{item.comment}</p>
          <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-3xl p-8" dir={direction}>
              <div className="flex justify-between items-start mb-4">
                  <Button variant="ghost" size="icon" className="w-8 h-8 -mt-2 -ml-2" onClick={() => setIsDialogOpen(false)}>
                      <X className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{item.userName}</p>
                        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <img src={item.userAvatar} alt={item.userName} className="w-12 h-12 rounded-full" />
                  </div>
              </div>
              
              <div className="mb-6 text-right">
                  <StarRating rating={item.rating} />
              </div>
              
              <p className="text-base text-gray-700 text-right leading-relaxed mb-6">{item.comment}</p>
              
              <hr className="mb-6" />
              
              <div className="text-right mb-6">
                <h3 className="text-lg font-bold mb-4">الأعدادات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-end gap-3">
                            <Label htmlFor="s-restrict" className="text-sm font-normal cursor-pointer">تقييد المستخدمين</Label>
                            <Checkbox id="s-restrict" checked={settings.canRestrictUser} onCheckedChange={(c) => handleSettingChange('canRestrictUser', !!c)} />
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <Label htmlFor="s-complaints" className="text-sm font-normal cursor-pointer">إدارة الشكاوى والمراسلات من المستخدمين</Label>
                            <Checkbox id="s-complaints" checked={settings.canManageComplaints} onCheckedChange={(c) => handleSettingChange('canManageComplaints', !!c)} />
                        </div>
                    </div>
                     {/* Left Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-end gap-3">
                            <Label htmlFor="s-perms" className="text-sm font-normal cursor-pointer">إدارة الصلاحيات والأدوار للمستخدمين الآخرين</Label>
                            <Checkbox id="s-perms" checked={settings.canManagePermissions} onCheckedChange={(c) => handleSettingChange('canManagePermissions', !!c)} />
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <Label htmlFor="s-settings" className="text-sm font-normal cursor-pointer">الوصول إلى إعدادات النظام العامة وتعديلها</Label>
                            <Checkbox id="s-settings" checked={settings.canAccessSystemSettings} onCheckedChange={(c) => handleSettingChange('canAccessSystemSettings', !!c)} />
                        </div>
                    </div>
                </div>
              </div>

            <Button onClick={handleSave} disabled={isUpdating} className={cn("w-full h-12 text-base bg-cta hover:bg-cta-hover", isUpdating && "opacity-50")}>
                {isUpdating ? "جاري الحفظ..." : "عرض على الرئيسية"}
            </Button>
          </DialogContent>
      </Dialog>
    </>
  );
};