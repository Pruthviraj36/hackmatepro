"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkillTag } from '@/components/ui/SkillTag';
import { InterestTag } from '@/components/ui/InterestTag';
import { SkillPicker } from '@/components/ui/SkillPicker';
import { User, Camera, Plus, Trash2, Edit2, Github, Twitter, Linkedin, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const availableInterests = ['Web Dev', 'AI/ML', 'Cybersecurity', 'Game Dev', 'DevTools', 'Web3', 'Mobile', 'Open Source'];

export default function MyProfile() {
  const { token, user: authUser, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    location: '',
    github: '',
    twitter: '',
    linkedin: '',
    website: '',
    skills: [] as { name: string; proficiency: 'Basic' | 'Intermediate' | 'Expert' }[],
    interests: [] as string[],
  });

  const [hackathons, setHackathons] = useState([
    {
      name: 'ETHGlobal 2024',
      date: 'Nov 2024',
      role: 'Full-stack Developer',
      projectName: 'DeFi Dashboard',
      projectLink: 'https://github.com/alexdev/defi-dashboard',
      teamSize: 4,
      achievement: 'Participant',
    },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Transform simple string[] skills to our object structure for the UI
          const transformedSkills = (data.skills || []).map((s: string) => ({
            name: s,
            proficiency: 'Intermediate' as const
          }));

          setFormData({
            name: data.name || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            location: data.location || '',
            github: data.github || '',
            twitter: data.twitter || '',
            linkedin: data.linkedin || '',
            website: data.website || '',
            skills: transformedSkills,
            interests: data.interests || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.map(s => s.name), // Flatten for DB
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser({
          name: updatedUser.name,
          username: updatedUser.username,
        });
        toast({ title: 'Success', description: 'Profile updated successfully' });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'File too large (max 5MB)', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const profileCompleteness = (() => {
    let score = 0;
    if (formData.avatar) score += 25;
    if (formData.skills.length >= 3) score += 25;
    if (hackathons.length >= 1) score += 25;
    if (formData.bio.length >= 50) score += 25;
    return score;
  })();

  const completenessItems = [
    { text: 'Add profile picture', done: !!formData.avatar },
    { text: 'Add at least 3 skills', done: formData.skills.length >= 3 },
    { text: 'Add 1 past hackathon', done: hackathons.length >= 1 },
    { text: 'Add bio (min 50 chars)', done: formData.bio.length >= 50 },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <motion.h1
          className="text-3xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Edit Profile
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="card-base p-6">
              <h2 className="section-title">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden border border-border">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-primary" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                      <Camera className="w-4 h-4 text-primary-foreground" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Profile Picture</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                    <input type="text" className="input-base bg-muted" value={authUser?.username || ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                    <input
                      type="text"
                      className="input-base"
                      placeholder="Alex Developer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                  <textarea
                    className="input-base min-h-[100px] resize-none"
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/500 characters</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                    <input
                      type="text"
                      className="input-base"
                      placeholder="San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                    <input
                      type="url"
                      className="input-base"
                      placeholder="https://alex.dev"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card-base p-6">
              <h2 className="section-title">Social Links</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="input-base pl-10"
                    placeholder="GitHub username"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="input-base pl-10"
                    placeholder="Twitter username"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="input-base pl-10"
                    placeholder="LinkedIn username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="card-base p-6">
              <h2 className="section-title">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence mode="popLayout">
                  {formData.skills.map((skill) => (
                    <motion.div key={skill.name} layout>
                      <SkillTag
                        name={skill.name}
                        proficiency={skill.proficiency}
                        removable
                        onRemove={() => setFormData({
                          ...formData,
                          skills: formData.skills.filter(s => s.name !== skill.name)
                        })}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <SkillPicker
                selectedSkills={formData.skills}
                onAddSkill={(name) => setFormData({
                  ...formData,
                  skills: [...formData.skills, { name, proficiency: 'Intermediate' }]
                })}
                onRemoveSkill={(name) => setFormData({
                  ...formData,
                  skills: formData.skills.filter(s => s.name !== name)
                })}
              />
            </motion.div>

            <motion.div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">Projects</h2>
                <button className="btn-secondary text-sm py-2 flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add project
                </button>
              </div>
              <p className="text-sm text-muted-foreground italic text-center py-6 border-2 border-dashed border-border rounded-xl">
                Showcase your best work here. Coming soon!
              </p>
            </motion.div>

            <div className="flex justify-end gap-3 pt-4">
              <button className="btn-secondary">Cancel</button>
              <button
                className="btn-primary flex items-center gap-2"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-base p-6 lg:sticky lg:top-24">
              <h3 className="font-semibold text-foreground mb-4">Profile Completeness</h3>
              <ProgressBar value={profileCompleteness} label="" showPercentage />
              <div className="mt-4 space-y-2">
                {completenessItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-primary' : 'border-2 border-muted-foreground'
                      }`}>
                      {item.done && <span className="text-primary-foreground text-xs">✓</span>}
                    </div>
                    <span className={item.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
