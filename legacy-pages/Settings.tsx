"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { User, Shield, Bell, AlertTriangle, Download } from 'lucide-react';

type SettingsTab = 'account' | 'privacy' | 'notifications';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [notifications, setNotifications] = useState({
    interested: true,
    mutualMatch: true,
    expiring: false,
    unsubscribeAll: false,
  });
  const [privacy, setPrivacy] = useState({
    showGender: true,
    allowTracking: false,
  });

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
          {/* Sidebar */}
          <div className="md:w-48 flex-shrink-0">
            <div className="flex md:flex-col gap-1 p-1 md:p-0 bg-muted md:bg-transparent rounded-lg md:rounded-none">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full transition-colors ${
                    activeTab === tab.key
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

          {/* Content */}
          <div className="flex-1">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="card-base p-6">
                  <h2 className="section-title">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Current Password
                      </label>
                      <input type="password" className="input-base" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        New Password
                      </label>
                      <input type="password" className="input-base" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Confirm New Password
                      </label>
                      <input type="password" className="input-base" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary">Update password</button>
                  </div>
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

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="card-base p-6">
                  <h2 className="section-title">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Show gender preference</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to filter and see your gender
                        </p>
                      </div>
                      <button
                        onClick={() => setPrivacy((p) => ({ ...p, showGender: !p.showGender }))}
                        className={`w-12 h-7 rounded-full relative transition-colors ${
                          privacy.showGender ? 'bg-primary' : 'bg-muted-foreground'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                            privacy.showGender ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Allow profile view tracking</p>
                        <p className="text-sm text-muted-foreground">
                          See who viewed your profile (Premium)
                        </p>
                      </div>
                      <button
                        onClick={() => setPrivacy((p) => ({ ...p, allowTracking: !p.allowTracking }))}
                        className={`w-12 h-7 rounded-full relative transition-colors ${
                          privacy.allowTracking ? 'bg-primary' : 'bg-muted-foreground'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                            privacy.allowTracking ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-base p-6">
                  <h2 className="section-title">Data Export</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a copy of all your data stored on HackMate.
                  </p>
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download my data
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card-base p-6">
                <h2 className="section-title">Email Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Someone is interested in my profile
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone sends you an invitation
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((n) => ({ ...n, interested: !n.interested }))
                      }
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        notifications.interested ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                          notifications.interested ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Mutual match created</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you match with someone
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((n) => ({ ...n, mutualMatch: !n.mutualMatch }))
                      }
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        notifications.mutualMatch ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                          notifications.mutualMatch ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Invitation about to expire</p>
                      <p className="text-sm text-muted-foreground">
                        Remind me before invitations expire
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, expiring: !n.expiring }))}
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        notifications.expiring ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                          notifications.expiring ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <hr className="border-border" />

                  <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div>
                      <p className="font-medium text-foreground">
                        Unsubscribe from all email notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Turn off all email communications
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((n) => ({ ...n, unsubscribeAll: !n.unsubscribeAll }))
                      }
                      className={`w-12 h-7 rounded-full relative transition-colors ${
                        notifications.unsubscribeAll ? 'bg-destructive' : 'bg-muted-foreground'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full transition-transform ${
                          notifications.unsubscribeAll ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

