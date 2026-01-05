"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Check, X, Clock, Send, Inbox, Loader2, User as UserIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
}

interface Invitation {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message: string | null;
  createdAt: string;
  sender: User;
  receiver: User;
}

export default function Invitations() {
  const { token, user: authUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const fetchInvitations = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/invitations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Failed to fetch invitations', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [token]);

  const handleStatusUpdate = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!token) return;
    setProcessingId(id);
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: status === 'ACCEPTED' ? 'Invitation Accepted' : 'Invitation Rejected',
          description: status === 'ACCEPTED' ? "You've successfully matched with a teammate!" : "Invitation declined."
        });
        // Update local state instead of refetching everything
        setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
      } else {
        const data = await response.json();
        toast({ title: 'Error', description: data.error || 'Failed to update invitation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const receivedInvitations = invitations.filter(inv => inv.receiverId === authUser?.id);
  const sentInvitations = invitations.filter(inv => inv.senderId === authUser?.id);

  const displayedInvitations = activeTab === 'received' ? receivedInvitations : sentInvitations;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Invitations</h1>
          <p className="text-muted-foreground mt-2">Manage your connections and teammate requests.</p>
        </header>

        {/* Tabs */}
        <div className="flex bg-muted p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'received' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Inbox className="w-4 h-4" />
            Received
            {receivedInvitations.filter(i => i.status === 'PENDING').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'sent' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Send className="w-4 h-4" />
            Sent
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : displayedInvitations.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {displayedInvitations.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-base p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/user/${activeTab === 'received' ? inv.sender.username : inv.receiver.username}`)}
                      >
                        {(activeTab === 'received' ? inv.sender.avatar : inv.receiver.avatar) ? (
                          <img
                            src={activeTab === 'received' ? inv.sender.avatar! : inv.receiver.avatar!}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">
                          @{activeTab === 'received' ? inv.sender.username : inv.receiver.username}
                        </h3>
                        {(activeTab === 'received' ? inv.sender.name : inv.receiver.name) && (
                          <p className="text-sm text-muted-foreground">
                            {activeTab === 'received' ? inv.sender.name : inv.receiver.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${inv.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                            inv.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500' :
                              'bg-destructive/10 text-destructive'
                            }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'received' && inv.status === 'PENDING' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleStatusUpdate(inv.id, 'ACCEPTED')}
                          disabled={!!processingId}
                          className="btn-primary flex-1 sm:flex-initial py-2 px-4 shadow-primary/20 shadow-lg"
                        >
                          {processingId === inv.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(inv.id, 'REJECTED')}
                          disabled={!!processingId}
                          className="btn-secondary flex-1 sm:flex-initial py-2 px-4"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>

                  {inv.message && (
                    <div className="mt-4 p-3 bg-muted rounded-lg flex gap-3">
                      <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground italic">"{inv.message}"</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="card-base py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'received' ? <Inbox className="w-8 h-8 text-muted-foreground" /> : <Send className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h3 className="text-xl font-bold text-foreground">No {activeTab} invitations</h3>
              <p className="text-muted-foreground mt-2">
                {activeTab === 'received'
                  ? "You haven't received any teammate requests yet."
                  : "Go to the Discovery page to find and invite potential teammates!"}
              </p>
              {activeTab === 'sent' && (
                <button
                  onClick={() => router.push('/discover')}
                  className="mt-6 btn-primary px-8"
                >
                  Discover teammates
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
