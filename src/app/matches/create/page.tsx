"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { startMatch, CreateMatchData } from "../../../api/matches";

export default function CreateMatchPage(): React.JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateMatchData>({
        teamA: { name: "", players: [] },
        teamB: { name: "", players: [] },
        overs: 10,
        venue: "",
    });
    const [teamAPlayers, setTeamAPlayers] = useState("");
    const [teamBPlayers, setTeamBPlayers] = useState("");

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Parse players from comma-separated strings
            const teamAPlayersList = teamAPlayers.split(",").map(p => p.trim()).filter(p => p);
            const teamBPlayersList = teamBPlayers.split(",").map(p => p.trim()).filter(p => p);

            const matchData: CreateMatchData = {
                ...formData,
                teamA: { ...formData.teamA, players: teamAPlayersList },
                teamB: { ...formData.teamB, players: teamBPlayersList },
            };

            const newMatch = await startMatch(matchData);
            router.push(`/matches/${newMatch._id}`);
        } catch (error) {
            console.error('Error creating match:', error);
            setError(error instanceof Error ? error.message : 'Failed to create match');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (): void => {
        router.back();
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <button
                            onClick={handleBack}
                            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                        >
                            ← Back to Matches
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Match</h1>
                        <p className="text-gray-600 mt-2">Set up a new cricket match with team details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6 text-black">
                            {/* Team A */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team A</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Team Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.teamA.name}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                teamA: { ...prev.teamA, name: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter team A name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Players (comma-separated) *
                                        </label>
                                        <textarea
                                            required
                                            value={teamAPlayers}
                                            onChange={(e) => setTeamAPlayers(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Player 1, Player 2, Player 3, ..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team B */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team B</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Team Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.teamB.name}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                teamB: { ...prev.teamB, name: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter team B name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Players (comma-separated) *
                                        </label>
                                        <textarea
                                            required
                                            value={teamBPlayers}
                                            onChange={(e) => setTeamBPlayers(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Player 1, Player 2, Player 3, ..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Match Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Overs *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            max={20}
                                            value={formData.overs}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                overs: parseInt(e.target.value) || 0
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Venue (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.venue || ""}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                venue: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Stadium name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    {loading ? "Creating..." : "Create Match"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
} 