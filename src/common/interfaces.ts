export type MatchStatus = 'ongoing' | 'paused';

export type BattingTeam = 'teamA' | 'teamB';

export interface Team {
  name: string;
  players: string[];
}

export interface Commentary {
  _id: string;
  over: number;
  ball: number;
  runs: number;
  description?: string;
  isWicket: boolean;
  isSix: boolean;
  isFour: boolean;
  timestamp: string;
}

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
  startTime: string;
  endTime?: string;  
  createdAt: string;
  updatedAt: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface MatchesListProps {
  matches: Match[];
  loading: boolean;
  error?: string | null;
}

export interface CreateCommentaryData {
  ball : number;
  over: number;
  runs: number;
  description? : string;
  isSix?: boolean;
  isFour?: boolean;
  isWicket?: boolean;
}

export interface CreateMatchData {
  teamA: {
    name: string;
    players: string[];
  };
  teamB: {
    name: string;
    players: string[];
  };
  overs: number;
  venue?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
