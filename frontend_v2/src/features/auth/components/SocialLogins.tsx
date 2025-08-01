// File: src/features/auth/components/SocialLogins.tsx
// This component encapsulates the social login buttons and the "or" divider.

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/assets/icons/google.svg';
import LinkedInIcon from '@/assets/icons/linkedin.svg';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function SocialLogins() {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">{t('auth.or')}</span>
        </div>
      </div>
      <div className="space-y-3">
        {/* <Button variant="outline" className="w-full gap-3">
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          {t('auth.loginWithGoogle')}
        </Button> */}
        
        {/* --- MODIFICATION START --- */}
        {/* This is now an anchor tag that links directly to the backend endpoint. */}
        {/* The backend will handle the redirect to LinkedIn's authorization page. */}
        <a
          href="/api/auth/linkedin"
          className={cn(buttonVariants({ variant: 'outline' }), "w-full gap-3")}
          // This ensures a full page navigation, allowing the backend to handle the redirect.
          rel="noopener noreferrer"
        >
          <img src={LinkedInIcon} alt="LinkedIn" className="w-5 h-5" />
          {t('auth.loginWithLinkedIn')}
        </a>
        {/* --- MODIFICATION END --- */}

      </div>
    </>
  );
}