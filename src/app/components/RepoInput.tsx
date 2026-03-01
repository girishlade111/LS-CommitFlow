"use client";

import { useState, useMemo, useEffect } from "react";
import { useCommitStore } from "../store/commitStore";
import { 
  VALID_CATEGORIES, 
  CATEGORIES_BY_GROUP, 
  CATEGORY_GROUPS, 
  CategoryGroup,
  COMMIT_WARNING_THRESHOLD,
  MAX_COMMITS
} from "../lib/validation";
import { getCommitMessages } from "../utils/templates";

export default function RepoInput() {
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [commitCount, setCommitCount] = useState(5);
  const [category, setCategory] = useState(VALID_CATEGORIES[0]);
  const [confirmArchived, setConfirmArchived] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { setLoading, setError, addCommits, setProgress, isLoading, currentProgress, totalCommits } = useCommitStore();

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return null;
    
    const search = categorySearch.toLowerCase();
    const results: { group: CategoryGroup; categories: string[] }[] = [];
    
    for (const [group, categories] of Object.entries(CATEGORIES_BY_GROUP)) {
      const matching = categories.filter(c => c.toLowerCase().includes(search));
      if (matching.length > 0) {
        results.push({ group: group as CategoryGroup, categories: matching });
      }
    }
    return results.length > 0 ? results : null;
  }, [categorySearch]);

  // Generate preview messages
  const previewMessages = useMemo(() => {
    if (!showPreview || commitCount < 1) return [];
    const count = Math.min(commitCount, 10); // Show max 10 preview messages
    return getCommitMessages(category, count);
  }, [showPreview, commitCount, category]);

  // Check for warnings
  const commitCountWarning = commitCount > COMMIT_WARNING_THRESHOLD 
    ? "Large commit volumes may trigger GitHub rate limits."
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate inputs
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!token.trim()) {
      setError("GitHub Personal Access Token is required");
      return;
    }

    if (token.length < 20) {
      setError("Token appears to be invalid");
      return;
    }

    setLoading(true);
    setProgress(0, commitCount);

    try {
      const response = await fetch("/api/generate-commits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: token.trim(),
          commitCount,
          category,
        }),
      });

      const data = await response.json();

      // Show detailed error info
      if (!response.ok) {
        setError(`Error ${response.status}: ${data.error || data.details?.[0] || "Unknown error"}`);
        return;
      }

      // Add commits to store
      if (data.commits) {
        addCommits(data.commits);
      }
      
      // Show warnings if any
      if (data.warnings && data.warnings.length > 0) {
        console.warn("Warnings:", data.warnings);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-[#c9d1d9]">
        Generate Educational Commits
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Repository URL - REQUIRED */}
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-[#8b949e] mb-1">
            GitHub Repository URL <span className="text-[#f85149]">*</span>
          </label>
          <input
            type="text"
            id="repoUrl"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="owner/repo or https://github.com/owner/repo"
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#484f58]"
            disabled={isLoading}
            required
          />
        </div>

        {/* GitHub Token - REQUIRED */}
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-[#8b949e] mb-1">
            GitHub Personal Access Token <span className="text-[#f85149]">*</span>
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
              required
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
            Required. Tokens are never stored and used only for this request.
          </p>
        </div>

        {/* Commit Count */}
        <div>
          <label htmlFor="commitCount" className="block text-sm font-medium text-[#8b949e] mb-1">
            Number of Commits (1-{MAX_COMMITS})
          </label>
          <input
            type="number"
            id="commitCount"
            min={1}
            max={MAX_COMMITS}
            value={commitCount}
            onChange={(e) => setCommitCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9]"
            disabled={isLoading}
          />
          {commitCountWarning && (
            <p className="mt-1 text-xs text-[#d29922] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {commitCountWarning}
            </p>
          )}
        </div>

        {/* Category Selection - Grouped Dropdown with Search */}
        <div className="relative category-dropdown">
          <label htmlFor="category" className="block text-sm font-medium text-[#8b949e] mb-1">
            Commit Category
          </label>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              id="category-search"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              placeholder="Search categories..."
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#484f58]"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg max-h-80 overflow-y-auto">
              {filteredCategories ? (
                // Show search results
                filteredCategories.map((group) => (
                  <div key={group.group}>
                    <div className="px-3 py-1 text-xs text-[#8b949e] bg-[#0d1117] sticky top-0">
                      {group.group}
                    </div>
                    {group.categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setCategorySearch("");
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-[#c9d1d9] hover:bg-[#21262d] transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                // Show all categories grouped
                Object.entries(CATEGORIES_BY_GROUP).map(([group, categories]) => (
                  <div key={group}>
                    <div className="px-3 py-1 text-xs text-[#8b949e] bg-[#0d1117] sticky top-0">
                      {group}
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setCategorySearch("");
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left transition-colors ${
                          category === cat 
                            ? "bg-[#388bfd] text-white" 
                            : "text-[#c9d1d9] hover:bg-[#21262d]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Selected category display */}
          <div className="mt-2 text-sm text-[#c9d1d9]">
            Selected: <span className="text-[#58a6ff]">{category}</span>
          </div>
        </div>

        {/* Preview Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            {showPreview ? "Hide" : "Show"} commit preview
            <svg 
              className={`w-4 h-4 transition-transform ${showPreview ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Preview Messages */}
          {showPreview && (
            <div className="mt-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-md max-h-40 overflow-y-auto">
              <p className="text-xs text-[#8b949e] mb-2">Preview (first {previewMessages.length} of {commitCount}):</p>
              <ul className="space-y-1">
                {previewMessages.map((msg, i) => (
                  <li key={i} className="text-xs text-[#c9d1d9] truncate">
                    {i + 1}. {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
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

        {/* Progress Display */}
        {isLoading && (
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-md">
            <div className="flex justify-between text-sm text-[#8b949e] mb-1">
              <span>Generating commits...</span>
              <span>{currentProgress} / {totalCommits}</span>
            </div>
            <div className="w-full bg-[#30363d] rounded-full h-2">
              <div 
                className="bg-[#238636] h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCommits > 0 ? (currentProgress / totalCommits) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !repoUrl.trim() || !token.trim()}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isLoading || !repoUrl.trim() || !token.trim()
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
              For private repositories, you'll need a GitHub PAT with "repo" scope. 
              Tokens are only used for this request and never stored.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
