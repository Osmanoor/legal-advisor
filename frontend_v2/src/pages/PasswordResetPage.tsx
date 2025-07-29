// src/pages/PasswordResetPage.tsx
// No changes needed, provided for completeness.

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { PasswordResetFlow } from '@/features/auth/components/PasswordResetFlow';

export default function PasswordResetPage() {
  return (
    <AuthLayout>
      <PasswordResetFlow />
    </AuthLayout>
  );
}