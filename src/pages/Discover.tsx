import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCard } from '@/components/ui/UserCard';
import { SkeletonUserCard } from '@/components/ui/SkeletonCard';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/use-toast';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const allSkills = ['React', 'Python', 'TypeScript', 'Node.js', 'Machine Learning', 'UI/UX', 'Rust', 'Go', 'Flutter', 'Docker'];
const hackathons = ['ETHGlobal 2025', 'TreeHacks 2025', 'HackMIT 2025', 'CalHacks 2025'];

const mockUsers = [
  {
    username: 'sarah_coder',
    bio: 'Full-stack developer passionate about building scalable web applications. Love React and Node.js!',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    hackathons: 8,
    wins: 2,
  },
  {
    username: 'ml_wizard',
    bio: 'AI/ML engineer focusing on computer vision and NLP. Always looking for interesting projects.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
    hackathons: 12,
    wins: 4,
  },
  {
    username: 'design_master',
    bio: 'Product designer with a love for clean, intuitive interfaces. Figma enthusiast.',
    skills: ['UI/UX', 'Figma', 'React', 'CSS', 'Prototyping'],
    hackathons: 6,
    wins: 1,
  },
  {
    username: 'blockchain_bob',
    bio: 'Web3 developer exploring DeFi and smart contracts. Solidity is my second language.',
    skills: ['Solidity', 'Ethereum', 'React', 'TypeScript', 'Hardhat', 'IPFS'],
    hackathons: 15,
    wins: 5,
  },
  {
    username: 'mobile_mary',
    bio: 'Cross-platform mobile developer. Flutter and React Native are my tools of choice.',
    skills: ['Flutter', 'React Native', 'Dart', 'Firebase', 'iOS', 'Android'],
    hackathons: 4,
    wins: 0,
  },
  {
    username: 'devops_dan',
    bio: 'Infrastructure engineer who loves automation. CI/CD pipelines are my jam.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'Linux'],
    hackathons: 7,
    wins: 2,
  },
];

export default function Discover() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const isLoading = useLoading(1000);
  const { toast } = useToast();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleInvite = (username: string) => {
    setInvitedUsers((prev) => [...prev, username]);
    toast({
      title: "Invitation sent! 🎉",
      description: `You've expressed interest in @${username}. They'll be notified.`,
    });
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Discover Teammates</h1>
        <p className="text-muted-foreground">Find the perfect match for your next hackathon</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <motion.div 
          className="lg:w-72 flex-shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="card-base p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden p-1 hover:bg-muted rounded"
              >
                {filtersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {filtersOpen && (
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Skills */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-1.5">
                      {allSkills.map((skill) => (
                        <motion.button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {skill}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Hackathon */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Hackathon</label>
                    <select className="input-base text-sm">
                      <option value="">All hackathons</option>
                      {hackathons.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Experience Level</label>
                    <div className="flex gap-1">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <motion.button
                          key={level}
                          className="flex-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {level}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Location / Timezone</label>
                    <input type="text" className="input-base text-sm" placeholder="e.g. PST, New York" />
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Looking for teammates</label>
                    <button className="w-10 h-6 bg-primary rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                    <select className="input-base text-sm">
                      <option>Best skill match</option>
                      <option>Recently joined</option>
                      <option>Most experience</option>
                      <option>Highest achievements</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <motion.button 
                      className="btn-primary flex-1 text-sm py-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Apply
                    </motion.button>
                    <motion.button 
                      className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="flex-1">
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground">{mockUsers.length} teammates found</span>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <SkeletonUserCard />
                <SkeletonUserCard />
                <SkeletonUserCard />
                <SkeletonUserCard />
              </>
            ) : (
              mockUsers.map((user, index) => (
                <UserCard
                  key={user.username}
                  {...user}
                  invited={invitedUsers.includes(user.username)}
                  onInvite={() => handleInvite(user.username)}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
