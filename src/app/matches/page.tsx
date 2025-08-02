"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchMatches } from "../../api/matches";
import { Match, LoadingState } from "@/common/interfaces";
import './matches-page.css';

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
        <div className="matches-page">
            <Navbar />
            <main className="matches-page__main">
                <div className="matches-page__container">
                    <div className="matches-page__header">
                        <h1 className="matches-page__title">All Matches</h1>
                        <button
                            onClick={handleCreateMatch}
                            className="matches-page__create-button"
                        >
                            Create New Match
                        </button>
                    </div>

                    {state.loading && (
                        <div className="matches-page__loading-container">
                            <div className="matches-page__spinner"></div>
                            <span className="matches-page__loading-text">Loading matches...</span>
                        </div>
                    )}

                    {state.error && (
                        <div className="matches-page__error-container">
                            <div className="matches-page__error-box">
                                <p className="matches-page__error-title">Error loading matches</p>
                                <p className="matches-page__error-message">{state.error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="matches-page__error-button"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {!state.loading && !state.error && matches.length === 0 && (
                        <div className="matches-page__no-matches-container">
                            <div className="matches-page__no-matches-box">
                                <p className="matches-page__no-matches-text">No matches found</p>
                                <p className="matches-page__no-matches-subtext">Start a new match to get started!</p>
                                <button
                                    onClick={handleCreateMatch}
                                    className="matches-page__create-button"
                                >
                                    Create New Match
                                </button>
                            </div>
                        </div>
                    )}

                    {!state.loading && !state.error && matches.length > 0 && (
                        <div className="matches-page__grid">
                            {matches.map((match) => (
                                <div
                                    key={match._id}
                                    className="matches-page__match-card"
                                    onClick={() => handleMatchClick(match._id)}
                                >
                                    <div className="matches-page__match-header">
                                        <h3 className="matches-page__match-title">
                                            Match #{String(match.matchId).padStart(4, "0")}
                                        </h3>
                                        <span className={`matches-page__status-badge ${match.status === 'ongoing' ? 'matches-page__status-ongoing' :
                                            match.status === 'paused' ? 'matches-page__status-paused' :
                                                match.status === 'completed' ? 'matches-page__status-completed' :
                                                    'matches-page__status-default'
                                            }`}>
                                            {match.status.replace(/_/g, " ")}
                                        </span>
                                    </div>

                                    <div className="matches-page__match-info">
                                        <div className="matches-page__text-center">
                                            <p className="matches-page__match-teams">
                                                {match.teamA.name} vs {match.teamB.name}
                                            </p>
                                            {match.venue && (
                                                <p className="matches-page__match-venue">{match.venue}</p>
                                            )}
                                        </div>

                                        <div className="matches-page__score-info">
                                            <span className="matches-page__team-score">
                                                {match.teamA.name}: {match.teamAScore}/{match.teamAWickets}
                                            </span>
                                            <span className="matches-page__team-score">
                                                {match.teamB.name}: {match.teamBScore}/{match.teamBWickets}
                                            </span>
                                        </div>

                                        {match.status === 'ongoing' && (
                                            <div className="matches-page__ongoing-info">
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
