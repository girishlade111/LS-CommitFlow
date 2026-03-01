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
  validateRequest,
  MAX_COMMITS,
} from "../../lib/validation";

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

    // Validate complete request
    const validation = validateRequest({
      repoUrl: body.repoUrl,
      token: body.token,
      commitCount: body.commitCount,
      category: body.category,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.errors,
          code: "VALIDATION_ERROR" 
        },
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
        categoryUsed: body.category,
        commits: commits.map((commit) => ({
          sha: commit.sha.substring(0, 7),
          message: commit.message,
          timestamp: commit.timestamp,
          branch: commit.branch,
          url: commit.url,
        })),
        repository: `${parsedRepo.owner}/${parsedRepo.repo}`,
        totalCommits: commits.length,
        warnings: validation.warnings,
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
    version: "2.0.0",
    description: "Educational GitHub API automation",
    endpoints: {
      POST: {
        path: "/api/generate-commits",
        body: {
          repoUrl: "string (required) - GitHub repository URL",
          token: "string (required) - GitHub Personal Access Token",
          commitCount: "number (required) - Number of commits (1-1000)",
          category: "string (required) - Category from the list of available categories",
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
    categories: {
      groups: [
        "Business & Website Projects",
        "Software Development",
        "AI & Data",
        "DevOps & Infrastructure",
        "Security",
        "Curated & Knowledge Repos",
        "Emerging Tech",
        "Repository Types",
      ],
      total: 47,
    },
  });
}
