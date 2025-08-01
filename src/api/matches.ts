import { Commentary, Match } from '@/common';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API Response types
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Create match data type
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

// Fetch list of all matches
export async function fetchMatches(): Promise<Match[]> {
  try {
    const response: AxiosResponse<ApiResponse<Match[]>> = await axios.get(`${API_BASE_URL}/matches`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw new Error('Failed to fetch matches');
  }
}

// Start a new match
export async function startMatch(matchData: CreateMatchData): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.post(
      `${API_BASE_URL}/matches/start`,
      matchData
    );
    return response.data.data;
  } catch (error) {
    console.error('Error starting match:', error);
    throw new Error('Failed to start match');
  }
}

// Add commentary to a match
export async function addCommentary(matchId: string, commentaryData: Omit<Commentary, '_id' | 'timestamp'>): Promise<Commentary> {
  try {
    const response: AxiosResponse<ApiResponse<Commentary>> = await axios.post(
      `${API_BASE_URL}/matches/${matchId}/commentary`,
      commentaryData
    );
    return response.data.data;
  } catch (error) {
    console.error('Error adding commentary:', error);
    throw new Error('Failed to add commentary');
  }
}

// Get match details including commentary
export async function getMatchDetails(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.get(`${API_BASE_URL}/matches/${matchId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw new Error('Failed to fetch match details');
  }
}

// Pause a match
export async function pauseMatch(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.post(`${API_BASE_URL}/matches/${matchId}/pause`);
    return response.data.data;
  } catch (error) {
    console.error('Error pausing match:', error);
    throw new Error('Failed to pause match');
  }
}

// Resume a match
export async function resumeMatch(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.post(`${API_BASE_URL}/matches/${matchId}/resume`);
    return response.data.data;
  } catch (error) {
    console.error('Error resuming match:', error);
    throw new Error('Failed to resume match');
  }
}
