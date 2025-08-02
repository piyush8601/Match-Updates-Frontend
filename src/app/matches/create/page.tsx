"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { startMatch} from "../../../api/matches";
import "./index.css";
import { CreateMatchData } from "@/common/interfaces";

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
      const teamAPlayersList = teamAPlayers
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      const teamBPlayersList = teamBPlayers
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);

      const matchData: CreateMatchData = {
        ...formData,
        teamA: { ...formData.teamA, players: teamAPlayersList },
        teamB: { ...formData.teamB, players: teamBPlayersList },
      };

      const newMatch = await startMatch(matchData);
      router.push(`/matches/${newMatch._id}`);
    } catch (error) {
      console.error("Error creating match:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create match",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    router.back();
  };

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="topbar">
            <button onClick={handleBack} className="back-button">
              ← Back to Matches
            </button>
            <h1 className="heading">Create New Match</h1>
            <p className="subheading">
              Set up a new cricket match with team details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-wrapper">
            {error && (
              <div className="error-box">
                <p>{error}</p>
              </div>
            )}

            <div className="form-body">
              <div className="space-y-6">
                {/* Team A */}
                <div>
                  <h3 className="section-title">Team A</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Team Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.teamA.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            teamA: { ...prev.teamA, name: e.target.value },
                          }))
                        }
                        className="input"
                        placeholder="Enter team A name"
                      />
                    </div>
                    <div>
                      <label className="label">
                        Players (comma-separated) *
                      </label>
                      <textarea
                        required
                        value={teamAPlayers}
                        onChange={(e) => setTeamAPlayers(e.target.value)}
                        rows={3}
                        className="textarea"
                        placeholder="Player 1, Player 2, Player 3, ..."
                      />
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div>
                  <h3 className="section-title">Team B</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Team Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.teamB.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            teamB: { ...prev.teamB, name: e.target.value },
                          }))
                        }
                        className="input"
                        placeholder="Enter team B name"
                      />
                    </div>
                    <div>
                      <label className="label">
                        Players (comma-separated) *
                      </label>
                      <textarea
                        required
                        value={teamBPlayers}
                        onChange={(e) => setTeamBPlayers(e.target.value)}
                        rows={3}
                        className="textarea"
                        placeholder="Player 1, Player 2, Player 3, ..."
                      />
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div>
                  <h3 className="section-title">Match Details</h3>
                  <div className="grid-two">
                    <div>
                      <label className="label">Number of Overs *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={50}
                        value={formData.overs}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            overs: parseInt(e.target.value) || 0
                          }))
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Venue (Optional)</label>
                      <input
                        type="text"
                        value={formData.venue || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            venue: e.target.value,
                          }))
                        }
                        className="input"
                        placeholder="Stadium name"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                  >
                    {loading ? "Creating..." : "Create Match"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
