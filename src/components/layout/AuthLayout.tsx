import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">HackMate</span>
        </Link>

        {/* Card */}
        <div className="card-base p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
