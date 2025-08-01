"use client";

import { useRouter } from "next/navigation";

export default function Hero(): React.JSX.Element {
  const router = useRouter();

  const handleGetStartedClick = (): void => {
    router.push("/matches/create");
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Cricket Scoring App
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Real-time cricket scoring and live commentary with beautiful UI
        </p>
        <button
          onClick={handleGetStartedClick}
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
