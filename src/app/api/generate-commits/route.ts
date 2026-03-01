/**
 * API Route: Generate Educational Commits
 * 
 * SECURITY REQUIREMENTS:
 * - Tokens are handled only in memory, never stored
 * - Input validation before any API calls
 * - Rate limiting considerations
 * - Repository ownership validation
 */

import { NextRequest, NextResponse } from "next/server";
import { generateEducationalCommits } from "../../lib/github";
import {
  parseRepoUrl,
  validateToken,
  validateCommitCount,
  validateCategory,
} from "../../lib/validation";

// Maximum commits allowed per request
const MAX_COMMITS = 100;

// Rate limiting - simple in-memory store (use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Max requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Check rate limit for an IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Validate incoming request
 */
function validateRequest(body: {
  repoUrl: string;
  token?: string;
  commitCount: number;
  category: string;
}): {
  isValid: boolean;
  error?: string;
} {
  // Validate repository URL
  const parsedRepo = parseRepoUrl(body.repoUrl);
  if (!parsedRepo) {
    return {
      isValid: false,
      error: "Invalid GitHub repository URL. Use format: owner/repo or https://github.com/owner/repo",
    };
  }

  // Validate token if provided
  if (body.token && !validateToken(body.token)) {
    return {
      isValid: false,
      error: "Invalid GitHub token format",
    };
  }

  // Validate commit count
  if (!validateCommitCount(body.commitCount)) {
    return {
      isValid: false,
      error: `Commit count must be between 1 and ${MAX_COMMITS}`,
    };
  }

  // Validate category
  if (!validateCategory(body.category)) {
    return {
      isValid: false,
      error: "Invalid category. Must be one of: Study, IT, Marketplace",
    };
  }

  return { isValid: true };
}

/**
 * POST handler for generating commits
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateRequest({
      repoUrl: body.repoUrl,
      token: body.token,
      commitCount: body.commitCount,
      category: body.category,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Parse repository URL
    const parsedRepo = parseRepoUrl(body.repoUrl)!;

    // Generate commits
    // SECURITY: Token is passed directly to the function, never stored
    try {
      const commits = await generateEducationalCommits(
        body.token,
        parsedRepo.owner,
        parsedRepo.repo,
        body.commitCount,
        body.category
      );

      return NextResponse.json({
        success: true,
        commits: commits.map((commit) => ({
          sha: commit.sha.substring(0, 7),
          message: commit.message,
          timestamp: commit.timestamp,
          branch: commit.branch,
          url: commit.url,
        })),
        repository: `${parsedRepo.owner}/${parsedRepo.repo}`,
        totalCommits: commits.length,
      });
    } catch (genError) {
      console.error("Generate commits error:", genError);
      throw genError;
    }
  } catch (error: unknown) {
    // Extract error information - handle various error formats
    let errorMessage = "An unexpected error occurred. Please try again.";
    let errorStatus = 500;
    let errorDetails = "";
    
    // Try to extract status and message from different error formats
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      
      // Check for status property
      if (typeof err.status === 'number') {
        errorStatus = err.status;
      }
      
      // Check for message property
      if (typeof err.message === 'string') {
        errorMessage = err.message;
      }
      
      // Check for errors array
      if (Array.isArray(err.errors)) {
        errorDetails = JSON.stringify(err.errors);
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.error("API Error:", { status: errorStatus, message: errorMessage, details: errorDetails });

    // Handle specific error cases
    if (errorStatus === 403) {
      return NextResponse.json(
        {
          error: errorMessage || "Access denied. Check your permissions.",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    if (errorStatus === 404) {
      return NextResponse.json(
        {
          error: "Repository not found. Check the URL.",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (errorStatus === 401) {
      return NextResponse.json(
        {
          error: "Invalid or expired token.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (errorStatus === 422) {
      return NextResponse.json(
        {
          error: errorMessage || "Failed to create commit. Check repository settings.",
          code: "UNPROCESSABLE_ENTITY",
        },
        { status: 422 }
      );
    }

    // Return more detailed error message for debugging
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - return API usage info
 */
export async function GET() {
  return NextResponse.json({
    name: "Git Commit Tool API",
    version: "1.0.0",
    description: "Educational GitHub API automation",
    endpoints: {
      POST: {
        path: "/api/generate-commits",
        body: {
          repoUrl: "string (required) - GitHub repository URL",
          token: "string (optional) - GitHub Personal Access Token",
          commitCount: "number (required) - Number of commits (1-100)",
          category: "string (required) - Category: Study, IT, or Marketplace",
        },
      },
    },
    security: {
      note: "Tokens are handled in memory only and never stored.",
      warnings: [
        "Educational Use Only",
        "Respect GitHub API rate limits",
        "Do not use for contribution manipulation",
      ],
    },
  });
}
