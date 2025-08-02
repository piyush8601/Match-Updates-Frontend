import React from "react";
import { useRouter } from "next/navigation";
import { Match, MatchesListProps } from "@/common/interfaces";
import "./css/MatchesList.css";

export default function MatchesList({ matches, loading, error }: Readonly<MatchesListProps>) {
  const router = useRouter();

  const handleMatchClick = (matchId: string): void => {
    router.push(`/matches/${matchId}`);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <p className="error-title">Error loading matches</p>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="error-retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(matches)) {
    return (
      <div className="error-container">
        <p className="error-title">Invalid matches data format.</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-box">
          <p className="empty-title">No matches found</p>
          <p className="empty-subtext">Start a new match to get started!</p>
          <button onClick={() => router.push('/matches/create')} className="new-match-button">
            Create New Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-section">
      <div className="match-header">
        <h2 className="match-title">Recent Matches</h2>
        <button onClick={() => router.push('/matches/create')} className="new-match-button">
          New Match
        </button>
      </div>

      <div className="match-grid">
        {matches.map((match) => (
          <div key={match._id} className="match-card" onClick={() => handleMatchClick(match._id)}>
            <div className="match-card-header">
              <h3 className="match-id">Match #{String(match.matchId).padStart(4, "0")}</h3>
              <span className={`match-status ${match.status}`}>
                {match.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="match-card-content">
              <div className="match-teams">
                <p className="teams-text">{match.teamA.name} vs {match.teamB.name}</p>
                {match.venue && <p className="venue-text">{match.venue}</p>}
              </div>

              <div className="match-score">
                <span>{match.teamA.name}: {match.teamAScore}/{match.teamAWickets}</span>
                <span>{match.teamB.name}: {match.teamBScore}/{match.teamBWickets}</span>
              </div>

              {match.status === 'ongoing' && (
                <div className="match-progress">
                  Over: {match.currentOver}.{match.currentBall}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
