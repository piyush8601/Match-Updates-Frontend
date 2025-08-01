"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchMatches } from "../../api/matches";
import { Match, LoadingState } from "@/common";

export default function MatchesPage(): React.JSX.Element {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [state, setState] = useState<LoadingState>({
        loading: true,
        error: null,
    });

    useEffect(() => {
        const loadMatches = async (): Promise<void> => {
            try {
                setState({ loading: true, error: null });
                const data = await fetchMatches();
                console.log(data);
                if (Array.isArray(data)) {
                    setMatches(data);
                    setState({ loading: false, error: null });
                } else {
                    console.error('Invalid data format received:', data);
                    setState({ loading: false, error: 'Invalid data format received for matches.' });
                }
            } catch (error) {
                console.error('Error loading matches:', error);
                setState({
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to load matches.'
                });
            }
        };

        loadMatches();
    }, []);

    const handleMatchClick = (matchId: string): void => {
        router.push(`/matches/${matchId}`);
    };

    const handleCreateMatch = (): void => {
        router.push('/matches/create');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">All Matches</h1>
                        <button
                            onClick={handleCreateMatch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Create New Match
                        </button>
                    </div>

                    {state.loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading matches...</span>
                        </div>
                    )}

                    {state.error && (
                        <div className="text-center py-12">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                <p className="text-red-600 font-medium">Error loading matches</p>
                                <p className="text-red-500 text-sm mt-2">{state.error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {!state.loading && !state.error && matches.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                                <p className="text-gray-500 text-lg mb-4">No matches found</p>
                                <p className="text-gray-400 text-sm mb-6">Start a new match to get started!</p>
                                <button
                                    onClick={handleCreateMatch}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Create New Match
                                </button>
                            </div>
                        </div>
                    )}

                    {!state.loading && !state.error && matches.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {matches.map((match) => (
                                <div
                                    key={match._id}
                                    className="bg-white hover:bg-gray-50 transition-colors cursor-pointer rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md"
                                    onClick={() => handleMatchClick(match._id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            Match #{String(match.matchId).padStart(4, "0")}
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${match.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                            match.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                match.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {match.status.replace(/_/g, " ")}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {match.teamA.name} vs {match.teamB.name}
                                            </p>
                                            {match.venue && (
                                                <p className="text-sm text-gray-500 mt-1">{match.venue}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {match.teamA.name}: {match.teamAScore}/{match.teamAWickets}
                                            </span>
                                            <span className="text-gray-600">
                                                {match.teamB.name}: {match.teamBScore}/{match.teamBWickets}
                                            </span>
                                        </div>

                                        {match.status === 'ongoing' && (
                                            <div className="text-center text-sm text-blue-600 font-medium">
                                                Over: {match.currentOver}.{match.currentBall}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
} 