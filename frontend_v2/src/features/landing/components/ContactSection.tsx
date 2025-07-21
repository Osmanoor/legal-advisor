// src/features/landing/components/ContactSection.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle } from 'lucide-react';
import { useContact } from '@/hooks/api/useContact'; // <-- Import the hook
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';

const GeometricPattern = () => (
    <div className="absolute bottom-0 right-0 opacity-20 text-[#2BB673] pointer-events-none">
        <svg width="404" height="394" viewBox="0 0 404 394" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M201.995 0L403.99 116.622V349.865L201.995 466.487L0 349.865V116.622L201.995 0Z" fill="currentColor" fillOpacity="0.1"/>
            <path d="M201.995 155.496L302.992 213.906V330.726L201.995 389.135L100.997 330.726V213.906L201.995 155.496Z" fill="currentColor" fillOpacity="0.2"/>
            <path d="M201.995 77.7478L353.491 166.057V342.676L201.995 430.985L50.5 342.676V166.057L201.995 77.7478Z" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2"/>
        </svg>
    </div>
);

export const ContactSection: React.FC = () => {
    const { direction } = useLanguage();
    const { showToast } = useToast();
    const { submitContactMutation } = useContact();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        submitContactMutation.mutate(formData, {
            onSuccess: (data) => {
                showToast(data.message || "Message sent successfully!", "success");
                // Clear the form
                setFormData({ name: '', email: '', message: '' });
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ error?: string }>;
                const errorMessage = axiosError.response?.data?.error || 'Failed to send message.';
                showToast(errorMessage, 'error');
            }
        });
    };

    return (
        <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-[#F9F9FD] rounded-xl border border-border-default overflow-hidden relative">
                    <div className="absolute w-96 h-full top-0 left-0 bg-gradient-to-r from-green-100/80 via-green-50/50 to-transparent transform -skew-x-12 -translate-x-1/2 blur-2xl"></div>
                    <GeometricPattern />

                    <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center p-8 md:p-16">
                        <div className={`w-full ${direction === 'rtl' ? 'md:order-2' : ''}`}>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2 text-right"><Label htmlFor="name">الاسم</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="أدخل الاسم" /></div>
                                <div className="space-y-2 text-right"><Label htmlFor="email">البريد الالكتروني</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="أدخل بريدك الالكتروني"/></div>
                                <div className="space-y-2 text-right"><Label htmlFor="message">الرسالة</Label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="فيما ترغب أن نساعدك" className="min-h-[140px]"/></div>
                                <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={submitContactMutation.isPending}>
                                    {submitContactMutation.isPending ? <LoadingSpinner size="sm" /> : "أرسل الرسالة"}
                                </Button>
                            </form>
                        </div>
                        
                        <div className={`text-right space-y-6 ${direction === 'rtl' ? 'md:order-1' : ''}`}>
                             <h2 className="text-4xl md:text-5xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                                تواصل معنا
                            </h2>
                            <p className="text-lg text-gray-500 leading-relaxed">
                                يسعدنا تواصلكم معنا. يرجى تعبئة النموذج وسنرد عليكم في أقرب وقت.
                            </p>
                            <div className="flex justify-end gap-4">
                                <a href="mailto:contact@example.com" aria-label="Email" className="w-16 h-16 bg-[#296436] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <Mail size={32} />
                                </a>
                                <a href="https://wa.me/966000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-16 h-16 bg-[#09D84C] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <MessageCircle size={32} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};