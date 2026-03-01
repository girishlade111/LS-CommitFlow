"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Commit } from "../store/commitStore";

interface GitTimelineProps {
  commits: Commit[];
  isLoading: boolean;
  onReplay: () => void;
}

export default function GitTimeline({ commits, isLoading, onReplay }: GitTimelineProps) {
  const [animatedCommits, setAnimatedCommits] = useState<Commit[]>([]);

  // Animate commits appearing one by one
  useEffect(() => {
    if (commits.length > 0) {
      // Reset animated commits when new commits come in
      setAnimatedCommits([]);
      
      // Add commits one by one with animation
      commits.forEach((commit, index) => {
        setTimeout(() => {
          setAnimatedCommits((prev) => [...prev, commit]);
        }, index * 300);
      });
    }
  }, [commits]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#c9d1d9]">Git Story Timeline</h2>
        {commits.length > 0 && (
          <button
            onClick={onReplay}
            className="px-3 py-1 text-sm bg-[#30363d] text-[#c9d1d9] rounded hover:bg-[#484f58] transition-colors"
          >
            Replay
          </button>
        )}
      </div>

      {/* Empty State */}
      {commits.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <svg
            className="w-16 h-16 text-[#484f58] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p className="text-[#8b949e]">No commits yet</p>
          <p className="text-sm text-[#484f58] mt-1">
            Enter a repository URL and generate commits
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <div className="relative">
            <svg className="animate-spin h-10 w-10 text-[#58a6ff]" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-[#8b949e] mt-4">Generating commits...</p>
          <p className="text-sm text-[#484f58] mt-1">
            Please wait while we push commits to your repository
          </p>
        </div>
      )}

      {/* Timeline */}
      {animatedCommits.length > 0 && (
        <div className="relative">
          {/* Git Graph Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#58a6ff] to-[#30363d]" />

          {/* Commits List */}
          <div className="space-y-2">
            <AnimatePresence>
              {animatedCommits.map((commit, index) => (
                <motion.div
                  key={commit.sha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex items-start gap-4 pl-2"
                >
                  {/* Commit Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 500 }}
                      className="w-4 h-4 rounded-full bg-[#58a6ff] border-2 border-[#0d1117] shadow-[0_0_10px_rgba(88,166,255,0.5)]"
                    />
                  </div>

                  {/* Commit Content */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md p-3"
                  >
                    {/* SHA */}
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs text-[#58a6ff] font-mono">
                        {commit.sha.substring(0, 7)}
                      </code>
                      <span className="text-xs text-[#8b949e]">on</span>
                      <span className="text-xs text-[#7ee787]">{commit.branch}</span>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-[#c9d1d9] mb-2 line-clamp-2">
                      {commit.message}
                    </p>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3 text-[#484f58]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs text-[#484f58]">
                        {formatDate(commit.timestamp)}
                      </span>
                    </div>

                    {/* URL */}
                    {commit.url && (
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-[#58a6ff] hover:underline"
                      >
                        View on GitHub
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats Summary */}
          {animatedCommits.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-4 border-t border-[#30363d]"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b949e]">
                  Total commits: <span className="text-[#c9d1d9] font-medium">{animatedCommits.length}</span>
                </span>
                <span className="text-[#8b949e]">
                  Latest: <span className="text-[#7ee787] font-mono">{animatedCommits[animatedCommits.length - 1]?.sha.substring(0, 7)}</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
