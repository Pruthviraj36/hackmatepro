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
}: UserCardProps) {
  const displayedSkills = skills.slice(0, 5);
  const moreSkills = skills.length - 5;

  return (
    <div className="card-base card-hover p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">@{username}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bio}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {displayedSkills.map((skill) => (
              <SkillTag key={skill} name={skill} />
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
            <button
              onClick={onInvite}
              disabled={invited}
              className={`btn-primary text-sm py-2 ${invited ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {invited ? 'Invited' : 'Interested'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
