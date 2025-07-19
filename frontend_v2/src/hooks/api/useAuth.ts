// src/hooks/api/useAuth.ts

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { RegisterData, VerificationData, ChangePasswordData } from '@/types/user';
import { api } from '@/lib/axios';

export function useAuthMutations() {
  const { register, verifyPhone } = useAuthStore.getState();

  const registerMutation = useMutation({
    // The data type now matches the updated RegisterData interface
    mutationFn: (data: RegisterData) => register(data),
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: (data: VerificationData) => verifyPhone(data),
  });

  const changePasswordMutation = useMutation({
      mutationFn: (data: ChangePasswordData) => api.post('/auth/password/change', data)
  });

  return {
    registerMutation,
    verifyPhoneMutation,
    changePasswordMutation,
  };
}