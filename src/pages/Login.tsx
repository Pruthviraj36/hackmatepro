import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to HackMate"
    >
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="input-base"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="input-base"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
