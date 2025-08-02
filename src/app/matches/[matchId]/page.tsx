"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Match, LoadingState } from "@/common/interfaces";
import { getMatchDetails, pauseMatch, resumeMatch } from "../../../api/matches";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CommentaryForm from "../../../components/CommentaryForm";
import "./page.css";

export default function MatchDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [state, setState] = useState<LoadingState>({
    loading: true,
    error: null,
  });

  const [showCommentaryForm, setShowCommentaryForm] = useState(false);

  const handleCommentaryAdded = (): void => {
    if (!matchId) return;
    getMatchDetails(matchId)
      .then((data) => {
        setMatch(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(
          "Error refreshing match details after commentary added:",
          error,
        );
      });
    setShowCommentaryForm(false);
  };

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
        const updatedCommentary = prevMatch.commentary
          ? [...prevMatch.commentary]
          : [];
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

  useEffect(() => {
    const loadMatch = async (): Promise<void> => {
      if (!matchId) return;

      try {
        setState({ loading: true, error: null });
        const data = await getMatchDetails(matchId);
        setMatch(data);
      } catch (error) {
        console.error("Error loading match:", error);
        setState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load match details",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
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
      console.error("Error pausing match:", error);
      alert("Failed to pause match");
    }
  };

  const handleResumeMatch = async (): Promise<void> => {
    if (!match) return;

    try {
      const updatedMatch = await resumeMatch(match._id);
      setMatch(updatedMatch);
    } catch (error) {
      console.error("Error resuming match:", error);
      alert("Failed to resume match");
    }
  };

  const handleBack = (): void => {
    router.push("/matches");
  };

  if (state.loading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading match details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (state.error || !match) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="error-container">
          <div className="error-content">
            <div className="error-box">
              <p className="error-title">Error loading match</p>
              <p className="error-message">
                {state.error || "Match not found"}
              </p>
              <button onClick={handleBack} className="error-button">
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
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="header-section">
            <button onClick={handleBack} className="back-button">
              ← Back to Matches
            </button>
            <div className="header-content">
              <div>
                <h1 className="match-title">
                  Match #{String(match.matchId).padStart(4, "0")}
                </h1>
                {match.venue && <p className="venue-text">{match.venue}</p>}
              </div>
              <div className="action-buttons">
                {match.status === "ongoing" && (
                  <button onClick={handlePauseMatch} className="pause-button">
                    Pause Match
                  </button>
                )}
                {match.status === "paused" && (
                  <button onClick={handleResumeMatch} className="resume-button">
                    Resume Match
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Match Status */}
          <div className="match-status-card">
            <div className="status-header">
              <h2 className="status-title">Match Status</h2>
              <span
                className={`status-badge ${
                  match.status === "ongoing"
                    ? "status-ongoing"
                    : match.status === "paused"
                      ? "status-paused"
                      : match.status === "completed"
                        ? "status-completed"
                        : "status-pending"
                }`}
              >
                {match.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* Score Card */}
            <div className="score-grid">
              <div className="team-score-card">
                <h3 className="team-name">{match.teamA.name}</h3>
                <div className="team-score">
                  {match.teamAScore}/{match.teamAWickets}
                </div>
                <p className="team-players">
                  {match.teamA.players.length} players
                </p>
              </div>
              <div className="team-score-card">
                <h3 className="team-name">{match.teamB.name}</h3>
                <div className="team-score">
                  {match.teamBScore}/{match.teamBWickets}
                </div>
                <p className="team-players">
                  {match.teamB.players.length} players
                </p>
              </div>
            </div>

            {/* Current Over Info */}
            {(match.status === "ongoing" || match.status === "paused") && (
              <div className="current-over-card">
                <h4 className="current-over-title">Current Over</h4>
                <div className="current-over-content">
                  <span className="current-over-number">
                    {match.currentOver}.{match.currentBall}
                  </span>
                  <span className="batting-team">
                    Batting:{" "}
                    {match.battingTeam === "teamA"
                      ? match.teamA.name
                      : match.teamB.name}
                  </span>
                </div>
              </div>
            )}

            {/* Match Details */}
            <div className="match-details-grid">
              <div>
                <p className="detail-item-value">{match.overs}</p>
                <p className="detail-item-label">Total Overs</p>
              </div>
              <div>
                <p className="detail-item-value">
                  {match.commentary?.length || 0}
                </p>
                <p className="detail-item-label">Commentary</p>
              </div>
              <div>
                <p className="detail-item-value">
                  {new Date(match.startTime).toLocaleDateString()}
                </p>
                <p className="detail-item-label">Start Date</p>
              </div>
              <div>
                <p className="detail-item-value">
                  {match.endTime
                    ? new Date(match.endTime).toLocaleDateString()
                    : "-"}
                </p>
                <p className="detail-item-label">End Date</p>
              </div>
            </div>
          </div>

          {/* Commentary Section */}
          <div className="match-status-card">
            <div className="commentary-header">
              <h2 className="commentary-title">Live Commentary</h2>
              <button
                onClick={() => setShowCommentaryForm(!showCommentaryForm)}
                className="add-commentary-button"
              >
                {showCommentaryForm ? "Cancel" : "Add Commentary"}
              </button>
            </div>

            {showCommentaryForm && (
              <CommentaryForm
                matchId={matchId}
                onCommentaryAdded={handleCommentaryAdded}
              />
            )}

            {match.commentary && match.commentary.length > 0 ? (
              <div className="commentary-list">
                {match.commentary.map((comment) => (
                  <div key={comment._id} className="commentary-item">
                    <div>
                      <span className="commentary-over">
                        Over {comment.over}.{comment.ball}
                      </span>
                      <span className="commentary-description">
                        {comment.description}
                      </span>
                    </div>
                    <div className="commentary-runs">
                      <span className="commentary-runs-value">
                        {comment.runs} runs
                      </span>
                      {comment.isWicket && (
                        <span className="commentary-wicket">WICKET!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-commentary">No commentary available yet</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
