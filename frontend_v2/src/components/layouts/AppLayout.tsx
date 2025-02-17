// src/components/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Container } from './Container';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { LanguageSwitch } from '../common/LanguageSwitch';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { direction } = useLanguage();
  const { isMobile } = useBreakpoint();

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Container className="h-16 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            {/* Add your navigation items here */}
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            {/* Add other header actions here */}
          </div>
        </Container>
      </header>

      <main className="py-6">
        <Container>
          {children || <Outlet />}
        </Container>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <Container>
          {/* Add your footer content here */}
        </Container>
      </footer>
    </div>
  );
}