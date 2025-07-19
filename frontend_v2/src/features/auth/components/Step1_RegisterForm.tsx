import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialLogins } from './SocialLogins';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';
import { useAuthMutations } from '@/hooks/api/useAuth';
// Import the validator from the library
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import default styles for the library
import './PhoneNumberInput.css'; // Import our custom styles to override and match the design

interface Step1_RegisterFormProps {
  onSuccess: (data: { identifier: string; email?: string, phoneNumber?: string }) => void;
}

export const Step1_RegisterForm: React.FC<Step1_RegisterFormProps> = ({ onSuccess }) => {
  const { showToast } = useToast();
  const { registerMutation } = useAuthMutations();
  
  // State for controlled components
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // --- Sanitize and validate the state right before submission ---
    
    // 1. Trim the email to handle whitespace and treat empty strings as undefined.
    const finalEmail = formData.email.trim() ? formData.email.trim() : undefined;
    
    // 2. Use the library's validator to check if the phone number is valid and possible.
    // If it's not, treat it as undefined, even if it contains just a country code.
    const finalPhoneNumber = phoneNumber && isPossiblePhoneNumber(phoneNumber) ? phoneNumber : undefined;
    
    // 3. Ensure at least one valid identifier was provided.
    if (!finalEmail && !finalPhoneNumber) {
      showToast('Please provide either a valid email or a phone number.', 'error');
      return;
    }

    // 4. Build the payload with the cleaned data.
    const payload = {
        fullName: formData.fullName,
        password: formData.password,
        email: finalEmail,
        phoneNumber: finalPhoneNumber,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        showToast('Registration successful! Please verify your account.', 'success');
        
        // 5. Determine the primary identifier for the next step.
        // Prioritize phone number if both were provided and valid.
        const primaryIdentifier = finalPhoneNumber || finalEmail || '';
        
        onSuccess({ 
            identifier: primaryIdentifier,
            email: finalEmail, 
            phoneNumber: finalPhoneNumber 
        });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="fullName">الأسم بالكامل</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="ادخل الأسم بالكامل"/>
        </div>
        <div>
            <Label htmlFor="email">البريد الألكتروني (اختياري)</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ادخل بريد الاكتروني"/>
        </div>
        
        <div className="space-y-2 text-right">
          <Label htmlFor="phoneNumber">رقم الهاتف (اختياري)</Label>
          <PhoneInput
            international
            defaultCountry="SA"
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="phone-input-container"
            dir="ltr"
          />
        </div>

        <div>
            <Label htmlFor="password">كلمة السر</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="ادخل كلمة السر"/>
        </div>
        <div>
            <Label htmlFor="confirmPassword">تأكيد كلمة السر</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="أعد إدخال كلمة السر"/>
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <LoadingSpinner size="sm" /> : "إنشاء حساب"}
        </Button>
      </form>
      <SocialLogins />
    </div>
  );
};