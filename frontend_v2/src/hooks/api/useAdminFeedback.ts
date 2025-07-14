// File: src/hooks/api/useAdminFeedback.ts
// @updated - Added new permission-like booleans to the Feedback type and mock data.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Feedback {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string; // ISO String
  isFeatured: boolean;
  // --- New fields based on the dialog design ---
  canRestrictUser: boolean;
  canManageComplaints: boolean;
  canManagePermissions: boolean;
  canAccessSystemSettings: boolean;
}

// --- Mock Data ---
const createMockFeedback = (): Feedback[] => [
    { id: 'fb_001', userName: 'Amjed Mohammed', userAvatar: '/images/avatars/avatar1.png', rating: 5, comment: 'منصة شبكة المشتريات السعودية تعتبر نقلة نوعية في مجال المشتريات الحكومية. وفرت لي كصاحب منشأة إمكانية الوصول إلى الفرص بكل سهولة ووضوح. التسجيل سلس، والواجهة منظمة، والمعلومات متوفرة بشكل شفاف.', date: '2025-06-28T10:00:00Z', isFeatured: true, canRestrictUser: true, canManageComplaints: true, canManagePermissions: false, canAccessSystemSettings: false },
    { id: 'fb_002', userName: 'Ali Hassan', userAvatar: '/images/avatars/avatar2.png', rating: 4, comment: 'أداة رائعة، خصوصًا الآلة الحاسبة، لكن أتمنى إضافة المزيد من القوالب الجاهزة.', date: '2025-06-27T14:30:00Z', isFeatured: false, canRestrictUser: false, canManageComplaints: false, canManagePermissions: false, canAccessSystemSettings: false },
    // Add more mock items with the new fields...
];

let mockFeedbackDB = createMockFeedback();

// --- Mock API Functions (fetch and delete remain the same) ---
const fetchFeedback = async (): Promise<Feedback[]> => {
  console.log("Fetching mock feedback...");
  await new Promise(res => setTimeout(res, 500));
  return [...mockFeedbackDB];
};

const updateFeedback = async (updatedItem: Partial<Feedback> & { id: string }): Promise<Feedback> => {
    console.log("Updating feedback:", updatedItem);
    await new Promise(res => setTimeout(res, 500));
    const itemIndex = mockFeedbackDB.findIndex(f => f.id === updatedItem.id);
    if(itemIndex === -1) throw new Error("Feedback not found");
    mockFeedbackDB[itemIndex] = { ...mockFeedbackDB[itemIndex], ...updatedItem };
    return mockFeedbackDB[itemIndex];
};

const deleteFeedback = async (id: string): Promise<{ message: string }> => {
    console.log("Deleting feedback:", id);
    await new Promise(res => setTimeout(res, 500));
    mockFeedbackDB = mockFeedbackDB.filter(f => f.id !== id);
    return { message: "Feedback deleted" };
};


// --- React Query Hooks (remain the same) ---
export function useAdminFeedback() {
  const queryClient = useQueryClient();

  const feedbackQuery = useQuery<Feedback[], Error>({
    queryKey: ['admin', 'feedback'],
    queryFn: fetchFeedback,
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: updateFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: deleteFeedback,
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
  });

  return {
    feedbackQuery,
    updateFeedbackMutation,
    deleteFeedbackMutation,
  };
}