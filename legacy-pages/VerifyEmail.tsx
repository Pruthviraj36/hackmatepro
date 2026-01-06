"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function VerifyEmail() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        if (value && !/^\d$/.test(value)) return; // Only allow numbers

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];

        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);

        // Focus last filled input or first empty
        const lastIndex = Math.min(pastedData.length, 5);
        document.getElementById(`code-${lastIndex}`)?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            toast({
                title: 'Invalid Code',
                description: 'Please enter all 6 digits',
                variant: 'destructive',
            });
            return;
        }

        setIsVerifying(true);

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: verificationCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            toast({
                title: 'Email Verified!',
                description: 'Your account has been activated. Redirecting to login...',
            });

            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (error) {
            toast({
                title: 'Verification Failed',
                description: error instanceof Error ? error.message : 'Invalid or expired code',
                variant: 'destructive',
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle={email ? `We sent a code to ${email}` : 'Enter the 6-digit code from your email'}
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-center gap-3">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-14 h-16 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-ring bg-background text-foreground transition-all"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            disabled={isVerifying}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full py-3 disabled:opacity-50"
                    disabled={isVerifying || code.some(d => !d)}
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Email'
                    )}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button
                        type="button"
                        className="text-primary hover:underline font-medium"
                        onClick={() => toast({ title: 'Resend feature coming soon!' })}
                    >
                        Resend
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
}
