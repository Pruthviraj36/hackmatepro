"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SkillTag } from '@/components/ui/SkillTag';
import { SkillPicker } from '@/components/ui/SkillPicker';
import { Filter, UserPlus, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  skills: string[];
  interests: string[];
  _count: {
    hackathonHistory: number;
  };
}

export default function Discover() {
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isSending, setIsSending] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<{ name: string, proficiency: any }[]>([]);

  const fetcher = async (url: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const skillNames = selectedSkills.map(s => s.name).join(',');

  const { data: users, isLoading: isQueryLoading } = useQuery<User[]>({
    queryKey: ['discover', skillNames],
    queryFn: () => fetcher(`/api/users/discover?skills=${skillNames}`),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes cache for discovery
  });

  const isLoading = isQueryLoading && !users;

  const sendInvitation = async (receiverId: string) => {
    if (!token) return;
    setIsSending(receiverId);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId,
          message: 'Hey! I saw your profile and would love to team up for a hackathon.'
        }),
      });

      if (response.ok) {
        toast({ title: 'Invitation Sent', description: 'Your invitation has been sent successfully.' });
      } else {
        const data = await response.json();
        toast({ title: 'Error', description: data.error || 'Failed to send invitation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsSending(null);
    }
  };

  const prefetchProfile = async (username: string) => {
    if (!token) return;
    await queryClient.prefetchQuery({
      queryKey: ['user-profile', username],
      queryFn: () => fetcher(`/api/users/${username}`),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Discover Teammates</h1>
          <p className="text-muted-foreground mt-2">Find the perfect partners for your next hackathon project.</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SkillPicker
              selectedSkills={selectedSkills}
              onAddSkill={(name) => setSelectedSkills([...selectedSkills, { name, proficiency: 'Intermediate' }])}
              onRemoveSkill={(name) => setSelectedSkills(selectedSkills.filter(s => s.name !== name))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedSkills.map(skill => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <SkillTag
                    name={skill.name}
                    proficiency="Intermediate"
                    removable
                    onRemove={() => setSelectedSkills(selectedSkills.filter(s => s.name !== skill.name))}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {users.map((user, i) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-base flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/user/${user.username}`)}
                        onMouseEnter={() => prefetchProfile(user.username)}
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3
                          className="font-bold text-lg text-foreground hover:text-primary transition-colors cursor-pointer"
                          onClick={() => router.push(`/user/${user.username}`)}
                          onMouseEnter={() => prefetchProfile(user.username)}
                        >
                          @{user.username}
                        </h3>
                        {user.name && <p className="text-sm text-muted-foreground">{user.name}</p>}
                        <p className="text-xs text-primary font-medium mt-1">
                          {user._count.hackathonHistory} Hackathons
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                      {user.bio || 'No bio provided yet.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {user.skills.slice(0, 4).map(skill => (
                        <SkillTag key={skill} name={skill} />
                      ))}
                      {user.skills.length > 4 && (
                        <span className="text-xs text-muted-foreground py-1 px-2">+{user.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-border flex gap-2">
                    <button
                      className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2"
                      onClick={() => sendInvitation(user.id)}
                      disabled={isSending === user.id}
                    >
                      {isSending === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      Invite
                    </button>
                    <button
                      className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center gap-2"
                      onClick={() => router.push(`/user/${user.username}`)}
                      onMouseEnter={() => prefetchProfile(user.username)}
                    >
                      Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 card-base">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No teammates found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              Try adjusting your filters or search terms to find more potential teammates.
            </p>
            <button
              className="mt-6 text-primary hover:underline font-medium"
              onClick={() => setSelectedSkills([])}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
