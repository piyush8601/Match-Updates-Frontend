"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Match, MatchesListProps } from "@/common";

export default function MatchesList({ matches, loading, error }: Readonly<MatchesListProps>) {
  const router = useRouter();

  const handleMatchClick = (matchId: string): void => {
    router.push(`/matches/${matchId}`);
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center py-12">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //       <span className="ml-3 text-gray-600">Loading matches...</span>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 font-medium">Error loading matches</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(matches)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Invalid matches data format.</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-gray-500 text-lg mb-4">No matches found</p>
          <p className="text-gray-400 text-sm mb-6">Start a new match to get started!</p>
          <button
            onClick={() => router.push('/matches/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create New Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
        <button
          onClick={() => router.push('/matches/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          New Match
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
