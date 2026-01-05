import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { AnimatedPage } from '@/components/animations/AnimatedPage';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnimatedPage>
        <main className="page-container">
          {children}
        </main>
      </AnimatedPage>
    </div>
  );
}
