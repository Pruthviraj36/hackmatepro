'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-8 text-center space-y-6"
            >
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                    <p className="text-muted-foreground">
                        An unexpected error occurred. We've been notified and are looking into it.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go to home
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-muted rounded-lg text-left overflow-auto max-h-40">
                        <p className="text-xs font-mono text-muted-foreground whitespace-pre">
                            {error.message}
                            {error.stack}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
