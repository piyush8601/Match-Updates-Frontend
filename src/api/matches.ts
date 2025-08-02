import { ApiResponse, Commentary, CreateCommentaryData, CreateMatchData, Match } from '@/common/interfaces';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchMatches(): Promise<Match[]> {
  try {
    const response: AxiosResponse<ApiResponse<Match[]>> = await axios.get(`${API_BASE_URL}/matches`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw new Error('Failed to fetch matches');
  }
}

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

export async function addCommentary(matchId: string, commentaryData: CreateCommentaryData): Promise<Commentary> {
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

export async function getMatchDetails(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.get(`${API_BASE_URL}/matches/${matchId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw new Error('Failed to fetch match details');
  }
}

export async function pauseMatch(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.post(`${API_BASE_URL}/matches/${matchId}/pause`);
    return response.data.data;
  } catch (error) {
    console.error('Error pausing match:', error);
    throw new Error('Failed to pause match');
  }
}

export async function resumeMatch(matchId: string): Promise<Match> {
  try {
    const response: AxiosResponse<ApiResponse<Match>> = await axios.post(`${API_BASE_URL}/matches/${matchId}/resume`);
    return response.data.data;
  } catch (error) {
    console.error('Error resuming match:', error);
    throw new Error('Failed to resume match');
  }
}

