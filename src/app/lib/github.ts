/**
 * GitHub API integration using Octokit
 * SECURITY: Tokens are handled only in memory, never stored or logged
 */

import { Octokit } from "octokit";

const EDUCATION_FILE = "edu-commit-log.txt";

export interface CommitResult {
  sha: string;
  message: string;
  timestamp: string;
  branch: string;
  url: string;
}

export interface GitHubError {
  status: number;
  message: string;
}

export function createOctokit(token?: string): Octokit {
  return new Octokit({
    auth: token,
    userAgent: "Git-Commit-Tool/1.0.0",
  });
}

export async function validateRepository(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<{
  isValid: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  defaultBranch: string;
  ownerLogin: string;
  permissions: string;
}> {
  const { data: repository } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  let ownerLogin = owner;
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated();
    ownerLogin = user.login;
  } catch {
    // Not authenticated
  }

  return {
    isValid: true,
    isArchived: repository.archived ?? false,
    isPrivate: repository.private ?? false,
    defaultBranch: repository.default_branch ?? "main",
    ownerLogin,
    permissions: repository.permissions ? 
      Object.entries(repository.permissions)
        .filter(([, allowed]) => allowed)
        .map(([perm]) => perm)
        .join(", ") : "read",
  };
}

/**
 * Get current file SHA - fetches fresh each time
 */
async function getCurrentFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string
): Promise<{ sha: string | null; content: string }> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: EDUCATION_FILE,
      ref: branch,
    });

    if (!Array.isArray(data) && data.type === "file") {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return { sha: data.sha, content };
    }
    return { sha: null, content: "" };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 404) {
      return { sha: null, content: "" };
    }
    throw error;
  }
}

/**
 * Commit a file - handles SHA properly
 */
async function commitFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  content: string,
  message: string,
  sha: string | null
): Promise<CommitResult> {
  const encoded = Buffer.from(content).toString("base64");
  
  const params: Record<string, unknown> = {
    owner,
    repo,
    path: EDUCATION_FILE,
    message,
    content: encoded,
    branch,
  };
  
  // Only add SHA if we have one - creates new file if SHA is null
  if (sha) {
    params.sha = sha;
  }

  const { data } = await octokit.rest.repos.createOrUpdateFileContents(params as never);

  return {
    sha: data.commit.sha ?? "",
    message: data.commit.message ?? message,
    timestamp: data.commit.committer?.date ?? new Date().toISOString(),
    branch,
    url: data.commit.html_url ?? "",
  };
}

export async function generateEducationalCommits(
  token: string | undefined,
  owner: string,
  repo: string,
  commitCount: number,
  category: string,
  onProgress?: (current: number, total: number) => void
): Promise<CommitResult[]> {
  const octokit = createOctokit(token);

  // Validate repository
  const repoInfo = await validateRepository(octokit, owner, repo);
  
  if (repoInfo.isArchived) {
    throw { status: 403, message: "Cannot commit to archived repositories" } as GitHubError;
  }

  const branch = repoInfo.defaultBranch;
  const commits: CommitResult[] = [];

  // Get current file state
  const { sha: currentSha, content: existingContent } = await getCurrentFile(octokit, owner, repo, branch);

  // Build content - either append to existing or start fresh
  let fileContent = existingContent || "# Educational Commit Log\n\n";

  // Create initial commit if file doesn't exist, or add a marker if it does
  if (!currentSha) {
    const result = await commitFile(
      octokit, owner, repo, branch,
      fileContent + "Initialized: " + new Date().toISOString() + "\n",
      "Initialize educational commit log",
      null
    );
    commits.push(result);
  }

  // Get fresh SHA for subsequent commits
  let { sha: latestSha } = await getCurrentFile(octokit, owner, repo, branch);

  // Generate commits - get fresh SHA each time
  for (let i = 0; i < commitCount; i++) {
    onProgress?.(i + 1, commitCount);

    // Get fresh SHA before each commit
    const fileData = await getCurrentFile(octokit, owner, repo, branch);
    latestSha = fileData.sha;
    fileContent = fileData.content || "# Educational Commit Log\n\n";

    const timestamp = new Date().toISOString();
    fileContent += `\n---\nCommit ${i + 1}: Educational ${category} update\nTimestamp: ${timestamp}\n`;

    const result = await commitFile(
      octokit, owner, repo, branch,
      fileContent,
      `Educational ${category} commit ${i + 1}/${commitCount}`,
      latestSha
    );

    commits.push(result);

    if (i < commitCount - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return commits;
}
