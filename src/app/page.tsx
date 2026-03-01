"use client";

import { useState } from "react";
import RepoInput from "./components/RepoInput";
import GitTimeline from "./components/GitTimeline";
import { useCommitStore } from "./store/commitStore";

export default function Home() {
  const { commits, isLoading, error, clearCommits } = useCommitStore();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Educational Warning Banner */}
      <div className="mb-6 p-4 bg-[#d29922]/10 border border-[#d29922]/30 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-[#d29922] flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-[#d29922]">
              Educational Git Automation Tool — Not for contribution manipulation
            </h3>
            <p className="text-sm text-[#8b949e] mt-1">
              This tool is designed for learning GitHub API automation and understanding Git operations. 
              Do not use for manipulating contribution history, bypassing rate limits, or any activity 
              that violates GitHub's terms of service. Always respect the community guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          <RepoInput />
          
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#f85149] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-[#f85149]">Error</h3>
                  <p className="text-sm text-[#c9d1d9] mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Git Timeline */}
        <div>
          <GitTimeline 
            commits={commits} 
            isLoading={isLoading}
            onReplay={clearCommits}
          />
        </div>
      </div>
    </div>
  );
}
