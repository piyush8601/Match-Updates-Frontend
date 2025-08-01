"use client";

import { useRouter } from "next/navigation";

export default function Navbar(): React.JSX.Element {
  const router = useRouter();

  const handleHomeClick = (): void => {
    router.push("/");
  };

  const handleStartMatchClick = (): void => {
    router.push("/matches/create");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1
            className="text-xl font-bold cursor-pointer hover:text-blue-200 transition-colors"
            onClick={handleHomeClick}
          >
            Cricket Scoring App
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/matches")}
              className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              All Matches
            </button>
            <button
              onClick={handleStartMatchClick}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
