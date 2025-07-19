// src/features/auth/components/Step1_RequestReset.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { usePasswordReset } from '@/hooks/api/usePasswordReset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';
import { Mail } from 'lucide-react';

interface Step1_RequestResetProps {
  onSuccess: (identifier: string) => void;
}

export const Step1_RequestReset: React.FC<Step1_RequestResetProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { forgotPasswordMutation } = usePasswordReset();
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Please enter your email or phone number.', 'error');
      return;
    }

    forgotPasswordMutation.mutate({ identifier }, {
      onSuccess: (response) => {
        // The backend sends a generic message for security, which we can show.
        const message = (response.data as { message: string }).message;
        showToast(message, 'success');
        onSuccess(identifier); // Proceed to the next step
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || 'An unknown error occurred.';
        showToast(errorMessage, 'error');
      }
    });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-cta" />
        </div>
        <h2 className="text-2xl font-semibold">Forgot Password?</h2>
        <p className="text-gray-500 mt-2">Enter your email or phone number and we'll send you a code to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="identifier">Email or Phone Number</Label>
          <Input 
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="+9665... or user@example.com"
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-cta hover:bg-cta-hover h-11"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? <LoadingSpinner size="sm" /> : 'Send Reset Code'}
        </Button>
      </form>
    </div>
  );
};