"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getMatchDetails, pauseMatch, resumeMatch } from "../../../api/matches";
import { Match, LoadingState } from "@/common";
import { io, Socket } from "socket.io-client"; // <<<< START SOCKET.IO IMPORT
import CommentaryForm from "../../../components/CommentaryForm"; // <<<< START COMMENTARY FORM IMPORT

export default function MatchDetailPage(): React.JSX.Element {
    const params = useParams();
    const router = useRouter();
    const matchId = params.matchId as string;

    const [match, setMatch] = useState<Match | null>(null);
    const [state, setState] = useState<LoadingState>({
        loading: true,
        error: null,
    });

    const [showCommentaryForm, setShowCommentaryForm] = useState(false); // <<<< START COMMENTARY FORM TOGGLE

    const handleCommentaryAdded = (): void => {
        // Refresh commentary by refetching match details or updating state
        if (!matchId) return;
        getMatchDetails(matchId).then((data) => {
            setMatch(data);
            console.log(data);
        }).catch((error) => {
            console.error('Error refreshing match details after commentary added:', error);
        });
        setShowCommentaryForm(false);
    };

    // <<<< START SOCKET.IO CLIENT SETUP
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!matchId) return;

        const newSocket = io("http://localhost:3001", {
            transports: ["websocket"],
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.emit("joinMatch", { matchId });

        newSocket.on("commentaryUpdate", (data: { commentary: any }) => {
            setMatch((prevMatch) => {
                if (!prevMatch) return prevMatch;
                // Append new commentary to existing commentary array
                const updatedCommentary = prevMatch.commentary ? [...prevMatch.commentary] : [];
                if (data.commentary) {
                    updatedCommentary.push(data.commentary);
                }
                return { ...prevMatch, commentary: updatedCommentary };
            });
        });

        newSocket.on("matchUpdate", (data: { match: Match }) => {
            setMatch(data.match);
        });

        return () => {
            newSocket.emit("leaveMatch", { matchId });
            newSocket.disconnect();
            setSocket(null);
        };
    }, [matchId]);
    // <<<< END SOCKET.IO CLIENT SETUP


    useEffect(() => {
        const loadMatch = async (): Promise<void> => {
            if (!matchId) return;

            try {
                setState({ loading: true, error: null });
                const data = await getMatchDetails(matchId);
                setMatch(data);
            } catch (error) {
                console.error('Error loading match:', error);
                setState({
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to load match details'
                });
            } finally {
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        loadMatch();
    }, [matchId]);

    const handlePauseMatch = async (): Promise<void> => {
        if (!match) return;

        try {
            const updatedMatch = await pauseMatch(match._id);
            setMatch(updatedMatch);
        } catch (error) {
            console.error('Error pausing match:', error);
            alert('Failed to pause match');
        }
    };

    const handleResumeMatch = async (): Promise<void> => {
        if (!match) return;

        try {
            const updatedMatch = await resumeMatch(match._id);
            setMatch(updatedMatch);
        } catch (error) {
            console.error('Error resuming match:', error);
            alert('Failed to resume match');
        }
    };

    const handleBack = (): void => {
        router.push('/matches');
    };

    if (state.loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading match details...</span>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (state.error || !match) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                            <p className="text-red-600 font-medium">Error loading match</p>
                            <p className="text-red-500 text-sm mt-2">{state.error || 'Match not found'}</p>
                            <button
                                onClick={handleBack}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                            >
                                Back to Matches
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleBack}
                            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                        >
                            ← Back to Matches
                        </button>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Match #{String(match.matchId).padStart(4, "0")}
                                </h1>
                                {match.venue && (
                                    <p className="text-gray-600 mt-2">{match.venue}</p>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                {match.status === 'ongoing' && (
                                    <button
                                        onClick={handlePauseMatch}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Pause Match
                                    </button>
                                )}
                                {match.status === 'paused' && (
                                    <button
                                        onClick={handleResumeMatch}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Resume Match
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Match Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Match Status</h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${match.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                match.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                    match.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}>
                                {match.status.replace(/_/g, " ")}
                            </span>
                        </div>

                        {/* Score Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{match.teamA.name}</h3>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {match.teamAScore}/{match.teamAWickets}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {match.teamA.players.length} players
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{match.teamB.name}</h3>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {match.teamBScore}/{match.teamBWickets}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {match.teamB.players.length} players
                                </p>
                            </div>
                        </div>

                        {/* Current Over Info */}
                        {(match.status === 'ongoing' || match.status === 'paused') && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Current Over</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-blue-900">
                                        {match.currentOver}.{match.currentBall}
                                    </span>
                                    <span className="text-blue-700">
                                        Batting: {match.battingTeam === 'teamA' ? match.teamA.name : match.teamB.name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Match Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{match.overs}</p>
                                <p className="text-sm text-gray-500">Total Overs</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {match.commentary?.length || 0}
                                </p>
                                <p className="text-sm text-gray-500">Commentary</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Date(match.startTime).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">Start Date</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {match.endTime ? new Date(match.endTime).toLocaleDateString() : '-'}
                                </p>
                                <p className="text-sm text-gray-500">End Date</p>
                            </div>
                    </div>
                </div>

                {/* Commentary Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Live Commentary</h2>
                        <button
                            onClick={() => setShowCommentaryForm(!showCommentaryForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                            {showCommentaryForm ? 'Cancel' : 'Add Commentary'}
                        </button>
                    </div>

                    {showCommentaryForm && (
                        <CommentaryForm matchId={matchId} onCommentaryAdded={handleCommentaryAdded} />
                    )}

                    {match.commentary && match.commentary.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {match.commentary.map((comment) => (
                                <div key={comment._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="font-medium text-gray-900">
                                            Over {comment.over}.{comment.ball}
                                        </span>
                                        <span className="ml-2 text-gray-600">{comment.description}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-900">{comment.runs} runs</span>
                                        {comment.isWicket && (
                                            <span className="ml-2 text-red-600 font-medium">WICKET!</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No commentary available yet
                        </div>
                    )}
                </div>
                </div>
            </main>
            <Footer />
        </div>
    );
} 