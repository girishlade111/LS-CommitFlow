/**
 * Validation utilities for GitHub repository inputs
 * SECURITY: These functions validate input before any API calls
 */

// =============================================================================
// CATEGORY DEFINITIONS
// =============================================================================

/** Category groups for UI organization */
export const CATEGORY_GROUPS = {
  BUSINESS: "Business & Website Projects",
  SOFTWARE: "Software Development",
  AI_DATA: "AI & Data",
  DEVOPS: "DevOps & Infrastructure",
  SECURITY: "Security",
  KNOWLEDGE: "Curated & Knowledge Repos",
  EMERGING: "Emerging Tech",
  REPO_TYPES: "Repository Types",
} as const;

export type CategoryGroup = typeof CATEGORY_GROUPS[keyof typeof CATEGORY_GROUPS];

/** All categories organized by group */
export const CATEGORIES_BY_GROUP: Record<CategoryGroup, string[]> = {
  [CATEGORY_GROUPS.BUSINESS]: [
    "Ecommerce",
    "Business Website",
    "Blog Platform",
    "Portfolio",
    "Education Platform",
    "Newsletter System",
    "Magazine CMS",
    "Social Media App",
    "Booking System",
    "SaaS Platform",
    "Landing Page Project",
  ],
  [CATEGORY_GROUPS.SOFTWARE]: [
    "Web Development",
    "Mobile Development",
    "Full Stack Application",
    "Frontend Project",
    "Backend API",
    "Developer Tools",
    "CLI Tools",
    "Framework Boilerplate",
    "Libraries",
    "Design Systems",
  ],
  [CATEGORY_GROUPS.AI_DATA]: [
    "AI Agents",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Automation Systems",
    "LLM Integrations",
    "Prompt Engineering",
    "Model Evaluation",
  ],
  [CATEGORY_GROUPS.DEVOPS]: [
    "DevOps",
    "Infrastructure",
    "Cloud Native",
    "Docker Projects",
    "Kubernetes",
    "CI/CD",
    "Self Hosted",
    "Monitoring Tools",
  ],
  [CATEGORY_GROUPS.SECURITY]: [
    "Cyber Security",
    "Ethical Hacking",
    "Security Research",
    "Encryption Systems",
  ],
  [CATEGORY_GROUPS.KNOWLEDGE]: [
    "Awesome Lists",
    "Cheat Sheets",
    "Roadmaps",
    "Public APIs",
    "Interview Preparation",
    "Open Source Books",
    "Project Based Learning",
    "Curated Resources",
  ],
  [CATEGORY_GROUPS.EMERGING]: [
    "Web3",
    "Blockchain",
    "Embedded Systems",
    "IoT",
    "Low Code Platforms",
    "No Code Platforms",
    "Comparison Repositories",
    "Top 10 Collections",
  ],
  [CATEGORY_GROUPS.REPO_TYPES]: [
    "Local to Remote Migration",
    "Mirror Repository",
    "Archived Repository",
    "Internal Tools",
  ],
};

/** Flat array of all valid categories */
export const VALID_CATEGORIES = Object.values(CATEGORIES_BY_GROUP).flat() as string[];

/** Type for valid category */
export type CommitCategory = typeof VALID_CATEGORIES[number];

// =============================================================================
// URL PARSING
// =============================================================================

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
 * Validate GitHub URL format strictly
 */
export function isValidGitHubUrl(url: string): boolean {
  return parseRepoUrl(url) !== null;
}

// =============================================================================
// TOKEN VALIDATION
// =============================================================================

/**
 * Validate GitHub Personal Access Token format
 * SECURITY: This does NOT store or log the token
 */
export function validateToken(token: string | undefined): { isValid: boolean; error?: string } {
  // Token is required
  if (!token || typeof token !== "string") {
    return { isValid: false, error: "GitHub Personal Access Token is required" };
  }

  const trimmedToken = token.trim();
  
  if (trimmedToken.length === 0) {
    return { isValid: false, error: "GitHub Personal Access Token is required" };
  }

  // GitHub PATs typically start with ghp_, gho_, ghu_, ghs_, or ghr_
  // Classic PATs are 40 characters
  // Fine-grained tokens start with github_pat_
  const isValidPrefix = 
    trimmedToken.startsWith("ghp_") ||   // Classic personal access token
    trimmedToken.startsWith("gho_") ||   // OAuth access token
    trimmedToken.startsWith("ghu_") ||   // User-to-server token
    trimmedToken.startsWith("ghs_") ||   // Server-to-server token
    trimmedToken.startsWith("ghr_") ||   // Refresh token
    trimmedToken.startsWith("github_pat_"); // Fine-grained token

  // Check minimum length (tokens are typically 20+ characters)
  const isValidLength = trimmedToken.length >= 20;

  if (!isValidPrefix && !isValidLength) {
    return { 
      isValid: false, 
      error: "Invalid token format. Token must be a valid GitHub Personal Access Token (minimum 20 characters)" 
    };
  }

  return { isValid: true };
}

// =============================================================================
// COMMIT COUNT VALIDATION
// =============================================================================

/** Maximum commits allowed per request */
export const MAX_COMMITS = 1000;

/** Warning threshold for commit count */
export const COMMIT_WARNING_THRESHOLD = 100;

/**
 * Validate commit count is within limits
 */
export function validateCommitCount(count: number): { isValid: boolean; error?: string; warning?: string } {
  const num = Number(count);
  
  if (isNaN(num)) {
    return { isValid: false, error: "Commit count must be a valid number" };
  }
  
  if (!Number.isInteger(num)) {
    return { isValid: false, error: "Commit count must be a whole number" };
  }
  
  if (num < 1) {
    return { isValid: false, error: "Commit count must be at least 1" };
  }
  
  if (num > MAX_COMMITS) {
    return { isValid: false, error: `Commit count cannot exceed ${MAX_COMMITS}` };
  }
  
  // Warning for high values
  if (num > COMMIT_WARNING_THRESHOLD) {
    return { 
      isValid: true, 
      warning: "Large commit volumes may trigger GitHub rate limits. Consider reducing the number of commits." 
    };
  }
  
  return { isValid: true };
}

// =============================================================================
// CATEGORY VALIDATION
// =============================================================================

/**
 * Validate commit category
 */
export function validateCategory(category: string): category is CommitCategory {
  return VALID_CATEGORIES.includes(category);
}

/**
 * Get category group for a category
 */
export function getCategoryGroup(category: string): CategoryGroup | null {
  for (const [group, categories] of Object.entries(CATEGORIES_BY_GROUP)) {
    if (categories.includes(category)) {
      return group as CategoryGroup;
    }
  }
  return null;
}

// =============================================================================
// REPOSITORY VALIDATION
// =============================================================================

/**
 * Repository validation result
 */
export interface RepoValidationResult {
  isValid: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  defaultBranch: string;
  isProtected: boolean;
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

// =============================================================================
// COMPLETE REQUEST VALIDATION
// =============================================================================

/**
 * Complete request validation result
 */
export interface RequestValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate complete request
 */
export function validateRequest(body: {
  repoUrl: string;
  token?: string;
  commitCount: number;
  category: string;
}): RequestValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate repository URL (required)
  const parsedRepo = parseRepoUrl(body.repoUrl);
  if (!parsedRepo) {
    errors.push("GitHub Repository URL is required and must be in format: owner/repo or https://github.com/owner/repo");
  }

  // Validate token (required)
  const tokenValidation = validateToken(body.token);
  if (!tokenValidation.isValid) {
    errors.push(tokenValidation.error || "Invalid token");
  }

  // Validate commit count
  const countValidation = validateCommitCount(body.commitCount);
  if (!countValidation.isValid) {
    errors.push(countValidation.error || "Invalid commit count");
  } else if (countValidation.warning) {
    warnings.push(countValidation.warning);
  }

  // Validate category
  if (!validateCategory(body.category)) {
    errors.push(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
