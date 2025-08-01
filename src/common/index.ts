// Match status enum for better type safety
export type MatchStatus = 'not_started' | 'ongoing' | 'paused' | 'completed';

// Batting team type
export type BattingTeam = 'teamA' | 'teamB';

// Event types for cricket events
export type EventType = 'run' | 'wicket' | 'wide' | 'no_ball' | 'bye' | 'leg_bye' | 'dot' | 'four' | 'six';

// Team interface
export interface Team {
  name: string;
  players: string[];
}

// Commentary interface
export interface Commentary {
  _id: string;
  over: number;
  ball: number;
  eventType: EventType;
  runs: number;
  description?: string;
  batsman?: string;
  bowler?: string;
  isWicket: boolean;
  wicketType?: string;
  timestamp: string;
}

// Match interface
export interface Match {
  _id: string;
  matchId: string;
  teamA: Team;
  teamB: Team;
  overs: number;
  status: MatchStatus;
  currentOver: number;
  currentBall: number;
  battingTeam: BattingTeam;
  teamAScore: number;
  teamAWickets: number;
  teamBScore: number;
  teamBWickets: number;
  commentary: Commentary[];
  venue?: string;
  startTime: string; // ISO date string
  endTime?: string;  // ISO date string or undefined if match ongoing
  createdAt: string;
  updatedAt: string;
}

// Utility types for API operations
export type CreateMatchRequest = Omit<Match, '_id' | 'matchId' | 'status' | 'currentOver' | 'currentBall' | 'battingTeam' | 'teamAScore' | 'teamAWickets' | 'teamBScore' | 'teamBWickets' | 'commentary' | 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'>;

export type AddCommentaryRequest = Omit<Commentary, '_id' | 'timestamp'>;

// Loading and error states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Component props interfaces
export interface MatchesListProps {
  matches: Match[];
  loading: boolean;
  error?: string | null;
}

export interface MatchCardProps {
  match: Match;
  onClick?: (matchId: string) => void;
}