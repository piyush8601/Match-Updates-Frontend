"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MatchesList from "../components/MatchesList";
import Footer from "../components/Footer";
import { fetchMatches } from "../api/matches";
import { Match, LoadingState } from "@/common/interfaces";
import "./page.css";

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
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.error("Invalid data format received:", data);
          setState({
            loading: false,
            error: "Invalid data format received for matches.",
          });
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        setState({
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to load matches.",
        });
      }
    };

    loadMatches();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <main className="home-main">
        <Hero />
        <div className="matches-container">
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
