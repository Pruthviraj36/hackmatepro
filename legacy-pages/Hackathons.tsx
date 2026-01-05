"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar, MapPin, ExternalLink, Plus, Loader2, Search, Trophy } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface Hackathon {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
  website: string | null;
  logo: string | null;
}

export default function Hackathons() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetcher = async (url: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const { data: hackathons = [], isLoading: isQueryLoading } = useQuery<Hackathon[]>({
    queryKey: ['hackathons'],
    queryFn: () => fetcher('/api/hackathons'),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const isLoading = isQueryLoading && hackathons.length === 0;

  const addToHistory = async (hackathonId: string) => {
    if (!token) return;
    setIsAdding(hackathonId);
    try {
      const response = await fetch('/api/hackathons/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hackathonId,
          role: 'Participant',
          result: 'Attended'
        }),
      });

      if (response.ok) {
        toast({ title: 'Added to History', description: 'This hackathon has been added to your profile.' });
      } else {
        const data = await response.json();
        toast({ title: 'Error', description: data.error || 'Failed to add to history', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsAdding(null);
    }
  };

  const filteredHackathons = hackathons.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hackathons</h1>
            <p className="text-muted-foreground mt-2">Discover upcoming events and build your competition history.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hackathons..."
              className="input-base pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredHackathons.map((hackathon, i) => (
                <motion.div
                  key={hackathon.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-base flex flex-col group h-full"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                        {hackathon.logo ? (
                          <img src={hackathon.logo} alt={hackathon.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Trophy className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        {hackathon.website && (
                          <a
                            href={hackathon.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {hackathon.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                      {hackathon.description || 'Join builders from around the world to compete and innovate.'}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        <span>{new Date(hackathon.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(hackathon.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary/60" />
                        <span>{hackathon.location || 'Remote / Online'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-border mt-auto">
                    <button
                      className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                      onClick={() => addToHistory(hackathon.id)}
                      disabled={isAdding === hackathon.id}
                    >
                      {isAdding === hackathon.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Add to My History
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="card-base py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hackathons found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Search for something else or check back later for new events.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
