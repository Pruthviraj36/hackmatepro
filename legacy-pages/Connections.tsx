'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Mail, Github, Linkedin, Twitter, Globe, MessageSquare, ExternalLink, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    website: string | null;
}

interface Match {
    id: string;
    user: User;
    matchedAt: string;
}

const fetcher = async (url: string, token: string | null) => {
    if (!token) return null;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

export default function Connections() {
    const { token, user: authUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const { data: matches, isLoading } = useQuery<Match[]>({
        queryKey: ['matches'],
        queryFn: () => fetcher('/api/matches', token),
        enabled: !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <motion.h1
                        className="text-3xl font-bold text-foreground"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        My Connections
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground mt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Build your dream team from your accepted matches.
                    </motion.p>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Finding your connections...</p>
                    </div>
                ) : matches && matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {matches.map((match, i) => (
                                <motion.div
                                    key={match.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card-base p-6 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => router.push(`/user/${match.user.username}`)}
                                            className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                            title="View Profile"
                                        >
                                            <ExternalLink className="w-4 h-4 text-primary" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-border overflow-hidden flex-shrink-0">
                                            {match.user.avatar ? (
                                                <img src={match.user.avatar} alt={match.user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <UserIcon className="w-8 h-8 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground line-clamp-1">@{match.user.username}</h3>
                                            {match.user.name && <p className="text-sm text-muted-foreground">{match.user.name}</p>}
                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                                                Matched on {new Date(match.matchedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {match.user.bio && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 italic">
                                            "{match.user.bio}"
                                        </p>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-3">
                                            {match.user.github && (
                                                <a
                                                    href={`https://github.com/${match.user.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-muted rounded-lg hover:text-primary transition-colors"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {match.user.linkedin && (
                                                <a
                                                    href={`https://linkedin.com/in/${match.user.linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-muted rounded-lg hover:text-primary transition-colors"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {match.user.twitter && (
                                                <a
                                                    href={`https://twitter.com/${match.user.twitter}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-muted rounded-lg hover:text-primary transition-colors"
                                                >
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                            {match.user.website && (
                                                <a
                                                    href={match.user.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-muted rounded-lg hover:text-primary transition-colors"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button className="p-2 bg-muted rounded-lg hover:text-primary transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                                            onClick={() => toast({ title: 'Messaging coming soon!', description: 'Team chat feature is under development.' })}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Message
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        className="py-20 text-center card-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No connections yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                            Once you accept an invitation or someone accepts yours, they'll appear here.
                        </p>
                        <button
                            onClick={() => router.push('/discover')}
                            className="mt-6 btn-primary px-8"
                        >
                            Discover People
                        </button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
