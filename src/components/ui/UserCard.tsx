import { motion } from 'framer-motion';
import { User, Trophy, Code } from 'lucide-react';
import { SkillTag } from './SkillTag';
import { Link } from 'react-router-dom';

interface UserCardProps {
  username: string;
  bio: string;
  skills: string[];
  hackathons: number;
  wins: number;
  avatarUrl?: string;
  invited?: boolean;
  onInvite?: () => void;
  index?: number;
}

export function UserCard({
  username,
  bio,
  skills,
  hackathons,
  wins,
  avatarUrl,
  invited = false,
  onInvite,
  index = 0,
}: UserCardProps) {
  const displayedSkills = skills.slice(0, 5);
  const moreSkills = skills.length - 5;

  return (
    <motion.div 
      className="card-base card-hover p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <motion.div 
          className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-primary" />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">@{username}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bio}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {displayedSkills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <SkillTag name={skill} />
              </motion.div>
            ))}
            {moreSkills > 0 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{moreSkills} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span>{hackathons} hackathons</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>{wins} wins</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to={`/user/${username}`} className="btn-secondary text-sm py-2">
              View profile
            </Link>
            <motion.button
              onClick={onInvite}
              disabled={invited}
              className={`btn-primary text-sm py-2 ${invited ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!invited ? { scale: 1.02 } : {}}
              whileTap={!invited ? { scale: 0.98 } : {}}
            >
              {invited ? 'Invited' : 'Interested'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
