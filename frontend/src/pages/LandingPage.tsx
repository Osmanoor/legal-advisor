import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Search, Book, MessageSquare, Download, Store, Languages, ChevronDown, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatService from '../utils/api';

// Add interfaces for better type safety
interface Stat {
  number: string;
  numericValue: number;  // Added for animation
  label: string;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isAvailable?: boolean;  // Added to control "Coming Soon" status
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ErrorMessage {
  required: string;
  email: string;
  server: string;
  network: string;
}

interface Content {
  [key: string]: {
    title: string;
    subtitle: string;
    description: string;
    searchPlaceholder: string;
    features: Feature[];
    faq: { q: string; a: string }[];
    formErrors: ErrorMessage;
    stats: Stat[];
    cta: string;
    learnMore: string;
    comingSoon: string;
    formSuccess: string;
    formError: string;
  };
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type ErrorType = 'required' | 'email' | 'server' | 'network' | null;

const LandingPage: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedStats, setAnimatedStats] = useState<Stat[]>([]);
  const [contactForm, setContactForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const content: Content = {
    ar: {
      title: "مجتمع المشتريات الحكومية",
      subtitle: "نظام المنافسات والمشتريات الحكومية",
      description: "منصة متكاملة تخص مجتمع المشتريات الحكومية من موظفي وموردين وهي منصة غير رسمية ولا تتبع الى أي جهة حكومية جهد بسيط من زملاء لكم ونرجو ان نقدم من خلالها الفائدة المرجوة علما بانها تحتمل الصواب والخطأ ولا تكفي عن العودة للنظام واللائحة والتعاميم ذات العلاقة",
      searchPlaceholder: "ابحث عن مواد النظام...",
      features: [
        { icon: Search, title: "بحث متقدم", description: "بحث سهل وسريع في مواد النظام بالكلمات", isAvailable: true },
        { icon: MessageSquare, title: "المستشار الذكي", description: "إجابات دقيقة لاستفساراتك في المشتريات الحكومية", isAvailable: true },
        { icon: Book, title: "مكتبة المشتريات", description: "مجموعة شاملة من وثائق المشتريات الحكومية", isAvailable: true },
        // { icon: Store, title: "متجر إلكتروني", description: "يتم خدمتكم بالربط والوساطة بينكم ومقدمي الخدمات المدفوعة للمشتريات مثال على ذلك الكتب والدورات وغيرها من منتجات تخص المشتريات الحكومية بدون اي مقابل", isAvailable: false }
      ],
      faq: [
        {
          q: "كيف يمكنني البحث في النظام؟",
          a: "يمكنك استخدام شريط البحث الرئيسي أو تصفح الأقسام والفصول مباشرة"
        },
        {
          q: "هل الاستشارات مجانية؟",
          a: "نعم، الاستشارات الأساسية مجانية ومدعومة بالذكاء الاصطناعي"
        },
        {
          q: "كيف يمكنني تحميل النظام كاملاً؟",
          a: "يمكنك تحميل النظام كاملاً من قسم مكتبة المشتريات بصيغة PDF"
        }
      ],
      stats: [
        { number: "١٠٠٠+", numericValue: 1000, label: "مادة في النظام" },
        { number: "٥٠٠٠+", numericValue: 5000, label: "مستخدم نشط" },
        { number: "٩٩", numericValue: 99, label: "دقة الإجابات" }
      ],
      formErrors: {
        required: "جميع الحقول مطلوبة",
        email: "يرجى إدخال بريد إلكتروني صحيح",
        server: "حدث خطأ في الخادم",
        network: "حدث خطأ في الاتصال"
      },
      comingSoon: "قريباً",
      formSuccess: "تم إرسال رسالتك بنجاح",
      formError: "حدث خطأ أثناء إرسال الرسالة",
      cta: "ابدأ الآن",
      learnMore: "اكتشف المزيد"
    },
    en: {
      title: "Government Procurement Community",
      subtitle: "Government Procurement & Competition System",
      description: "An integrated platform for the government procurement community including employees and suppliers. This is an unofficial platform, not affiliated with any government entity - a simple effort by your colleagues aiming to provide value, acknowledging that it may contain errors and does not substitute referring to official regulations and related circulars.",
      searchPlaceholder: "Search regulations...",
      features: [
        { icon: Search, title: "Advanced Search", description: "Fast and easy search through regulations", isAvailable: true },
        { icon: MessageSquare, title: "Smart Advisor", description: "Accurate answers for your procurement inquiries", isAvailable: true },
        { icon: Book, title: "Procurement Library", description: "Comprehensive procurement document collection", isAvailable: true },
        { icon: Store, title: "Online Store", description: "We connect you with paid procurement service providers such as books, courses, and other procurement-related products at no additional cost", isAvailable: false }
      ],
      faq: [
        {
          q: "How can I search the regulations?",
          a: "You can use the main search bar or browse through sections and chapters directly"
        },
        {
          q: "Are consultations free?",
          a: "Yes, basic consultations are free and powered by AI"
        },
        {
          q: "How can I download the complete regulation?",
          a: "You can download the complete regulation from the procurement library section in PDF format"
        }
      ],
      stats: [
        { number: "1000+", numericValue: 1000, label: "System Articles" },
        { number: "5000+", numericValue: 5000, label: "Active Users" },
        { number: "99", numericValue: 99, label: "Answer Accuracy" }
      ],
      formErrors: {
        required: "All fields are required",
        email: "Please enter a valid email",
        server: "Server error occurred",
        network: "Network error occurred"
      },
      comingSoon: "Coming Soon",
      formSuccess: "Message sent successfully",
      formError: "Error sending message",
      cta: "Get Started",
      learnMore: "Learn More"
    }
  };

  const animateStats = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const stats = content[language].stats;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      const animatedValues = stats.map(stat => ({
        ...stat,
        number: Math.round(stat.numericValue * progress).toString() + (stat.number.includes('+') ? '+' : '')
      }));

      setAnimatedStats(animatedValues);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
  };

  // Stats animation
  useEffect(() => {
    setIsVisible(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/chat', { state: { initialQuestion: searchQuery } });
    }
  };

  // Handle contact form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setFormStatus('error');
      setErrorType('required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setFormStatus('error');
      setErrorType('email');
      return;
    }

    setFormStatus('loading');
    setErrorType(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        setFormStatus('success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
        setErrorType('server');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorType('network');
    }
  };

  // Feature Card Component
  const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    const handleClick = () => {
      if (feature.isAvailable && feature.icon === MessageSquare) {
        navigate('/chat');
      }
      if (feature.isAvailable && feature.icon === Search) {
        navigate('/search');
      }
      if (feature.isAvailable && feature.icon === Book) {
        navigate('/library');
      }
    };

    return (
      <div
        className={`relative p-6 rounded-xl bg-white shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden
          ${feature.isAvailable ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {!feature.isAvailable && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/50 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100">
            <span className="text-white text-lg font-semibold">
              {content[language].comingSoon}
            </span>
          </div>
        )}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <feature.icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    );
  };

  const gradientBg = "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500";
  const buttonHoverEffect = "transform hover:scale-105 transition-all duration-300";

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      {/* Floating Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Logo
          </h1>
          <button
            onClick={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            <Languages size={20} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      {/* Hero Section with Animation */}
      <div className={`${gradientBg} text-white pt-32 pb-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                {content[language].title}
              </h1>
              <p className="text-xl opacity-90">
                {content[language].description}
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigate('/chat')} className={`px-8 py-4 bg-white text-blue-600 rounded-full font-semibold ${buttonHoverEffect}`}>
                  {content[language].cta}
                </button>
                <button className={`px-8 py-4 border-2 border-white text-white rounded-full font-semibold ${buttonHoverEffect}`}>
                  {content[language].learnMore}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-6"></div>
              <img
                src="images/legal-bot.jpg"
                alt="Legal System Interface"
                className="rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              placeholder={content[language].searchPlaceholder}
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none text-lg"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <Search className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-wrap justify-between gap-8">
          {content[language].features.map((feature, index) => (
            <div className="flex-1 min-w-[250px]">
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={statsRef} className="grid md:grid-cols-3 gap-8">
            {animatedStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {content[language].faq.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className={`${gradientBg} text-white py-24`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6" />
                  <span>+966 12 345 6789</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6" />
                  <span>contact@legaladvisor.sa</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6" />
                  <span>Riyadh, Saudi Arabia</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                ></textarea>
                <button
                  disabled={formStatus === 'loading'}
                  className={`w-full px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold ${buttonHoverEffect}
                  ${formStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus === 'success' && (
                  <div className="text-green-400 text-center">{content[language].formSuccess}</div>
                )}
                {formStatus === 'error' && (
                  <div className="text-red-400 text-center">
                    {errorType && content[language].formErrors[errorType]}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Government Procurement Community</h3>
              <p className="text-gray-400">© 2024 All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;