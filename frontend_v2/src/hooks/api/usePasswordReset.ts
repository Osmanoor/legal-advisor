// src/hooks/api/usePasswordReset.ts

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// --- Type Definitions for Payloads ---
interface ForgotPasswordPayload {
  identifier: string;
}

interface VerifyCodePayload {
  identifier: string;
  code: string;
}

interface ResetPasswordPayload {
  identifier: string;
  code: string;
  newPassword: string;
}

// --- The Hook ---
export function usePasswordReset() {

  // Mutation for Step 1: Requesting the reset code
  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => 
      api.post('/auth/password/forgot', payload),
  });

  // Placeholder for Step 2 mutation
  const verifyCodeMutation = useMutation({
    mutationFn: (payload: VerifyCodePayload) => 
      api.post('/auth/password/verify-code', payload),
  });

  // Placeholder for Step 3 mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => 
      api.post('/auth/password/reset', payload),
  });


  return {
    forgotPasswordMutation,
    verifyCodeMutation,
    resetPasswordMutation,
  };
}