"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { User, Shield, Bell, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

type SettingsTab = 'account' | 'privacy' | 'notifications';

export default function Settings() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Password updated successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        toast({ title: 'Error', description: data.error || 'Failed to update password', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const tabs = [
    { key: 'account' as SettingsTab, label: 'Account', icon: User },
    { key: 'privacy' as SettingsTab, label: 'Privacy', icon: Shield },
    { key: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-48 flex-shrink-0">
            <div className="flex md:flex-col gap-1 p-1 md:p-0 bg-muted md:bg-transparent rounded-lg md:rounded-none">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full transition-colors ${activeTab === tab.key
                      ? 'bg-card md:bg-accent text-foreground shadow-sm md:shadow-none'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="card-base p-6">
                  <h2 className="section-title">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="input-base"
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="input-base"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="input-base"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isUpdatingPassword ? 'Updating...' : 'Update password'}
                    </button>
                  </form>
                </div>

                <div className="card-base p-6 border-destructive/30">
                  <h2 className="section-title text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you deactivate your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Deactivate account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="card-base p-6 text-center py-20">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">Privacy Settings</h3>
                <p className="text-muted-foreground mt-2">Privacy settings are under construction.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card-base p-6 text-center py-20">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">Notification Settings</h3>
                <p className="text-muted-foreground mt-2">Notification settings are under construction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
