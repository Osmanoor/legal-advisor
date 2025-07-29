// src/features/auth/components/PasswordResetFlow.tsx
// Updated for i18n

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Step1_RequestReset } from './Step1_RequestReset';
import { Step2_VerifyResetCode } from './Step2_VerifyResetCode';
import { Step3_SetNewPassword } from './Step3_SetNewPassword';

export const PasswordResetFlow: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');

  const handleStep1Success = (userIdentifier: string) => {
    setIdentifier(userIdentifier);
    setStep(2);
  };

  const handleStep2Success = (code: string) => {
    setVerifiedCode(code);
    setStep(3);
  };

  const handleFlowComplete = () => {
    navigate('/login');
  };

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="w-full">
      <div className="relative h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full"
          >
            {step === 1 && <Step1_RequestReset onSuccess={handleStep1Success} />}
            {step === 2 && <Step2_VerifyResetCode onSuccess={handleStep2Success} identifier={identifier} />}
            {step === 3 && <Step3_SetNewPassword onComplete={handleFlowComplete} identifier={identifier} code={verifiedCode} />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-gray-600 hover:text-cta">
          ‚Üê {t('auth.backToLogin')}
        </Link>
      </div>
    </div>
  );
};