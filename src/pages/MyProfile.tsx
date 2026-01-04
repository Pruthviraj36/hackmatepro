import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkillTag } from '@/components/ui/SkillTag';
import { InterestTag } from '@/components/ui/InterestTag';
import { User, Camera, Plus, Trash2, Edit2 } from 'lucide-react';

const availableSkills = ['React', 'Python', 'TypeScript', 'Node.js', 'Machine Learning', 'UI/UX', 'Rust', 'Go', 'Flutter', 'Docker', 'AWS', 'Solidity'];
const availableInterests = ['Web Dev', 'AI/ML', 'Cybersecurity', 'Game Dev', 'DevTools', 'Web3', 'Mobile', 'Open Source'];

export default function MyProfile() {
  const [skills, setSkills] = useState([
    { name: 'React', proficiency: 'Expert' as const },
    { name: 'TypeScript', proficiency: 'Intermediate' as const },
    { name: 'Node.js', proficiency: 'Intermediate' as const },
  ]);
  const [interests, setInterests] = useState(['Web Dev', 'AI/ML']);
  const [lookingForTeammates, setLookingForTeammates] = useState(true);
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

  const profileCompleteness = 65;
  const completenessItems = [
    { text: 'Add profile picture', done: false },
    { text: 'Add at least 3 skills', done: skills.length >= 3 },
    { text: 'Add 1 past hackathon', done: hackathons.length >= 1 },
    { text: 'Add bio (min 50 chars)', done: true },
  ];

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const removeInterest = (name: string) => {
    setInterests((prev) => prev.filter((i) => i !== name));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Edit Profile
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div 
              className="card-base p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="section-title">Basic Information</h2>
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <User className="w-10 h-10 text-primary" />
                    <motion.button 
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    </motion.button>
                  </motion.div>
                  <div>
                    <p className="font-medium text-foreground">Profile Picture</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                  <input type="text" className="input-base bg-muted" value="alexdev" disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name (optional)</label>
                  <input type="text" className="input-base" placeholder="Alex Developer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                  <textarea
                    className="input-base min-h-[100px] resize-none"
                    placeholder="Tell others about yourself..."
                    defaultValue="Full-stack developer passionate about building amazing products. Looking for creative teammates!"
                    maxLength={250}
                  />
                  <p className="text-xs text-muted-foreground mt-1">85/250 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Experience Level</label>
                  <select className="input-base">
                    <option>Beginner</option>
                    <option selected>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                    <input type="text" className="input-base" placeholder="San Francisco, CA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
                    <select className="input-base">
                      <option>PST (UTC-8)</option>
                      <option>EST (UTC-5)</option>
                      <option>UTC</option>
                      <option>CET (UTC+1)</option>
                    </select>
                  </div>
                </div>

                <motion.div 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-medium text-foreground">Looking for teammates</p>
                    <p className="text-sm text-muted-foreground">Let others know you're available</p>
                  </div>
                  <motion.button
                    onClick={() => setLookingForTeammates(!lookingForTeammates)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${
                      lookingForTeammates ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="absolute top-1 w-5 h-5 bg-primary-foreground rounded-full"
                      animate={{ x: lookingForTeammates ? 22 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div 
              className="card-base p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="section-title">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence mode="popLayout">
                  {skills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <SkillTag
                        name={skill.name}
                        proficiency={skill.proficiency}
                        removable
                        onRemove={() => removeSkill(skill.name)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Add skills</label>
                <select
                  className="input-base"
                  onChange={(e) => {
                    if (e.target.value && !skills.find((s) => s.name === e.target.value)) {
                      setSkills([...skills, { name: e.target.value, proficiency: 'Intermediate' }]);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Select a skill...</option>
                  {availableSkills
                    .filter((s) => !skills.find((sk) => sk.name === s))
                    .map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div 
              className="card-base p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="section-title">Interests</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence mode="popLayout">
                  {interests.map((interest) => (
                    <motion.div
                      key={interest}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <InterestTag
                        name={interest}
                        removable
                        onRemove={() => removeInterest(interest)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableInterests
                  .filter((i) => !interests.includes(i))
                  .map((interest, idx) => (
                    <motion.button
                      key={interest}
                      onClick={() => setInterests([...interests, interest])}
                      className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + {interest}
                    </motion.button>
                  ))}
              </div>
            </motion.div>

            {/* Hackathon History */}
            <motion.div 
              className="card-base p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">Hackathon History</h2>
                <motion.button 
                  className="btn-secondary text-sm py-2 flex items-center gap-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Add hackathon
                </motion.button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {hackathons.map((hackathon, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-muted/50 rounded-lg flex items-start justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{hackathon.name}</p>
                        <p className="text-sm text-muted-foreground">{hackathon.date} • {hackathon.role}</p>
                        <p className="text-sm text-foreground mt-1">
                          {hackathon.projectName} • Team of {hackathon.teamSize}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        <motion.button 
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div 
              className="flex justify-end gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save changes
              </motion.button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="card-base p-6 lg:sticky lg:top-24">
              <h3 className="font-semibold text-foreground mb-4">Profile Completeness</h3>
              <ProgressBar value={profileCompleteness} label="" showPercentage />
              <div className="mt-4 space-y-2">
                {completenessItems.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <motion.div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        item.done ? 'bg-primary' : 'border-2 border-muted-foreground'
                      }`}
                      animate={item.done ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.done && <span className="text-primary-foreground text-xs">✓</span>}
                    </motion.div>
                    <span className={item.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
