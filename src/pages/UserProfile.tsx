import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SkillTag } from '@/components/ui/SkillTag';
import { InterestTag } from '@/components/ui/InterestTag';
import { HackathonTag } from '@/components/ui/HackathonTag';
import { User, MapPin, Clock, Trophy, Code, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';

const user = {
  username: 'sarah_coder',
  bio: 'Full-stack developer passionate about building scalable web applications. Love React and Node.js! I enjoy tackling complex problems and creating elegant solutions. Looking for teammates who are passionate and collaborative.',
  location: 'San Francisco, CA',
  timezone: 'PST (UTC-8)',
  experienceLevel: 'Advanced',
  lookingForTeammates: true,
  skills: [
    { name: 'React', proficiency: 'Expert' as const },
    { name: 'Node.js', proficiency: 'Expert' as const },
    { name: 'TypeScript', proficiency: 'Intermediate' as const },
    { name: 'PostgreSQL', proficiency: 'Intermediate' as const },
    { name: 'AWS', proficiency: 'Basic' as const },
    { name: 'Docker', proficiency: 'Basic' as const },
  ],
  interests: ['Web Dev', 'AI/ML', 'DevTools', 'Open Source'],
  hackathonHistory: [
    {
      name: 'ETHGlobal 2024',
      date: 'Nov 2024',
      role: 'Full-stack Developer',
      projectName: 'DeFi Dashboard',
      projectLink: 'https://github.com/sarah/defi-dashboard',
      teamSize: 4,
      achievement: 'Winner',
    },
    {
      name: 'HackMIT 2024',
      date: 'Sep 2024',
      role: 'Frontend Lead',
      projectName: 'EcoTrack',
      projectLink: 'https://ecotrack.demo.com',
      teamSize: 3,
      achievement: 'Runner-up',
    },
    {
      name: 'TreeHacks 2024',
      date: 'Feb 2024',
      role: 'Backend Developer',
      projectName: 'HealthConnect',
      projectLink: 'https://github.com/sarah/healthconnect',
      teamSize: 5,
      achievement: 'Participant',
    },
  ],
  currentHackathons: ['ETHGlobal 2025', 'TreeHacks 2025'],
  email: 'sarah@example.com',
  linkedin: 'linkedin.com/in/sarah-coder',
  github: 'github.com/sarah-coder',
};

const achievementColors: Record<string, string> = {
  Winner: 'bg-yellow-100 text-yellow-800',
  'Runner-up': 'bg-gray-100 text-gray-800',
  Participant: 'bg-blue-100 text-blue-800',
};

export default function UserProfile() {
  const isMutualMatch = true; // Demo state

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card-base p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">@{user.username}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                  {user.experienceLevel}
                </span>
                {user.lookingForTeammates && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Looking for teammates
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {user.timezone}
                </div>
              </div>
              <p className="text-foreground">{user.bio}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="card-base p-6">
              <h2 className="section-title flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <SkillTag key={skill.name} name={skill.name} proficiency={skill.proficiency} />
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="card-base p-6">
              <h2 className="section-title">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <InterestTag key={interest} name={interest} />
                ))}
              </div>
            </div>

            {/* Hackathon History */}
            <div className="card-base p-6">
              <h2 className="section-title flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Hackathon History
              </h2>
              <div className="space-y-4">
                {user.hackathonHistory.map((hackathon, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{hackathon.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${achievementColors[hackathon.achievement]}`}>
                          {hackathon.achievement}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{hackathon.date} • {hackathon.role}</p>
                      <p className="text-sm text-foreground">
                        {hackathon.projectName} • Team of {hackathon.teamSize}
                      </p>
                    </div>
                    <a
                      href={hackathon.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline mt-2 sm:mt-0"
                    >
                      View project <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Hackathons */}
            <div className="card-base p-6">
              <h3 className="font-semibold text-foreground mb-3">Looking for teammates in</h3>
              <div className="flex flex-wrap gap-2">
                {user.currentHackathons.map((h) => (
                  <HackathonTag key={h} name={h} />
                ))}
              </div>
            </div>

            {/* Action / Contact */}
            <div className="card-base p-6">
              {isMutualMatch ? (
                <>
                  <h3 className="font-semibold text-foreground mb-3">Contact Details</h3>
                  <div className="space-y-3">
                    <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </a>
                    <a href={`https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
                      <Linkedin className="w-4 h-4" />
                      {user.linkedin}
                    </a>
                    <a href={`https://${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
                      <Github className="w-4 h-4" />
                      {user.github}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn-primary w-full">Interested</button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Contact details are visible after mutual match
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
