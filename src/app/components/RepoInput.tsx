"use client";

import { useState } from "react";
import { useCommitStore } from "../store/commitStore";
import { VALID_CATEGORIES, CommitCategory } from "../lib/validation";

export default function RepoInput() {
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [commitCount, setCommitCount] = useState(5);
  const [category, setCategory] = useState<CommitCategory>("Study");
  const [confirmArchived, setConfirmArchived] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const { setLoading, setError, addCommits, setProgress, isLoading } = useCommitStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate inputs
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (token && token.length < 20) {
      setError("Token appears to be invalid");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate-commits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: token.trim() || undefined,
          commitCount,
          category,
        }),
      });

      const data = await response.json();

      // Show detailed error info
      if (!response.ok) {
        setError(`Error ${response.status}: ${data.error || data.details || "Unknown error"}`);
        return;
      }

      // Add commits to store
      if (data.commits) {
        addCommits(data.commits);
      }
    } catch (error: unknown) {
      const err = error as Error;
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = (current: number, total: number) => {
    setProgress(current, total);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-[#c9d1d9]">
        Generate Educational Commits
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Repository URL */}
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-[#8b949e] mb-1">
            GitHub Repository URL *
          </label>
          <input
            type="text"
            id="repoUrl"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="owner/repo or https://github.com/owner/repo"
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#484f58]"
            disabled={isLoading}
          />
        </div>

        {/* GitHub Token (Optional) */}
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-[#8b949e] mb-1">
            GitHub Personal Access Token <span className="text-[#484f58]">(optional)</span>
          </label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full px-3 py-2 pr-10 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#484f58]"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#c9d1d9]"
            >
              {showToken ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-[#484f58]">
            Required for private repositories. Tokens are never stored.
          </p>
        </div>

        {/* Commit Count */}
        <div>
          <label htmlFor="commitCount" className="block text-sm font-medium text-[#8b949e] mb-1">
            Number of Commits (1-100)
          </label>
          <input
            type="number"
            id="commitCount"
            min={1}
            max={100}
            value={commitCount}
            onChange={(e) => setCommitCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9]"
            disabled={isLoading}
          />
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#8b949e] mb-1">
            Commit Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CommitCategory)}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9]"
            disabled={isLoading}
          >
            {VALID_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Archived Repository Warning */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmArchived"
            checked={confirmArchived}
            onChange={(e) => setConfirmArchived(e.target.checked)}
            className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117]"
            disabled={isLoading}
          />
          <label htmlFor="confirmArchived" className="text-sm text-[#8b949e]">
            I understand this repository is not archived
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !repoUrl.trim()}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isLoading || !repoUrl.trim()
              ? "bg-[#238636]/50 text-[#8b949e] cursor-not-allowed"
              : "bg-[#238636] text-white hover:bg-[#2ea043]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
              Generating Commits...
            </span>
          ) : (
            "Generate Educational Commits"
          )}
        </button>

        {/* Token Info */}
        <div className="p-3 bg-[#58a6ff]/10 border border-[#58a6ff]/30 rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#58a6ff] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-[#8b949e]">
              For public repositories, no token is required. For private repositories, 
              you'll need a GitHub PAT with "repo" scope. 
              Tokens are only used for this request and never stored.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
