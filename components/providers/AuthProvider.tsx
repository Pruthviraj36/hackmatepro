'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface User {
    id: string;
    email: string;
    username: string;
    name?: string;
    bio?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hackmate_user');
            try { return saved ? JSON.parse(saved) : null; } catch { return null; }
        }
        return null;
    });
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('hackmate_token');
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(() => {
        if (typeof window !== 'undefined') {
            return !localStorage.getItem('hackmate_token');
        }
        return true;
    });
    const router = useRouter();

    useEffect(() => {
        // Just sync loading state in case it was true
        setIsLoading(false);
    }, []);

    const login = (newUser: User, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('hackmate_token', newToken);
        localStorage.setItem('hackmate_user', JSON.stringify(newUser));
        // Clear query cache on login
        queryClient.clear();
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('hackmate_token');
        localStorage.removeItem('hackmate_user');
        // Clear session cookie for middleware
        document.cookie = 'hackmate_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; sameSite=lax';
        // Clear query cache on logout
        queryClient.clear();
        router.push('/login');
    };

    const updateUser = (updatedUserData: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUserData };
            setUser(newUser);
            localStorage.setItem('hackmate_user', JSON.stringify(newUser));
            // Invalidate profile query to ensure fresh data from API
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['discover'] });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
