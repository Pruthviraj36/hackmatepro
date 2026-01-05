"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HackathonTag } from '@/components/ui/HackathonTag';
import { Calendar, List, MapPin, Users, ExternalLink, Edit2 } from 'lucide-react';

const hackathons = [
  {
    id: 1,
    name: 'ETHGlobal 2025',
    dates: 'March 15-17, 2025',
    location: 'San Francisco, CA',
    description: 'Build the future of Ethereum. 48 hours of hacking, $100k+ in prizes.',
    participants: '2,500+',
    interested: true,
  },
  {
    id: 2,
    name: 'TreeHacks 2025',
    dates: 'February 14-16, 2025',
    location: 'Stanford University',
    description: 'Stanford\'s flagship hackathon. Build for good, build for fun.',
    participants: '1,200+',
    interested: false,
  },
  {
    id: 3,
    name: 'HackMIT 2025',
    dates: 'September 13-15, 2025',
    location: 'MIT Campus',
    description: 'One of the largest collegiate hackathons in the world.',
    participants: '1,500+',
    interested: false,
  },
  {
    id: 4,
    name: 'CalHacks 2025',
    dates: 'October 18-20, 2025',
    location: 'UC Berkeley',
    description: 'The largest collegiate hackathon on the West Coast.',
    participants: '2,000+',
    interested: true,
  },
];

const myParticipations = [
  {
    name: 'ETHGlobal 2024',
    status: 'Completed',
    projectName: 'DeFi Dashboard',
    achievement: 'Participant',
  },
  {
    name: 'ETHGlobal 2025',
    status: 'Upcoming',
    projectName: null,
    achievement: null,
  },
];

export default function Hackathons() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [interestedHackathons, setInterestedHackathons] = useState<number[]>([1, 4]);

  const toggleInterested = (id: number) => {
    setInterestedHackathons((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Hackathons</h1>
            <p className="text-muted-foreground">Find upcoming hackathons and track your participation</p>
          </div>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hackathon List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="section-title">Upcoming Hackathons</h2>

            {viewMode === 'list' ? (
              <div className="space-y-4">
                {hackathons.map((hackathon) => (
                  <div key={hackathon.id} className="card-base card-hover p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{hackathon.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {hackathon.dates}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hackathon.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {hackathon.participants}
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{hackathon.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => toggleInterested(hackathon.id)}
                          className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                            interestedHackathons.includes(hackathon.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {interestedHackathons.includes(hackathon.id) ? 'Interested ✓' : 'Mark interested'}
                        </button>
                        <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                          Learn more <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Calendar View (placeholder) */
              <div className="card-base p-6">
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5;
                    const isHighlighted = day === 15 || day === 16 || day === 17;
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                          day < 1 || day > 31
                            ? 'text-muted-foreground/50'
                            : isHighlighted
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">March 15-17: ETHGlobal 2025</p>
                  <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            )}
          </div>

          {/* Your Participation */}
          <div className="space-y-4">
            <h2 className="section-title">Your Participation</h2>
            <div className="card-base p-5">
              {myParticipations.length > 0 ? (
                <div className="space-y-4">
                  {myParticipations.map((participation, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <HackathonTag name={participation.name} />
                        <button className="p-1 hover:bg-muted rounded">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className={`text-xs font-medium ${
                        participation.status === 'Upcoming' ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {participation.status}
                      </p>
                      {participation.projectName && (
                        <p className="text-sm text-foreground mt-1">
                          Project: {participation.projectName}
                        </p>
                      )}
                      {participation.achievement && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {participation.achievement}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hackathon participation yet.</p>
              )}
            </div>

            {/* Interested In */}
            <div className="card-base p-5">
              <h3 className="font-semibold text-foreground mb-3">Looking for teammates in</h3>
              <div className="flex flex-wrap gap-2">
                {hackathons
                  .filter((h) => interestedHackathons.includes(h.id))
                  .map((h) => (
                    <HackathonTag key={h.id} name={h.name} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

