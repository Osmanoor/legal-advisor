// src/components/layouts/PageLayout.tsx
import { Stack } from './Stack';
import { Container } from './Container';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageLayout({
  title,
  description,
  children,
  actions,
}: PageLayoutProps) {
  return (
    <Stack spacing={6}>
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </Container>

      {children}
    </Stack>
  );
}