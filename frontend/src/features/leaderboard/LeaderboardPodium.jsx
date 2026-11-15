import React from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';
import LeaderboardAvatar from './LeaderboardAvatar';

export default function LeaderboardPodium({ topThree = [] }) {
  if (topThree.length < 3) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="lb-podium-wrap">
      {/* 2nd Place - Silver (Left) */}
      <div className="lb-podium-col lb-podium-col--2">
        <div className="lb-podium-avatar-wrap">
          <span className="lb-podium-medal lb-podium-medal--silver">2</span>
          <LeaderboardAvatar palette={second.palette} size={52} isCurrentUser={second.isCurrentUser} />
        </div>
        <div className="lb-podium-name">{second.name}</div>
        <div className="lb-podium-xp">{second.xp.toLocaleString()} XP</div>
        <div className="lb-podium-city">{second.city}</div>
        <div className="lb-podium-pillar lb-podium-pillar--2">
          <Medal size={20} color="#cbd5e1" />
          <span className="lb-podium-rank-label">2ND</span>
        </div>
      </div>

      {/* 1st Place - Gold (Center, Taller) */}
      <div className="lb-podium-col lb-podium-col--1">
        <div className="lb-podium-crown">
          <Trophy size={24} color="#f59e0b" />
        </div>
        <div className="lb-podium-avatar-wrap">
          <span className="lb-podium-medal lb-podium-medal--gold">1</span>
          <LeaderboardAvatar palette={first.palette} size={64} isCurrentUser={first.isCurrentUser} />
        </div>
        <div className="lb-podium-name lb-podium-name--champ">{first.name}</div>
        <div className="lb-podium-xp lb-podium-xp--gold">
          <Flame size={14} color="#f59e0b" style={{ display: 'inline', verticalAlign: '-2px' }} />{' '}
          {first.xp.toLocaleString()} XP
        </div>
        <div className="lb-podium-city">{first.city}</div>
        <div className="lb-podium-pillar lb-podium-pillar--1">
          <Trophy size={24} color="#f59e0b" />
          <span className="lb-podium-rank-label">1ST CHAMPION</span>
        </div>
      </div>

      {/* 3rd Place - Bronze (Right) */}
      <div className="lb-podium-col lb-podium-col--3">
        <div className="lb-podium-avatar-wrap">
          <span className="lb-podium-medal lb-podium-medal--bronze">3</span>
          <LeaderboardAvatar palette={third.palette} size={52} isCurrentUser={third.isCurrentUser} />
        </div>
        <div className="lb-podium-name">{third.name}</div>
        <div className="lb-podium-xp">{third.xp.toLocaleString()} XP</div>
        <div className="lb-podium-city">{third.city}</div>
        <div className="lb-podium-pillar lb-podium-pillar--3">
          <Medal size={20} color="#d97706" />
          <span className="lb-podium-rank-label">3RD</span>
        </div>
      </div>
    </div>
  );
}
