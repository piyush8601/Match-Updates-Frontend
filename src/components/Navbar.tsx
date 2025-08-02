"use client";

import { useRouter } from "next/navigation";
import './css/Navbar.css';

export default function Navbar(): React.JSX.Element {
  const router = useRouter();

  const handleHomeClick = (): void => {
    router.push("/");
  };

  const handleStartMatchClick = (): void => {
    router.push("/matches/create");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <h1 className="navbar-title" onClick={handleHomeClick}>
            Cricket Scoring App
          </h1>
          <div className="navbar-buttons">
            <button
              onClick={() => router.push("/matches")}
              className="navbar-button"
            >
              All Matches
            </button>
            <button
              onClick={handleStartMatchClick}
              className="navbar-button-primary"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
