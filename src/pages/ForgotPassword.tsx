import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              id="email"
              className="input-base pl-10"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Send reset link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline font-medium">
          ← Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
