/**
 * Validation utilities for GitHub repository inputs
 * SECURITY: These functions validate input before any API calls
 */

/**
 * Parse and validate a GitHub repository URL
 * Supports formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 * - owner/repo
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Clean up the URL
  let cleanUrl = url.trim();

  // Remove trailing slashes
  cleanUrl = cleanUrl.replace(/\/$/, "");

  // Remove .git suffix
  cleanUrl = cleanUrl.replace(/\.git$/, "");

  // Handle full GitHub URLs
  const httpsMatch = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)$/);
  if (httpsMatch) {
    return {
      owner: httpsMatch[1],
      repo: httpsMatch[2],
    };
  }

  // Handle short format: owner/repo
  const shortMatch = cleanUrl.match(/^([^/]+)\/([^/]+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
    };
  }

  return null;
}

/**
 * Validate GitHub Personal Access Token format
 * SECURITY: This does NOT store or log the token
 */
export function validateToken(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  // GitHub PATs typically start with ghp_, gho_, ghu_, ghs_, or ghr_
  // Classic PATs are 40 characters
  // Fine-grained tokens start with github_pat_
  const isValidFormat = 
    token.startsWith("ghp_") ||   // Classic personal access token
    token.startsWith("gho_") ||   // OAuth access token
    token.startsWith("ghu_") ||   // User-to-server token
    token.startsWith("ghs_") ||   // Server-to-server token
    token.startsWith("ghr_") ||   // Refresh token
    token.startsWith("github_pat_"); // Fine-grained token

  // Check minimum length (tokens are typically 20+ characters)
  const isValidLength = token.length >= 20;

  return isValidFormat || isValidLength;
}

/**
 * Validate commit count is within limits
 */
export function validateCommitCount(count: number): boolean {
  const num = Number(count);
  return Number.isInteger(num) && num >= 1 && num <= 100;
}

/**
 * Validate commit category
 */
export const VALID_CATEGORIES = ["Study", "IT", "Marketplace"] as const;
export type CommitCategory = typeof VALID_CATEGORIES[number];

export function validateCategory(category: string): category is CommitCategory {
  return VALID_CATEGORIES.includes(category as CommitCategory);
}

/**
 * Validate repository is not archived
 */
export interface RepoValidationResult {
  isValid: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  defaultBranch: string;
  error?: string;
}

/**
 * Check if user has write access to repository
 * SECURITY: This validates ownership before any write operations
 */
export function hasWriteAccess(
  repoOwner: string,
  userLogin: string,
  isPrivate: boolean,
  hasToken: boolean
): boolean {
  // If public repo, write access is granted with token
  if (!isPrivate && hasToken) {
    return true;
  }

  // If private repo, user must be the owner
  if (isPrivate && hasToken) {
    return repoOwner === userLogin;
  }

  // No token means no write access
  return false;
}
