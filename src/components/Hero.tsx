"use client";

import { useRouter } from "next/navigation";
import "./css/Hero.css";

export default function Hero() {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push("/matches/create");
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Cricket Scoring App</h1>
        <p className="hero-subtitle">
          Real-time cricket scoring and live commentary with beautiful UI
        </p>
        <button className="hero-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
    </div>
  );
}
