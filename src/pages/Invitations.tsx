import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkillTag } from '@/components/ui/SkillTag';
import { User, Mail, Linkedin, Github, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const sentInvitations = [
  {
    username: 'ml_wizard',
    bio: 'AI/ML engineer focusing on computer vision',
    skills: ['Python', 'TensorFlow'],
    status: 'pending' as const,
    createdAt: '2 days ago',
    expiresIn: '5 days',
  },
  {
    username: 'design_master',
    bio: 'Product designer with a love for clean interfaces',
    skills: ['UI/UX', 'Figma'],
    status: 'accepted' as const,
    createdAt: '5 days ago',
    expiresIn: null,
  },
  {
    username: 'blockchain_bob',
    bio: 'Web3 developer exploring DeFi',
    skills: ['Solidity', 'Ethereum'],
    status: 'rejected' as const,
    createdAt: '1 week ago',
    expiresIn: null,
  },
];

const receivedInvitations = [
  {
    username: 'frontend_girl',
    bio: 'React enthusiast building beautiful UIs',
    skills: ['React', 'CSS', 'TypeScript'],
    message: 'Hey! Love your work on the DeFi Dashboard. Would love to team up for ETHGlobal!',
    createdAt: '1 day ago',
  },
  {
    username: 'rust_master',
    bio: 'Systems programmer with a love for performance',
    skills: ['Rust', 'WebAssembly', 'Go'],
    message: 'Interested in building something together at TreeHacks?',
    createdAt: '3 days ago',
  },
];

const matches = [
  {
    username: 'design_master',
    bio: 'Product designer with a love for clean interfaces',
    skills: ['UI/UX', 'Figma', 'React'],
    hackathons: 6,
    wins: 1,
    email: 'design_master@example.com',
    linkedin: 'linkedin.com/in/designmaster',
    github: 'github.com/designmaster',
  },
  {
    username: 'sarah_coder',
    bio: 'Full-stack developer passionate about scalable apps',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    hackathons: 8,
    wins: 2,
    email: 'sarah@example.com',
    linkedin: 'linkedin.com/in/sarahcoder',
    github: 'github.com/sarahcoder',
  },
];

export default function Invitations() {
  const [activeTab, setActiveTab] = useState<'sent' | 'received' | 'matches'>('received');

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Invitations & Matches</h1>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
          {[
            { key: 'received', label: 'Received', count: receivedInvitations.length },
            { key: 'sent', label: 'Sent', count: sentInvitations.length },
            { key: 'matches', label: 'Matches', count: matches.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentInvitations.map((invitation) => (
              <div key={invitation.username} className="card-base p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">@{invitation.username}</span>
                      <StatusBadge status={invitation.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{invitation.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {invitation.skills.map((skill) => (
                        <SkillTag key={skill} name={skill} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sent {invitation.createdAt}
                      {invitation.expiresIn && ` • Expires in ${invitation.expiresIn}`}
                    </p>
                  </div>
                  {invitation.status === 'pending' && (
                    <button className="btn-ghost text-sm text-destructive">Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Received Tab */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {receivedInvitations.map((invitation) => (
              <div key={invitation.username} className="card-base p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">@{invitation.username}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{invitation.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {invitation.skills.map((skill) => (
                        <SkillTag key={skill} name={skill} />
                      ))}
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg mb-3">
                      <p className="text-sm text-foreground italic">"{invitation.message}"</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Received {invitation.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary p-2" title="Reject">
                      <X className="w-5 h-5" />
                    </button>
                    <button className="btn-primary p-2" title="Accept">
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.username} className="card-base p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">@{match.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {match.hackathons} hackathons • {match.wins} wins
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{match.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {match.skills.map((skill) => (
                        <SkillTag key={skill} name={skill} />
                      ))}
                    </div>
                    {/* Contact Details */}
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground mb-2">Contact Details</h4>
                      <div className="flex flex-wrap gap-4">
                        <a href={`mailto:${match.email}`} className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary">
                          <Mail className="w-4 h-4" />
                          {match.email}
                        </a>
                        <a href={`https://${match.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                        <a href={`https://${match.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary">
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={`/user/${match.username}`} className="btn-secondary text-sm">
                    View profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
