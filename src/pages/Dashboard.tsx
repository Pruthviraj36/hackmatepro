import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { ActivityItem } from '@/components/ui/ActivityItem';
import { Mail, Users, BarChart3 } from 'lucide-react';

const stats = [
  { title: 'Pending Invitations', value: 3, icon: <Mail className="w-5 h-5 text-primary" /> },
  { title: 'Mutual Matches', value: 5, icon: <Users className="w-5 h-5 text-primary" /> },
  { title: 'Profile Completeness', value: '75%', icon: <BarChart3 className="w-5 h-5 text-primary" />, progress: 75 },
];

const checklist = [
  { text: 'Complete your profile', completed: true },
  { text: 'Add at least 3 skills', completed: true },
  { text: 'Add hackathon history', completed: false },
  { text: 'Start discovering teammates', completed: false },
];

const activities = [
  { type: 'invitation_received' as const, message: 'You received an invitation from @user123', time: '2 hours ago' },
  { type: 'invitation_accepted' as const, message: 'Invitation accepted with @frontend_girl', time: '5 hours ago' },
  { type: 'match' as const, message: 'You matched with @backend_dev!', time: '1 day ago' },
  { type: 'invitation_rejected' as const, message: '@hacker2024 declined your invitation', time: '2 days ago' },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, @alexdev 👋</h1>
        <p className="text-muted-foreground">Find your perfect hackathon teammates</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Getting Started */}
          <div className="card-base p-6">
            <h2 className="section-title">Get Started</h2>
            <div className="space-y-2">
              {checklist.map((item) => (
                <ChecklistItem key={item.text} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card-base p-6">
          <h2 className="section-title">Recent Activity</h2>
          <div className="space-y-1">
            {activities.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
