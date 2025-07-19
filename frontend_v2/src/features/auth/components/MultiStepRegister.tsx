import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from './Stepper';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

import { Step1_RegisterForm } from './Step1_RegisterForm';
import { Step2_VerifyForm } from './Step2_VerifyForm';
import { Step3_AdditionalInfoForm } from './Step3_AdditionalInfoForm';

export const MultiStepRegister = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [registrationData, setRegistrationData] = useState({
        identifier: '',
        email: '',
        phoneNumber: ''
    });

    const steps = [
        'المعلومات الأساسية',
        'التحقق',
        'المعلومات الإضافية',
    ];

    const handleStep1Success = (data: { identifier: string; email?: string; phoneNumber?: string }) => {
        setRegistrationData({
            identifier: data.identifier,
            email: data.email || '',
            phoneNumber: data.phoneNumber || ''
        });
        setStep(2);
    };

    const handleStep2Success = () => {
        setStep(3);
    };

    const handleRegistrationComplete = () => {
        window.location.href = '/chat';
    };

    const variants = {
        enter: { opacity: 0, x: -30 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
    };

    return (
        <div className="w-full">
            <Stepper currentStep={step} steps={steps} />
            
            {/* Set a fixed height container to prevent layout shifts during transitions */}
            <div className="mt-8 relative h-[600px] sm:h-[550px]">
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
                        {step === 1 && <Step1_RegisterForm onSuccess={handleStep1Success} />}
                        {step === 2 && <Step2_VerifyForm onSuccess={handleStep2Success} registrationData={registrationData} />}
                        {step === 3 && <Step3_AdditionalInfoForm onComplete={handleRegistrationComplete} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};