"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SkillTag } from '@/components/ui/SkillTag';
import { InterestTag } from '@/components/ui/InterestTag';
import { User, MapPin, Trophy, Code, ExternalLink, Github, Linkedin, Mail, Twitter, Globe, Loader2, UserPlus, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';

interface UserProfileData {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  skills: string[];
  interests: string[];
  hackathonHistory: {
    role: string | null;
    result: string | null;
    hackathon: { name: string; startDate: string };
  }[];
}

export default function UserProfile({ username: propUsername }: { username?: string }) {
  const params = useParams<{ username: string }>();
  const username = propUsername || params.username;
  const { token, user: authUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!username || !token) return;
      setIsLoading(true);
      try {
        const [profileRes, matchRes] = await Promise.all([
          fetch(`/api/users/${username}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/matches`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);

          if (matchRes.ok) {
            const matches = await matchRes.json();
            setIsMatched(matches.some((m: any) => m.user.id === profileData.id));
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [username, token]);

  const sendInvitation = async () => {
    if (!token || !profile) return;
    setIsSending(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: profile.id,
          message: `Hey @${profile.username}, I'd love to team up!`
        }),
      });

      if (response.ok) {
        toast({ title: 'Invitation Sent', description: 'Your request has been sent successfully.' });
      } else {
        const data = await response.json();
        toast({ title: 'Error', description: data.error || 'Failed to send invitation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground">User not found</h2>
          <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="card-base p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">@{profile.username}</h1>
                {profile.name && <p className="text-muted-foreground">{profile.name}</p>}
                {isMatched && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                    Matched
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {profile.hackathonHistory.length} Hackathons
                </div>
              </div>
              <p className="text-foreground leading-relaxed italic">"{profile.bio || 'This user hasn\'t added a bio yet.'}"</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <h2 className="section-title flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <SkillTag key={skill} name={skill} proficiency="Intermediate" />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills listed.</p>
                )}
              </div>
            </div>

            <div className="card-base p-6">
              <h2 className="section-title">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <InterestTag key={interest} name={interest} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No interests listed.</p>
                )}
              </div>
            </div>

            <div className="card-base p-6">
              <h2 className="section-title flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Hackathon History
              </h2>
              <div className="space-y-4">
                {profile.hackathonHistory.length > 0 ? (
                  profile.hackathonHistory.map((history, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{history.hackathon.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {history.result || 'Participant'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(history.hackathon.startDate).getFullYear()} • {history.role || 'Teammate'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hackathon history yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {isMatched ? (
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Connect
                </h3>
                <div className="space-y-4">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {new URL(profile.website).hostname}
                    </a>
                  )}
                  {profile.github && (
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      {profile.github}
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                      <Twitter className="w-4 h-4 text-muted-foreground" />
                      {profile.twitter}
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      {profile.linkedin}
                    </a>
                  )}
                  {!profile.website && !profile.github && !profile.twitter && !profile.linkedin && (
                    <p className="text-sm text-muted-foreground italic">No social links provided.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card-base p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Want to collaborate?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Send an invitation to @{profile.username}. You'll see their contact details once you're matched!
                </p>
                <button
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  onClick={sendInvitation}
                  disabled={isSending || profile.id === authUser?.id}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {isSending ? 'Sending...' : profile.id === authUser?.id ? 'This is you' : 'Invite to Team'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
