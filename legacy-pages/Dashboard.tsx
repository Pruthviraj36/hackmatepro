"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { ActivityItem } from '@/components/ui/ActivityItem';
import { SkeletonStatCard } from '@/components/ui/SkeletonCard';
import { Mail, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function Dashboard() {
  const { token, user: authUser } = useAuth();

  const fetcher = async (url: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const { data: invitations, isLoading: isInvLoading } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => fetcher('/api/invitations'),
    enabled: !!token,
  });

  const { data: matches, isLoading: isMatchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetcher('/api/matches'),
    enabled: !!token,
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: () => fetcher('/api/users/me'),
    enabled: !!token,
  });

  // Only show skeletons if we have NO data at all
  const isInitialLoading =
    (isInvLoading && !invitations) ||
    (isMatchesLoading && !matches) ||
    (isProfileLoading && !profile);

  const isLoading = isInitialLoading;

  const { stats, checklist, activities } = useMemo(() => {
    if (!invitations || !matches || !profile || !authUser) {
      return { stats: [], checklist: [], activities: [] };
    }

    const pendingCount = invitations.filter((inv: any) =>
      inv.receiverId === authUser.id && inv.status === 'PENDING'
    ).length;

    const acceptedCount = matches.length;

    // Calculate profile completeness
    let score = 0;
    if (profile.avatar) score += 34;
    if ((profile.skills || []).length >= 3) score += 33;
    if ((profile.bio || '').length >= 5) score += 33;
    if (score > 100) score = 100;

    const statsData = [
      { title: 'Pending Invitations', value: pendingCount, icon: <Mail className="w-5 h-5 text-primary" /> },
      { title: 'Mutual Matches', value: acceptedCount, icon: <Users className="w-5 h-5 text-primary" /> },
      { title: 'Profile Status', value: `${score}%`, icon: <BarChart3 className="w-5 h-5 text-primary" />, progress: score },
    ];

    const checklistData = [
      { text: 'Write a short bio', completed: (profile.bio || '').length >= 5 },
      { text: 'Add at least 3 skills', completed: (profile.skills || []).length >= 3 },
      { text: 'Connect with a teammate', completed: matches.length > 0 },
    ];

    // Transform actual invitations and matches into activities
    const incomingInvitations = invitations
      .filter((inv: any) => inv.receiverId === authUser.id)
      .map((inv: any) => ({
        type: inv.status === 'ACCEPTED' ? 'match' : 'invitation_received',
        message: inv.status === 'ACCEPTED'
          ? `You matched with @${inv.sender.username}!`
          : `Invitation from @${inv.sender.username}`,
        time: new Date(inv.updatedAt).toLocaleDateString(),
        timestamp: new Date(inv.updatedAt).getTime()
      }));

    const outgoingInvitations = invitations
      .filter((inv: any) => inv.senderId === authUser.id)
      .map((inv: any) => ({
        type: inv.status === 'ACCEPTED' ? 'match' : 'invitation_sent',
        message: inv.status === 'ACCEPTED'
          ? `Matched with @${inv.receiver.username}!`
          : `Sent invitation to @${inv.receiver.username}`,
        time: new Date(inv.updatedAt).toLocaleDateString(),
        timestamp: new Date(inv.updatedAt).getTime()
      }));

    const recentActivities = [...incomingInvitations, ...outgoingInvitations]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    return { stats: statsData, checklist: checklistData, activities: recentActivities };
  }, [invitations, matches, profile, authUser]);

  return (
    <DashboardLayout>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hello, @{authUser?.username} 👋
        </h1>
        <p className="text-muted-foreground">Welcome to your HackMate dashboard.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              stats.map((stat: any, i: number) => (
                <StatCard key={stat.title} {...stat} index={i} />
              ))
            )}
          </div>

          <motion.div
            className="card-base p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="section-title">Your Progress</h2>
            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : (
                checklist.map((item: any, i: number) => (
                  <ChecklistItem key={item.text} {...item} index={i} />
                ))
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="card-base p-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="section-title">Recent Activity</h2>
          <div className="space-y-1">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity: any, i: number) => (
                <ActivityItem key={i} {...activity} index={i} />
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
