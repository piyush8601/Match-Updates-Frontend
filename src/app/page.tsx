"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MatchesList from "../components/MatchesList";
import Footer from "../components/Footer";
import { fetchMatches } from "../api/matches";
import { Match, LoadingState } from "@/common";

export default function HomePage(): React.JSX.Element {
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MatchesList
            matches={matches}
            loading={state.loading}
            error={state.error}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
