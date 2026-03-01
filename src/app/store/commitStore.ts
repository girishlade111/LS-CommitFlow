import { create } from "zustand";

export interface Commit {
  sha: string;
  message: string;
  timestamp: string;
  branch: string;
  url: string;
}

interface CommitState {
  commits: Commit[];
  isLoading: boolean;
  error: string | null;
  currentProgress: number;
  totalCommits: number;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addCommits: (commits: Commit[]) => void;
  clearCommits: () => void;
  setProgress: (current: number, total: number) => void;
}

export const useCommitStore = create<CommitState>((set) => ({
  commits: [],
  isLoading: false,
  error: null,
  currentProgress: 0,
  totalCommits: 0,

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addCommits: (newCommits) => 
    set((state) => ({ 
      commits: [...state.commits, ...newCommits] 
    })),
  
  clearCommits: () => 
    set({ 
      commits: [], 
      error: null, 
      currentProgress: 0, 
      totalCommits: 0 
    }),
    
  setProgress: (current, total) => 
    set({ 
      currentProgress: current, 
      totalCommits: total 
    }),
}));
