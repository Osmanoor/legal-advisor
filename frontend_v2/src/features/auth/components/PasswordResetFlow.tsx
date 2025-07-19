// src/features/auth/components/PasswordResetFlow.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { Step1_RequestReset } from './Step1_RequestReset';
import { Step2_VerifyResetCode } from './Step2_VerifyResetCode';
import { Step3_SetNewPassword } from './Step3_SetNewPassword'; // Import the real component

export const PasswordResetFlow: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(''); // Stores the code from step 2

  const handleStep1Success = (userIdentifier: string) => {
    setIdentifier(userIdentifier);
    setStep(2);
  };

  const handleStep2Success = (code: string) => {
    setVerifiedCode(code);
    setStep(3);
  };

  const handleFlowComplete = () => {
    // Navigate the user back to the login page after success
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
          ‚Üê Back to Login
        </Link>
      </div>
    </div>
  );
};