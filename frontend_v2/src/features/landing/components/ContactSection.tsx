// src/features/landing/components/ContactSection.tsx
import { useState } from 'react';
import { useLanguage } from "@/hooks/useLanguage";
import { Card} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { Loader } from "lucide-react";
import { useAdmin } from '@/hooks/api/useAdmin';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export function ContactSection() {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const { submitContact } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContact({
        Name: form.name,
        Email: form.email,
        Message: form.message
      });

      // Clear form and show success message
      // showToast(t('landing.contact.form.success'), { type: 'success' });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      // showToast(t('landing.contact.form.error'), { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className={direction === 'rtl' ? 'order-2' : 'order-1'}>
            <h2 className="text-3xl font-bold mb-6">
              {t('landing.contact.title')}
            </h2>
            <div className="space-y-4">
              {/* Add your contact details here */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/yousefalmazyad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Yousef Almazyad
                </a>
              </div>
            </div>
          </div>

          <Card className={`bg-white/10 backdrop-blur-lg border-0 ${direction === 'rtl' ? 'order-1' : 'order-2'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder={t('landing.contact.form.name')}
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/20 border-0 text-white placeholder:text-white/70"
              />
              <Input
                type="email"
                placeholder={t('landing.contact.form.email')}
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/20 border-0 text-white placeholder:text-white/70"
              />
              <Textarea
                placeholder={t('landing.contact.form.message')}
                value={form.message}
                onChange={(e: { target: { value: any; }; }) => setForm(prev => ({ ...prev, message: e.target.value }))}
                className="bg-white/20 border-0 text-white placeholder:text-white/70"
                rows={4}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t('landing.contact.form.sending')}
                  </>
                ) : (
                  t('landing.contact.form.send')
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
