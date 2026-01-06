import VerifyEmail from '@/legacy-pages/VerifyEmail';
import { Suspense } from 'react';

export const metadata = {
    title: 'Verify Email - HackMate',
    description: 'Verify your email address to activate your HackMate account',
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <VerifyEmail />
        </Suspense>
    );
}
