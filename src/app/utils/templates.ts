/**
 * Commit message templates for educational automation
 * Each category has multiple templates with dynamic placeholders
 */

import { CommitCategory } from "../lib/validation";

// Placeholder values for dynamic substitution
const studyTopics = [
  "data structures",
  "algorithm analysis",
  "machine learning",
  "web development",
  "database design",
  "network security",
  "cloud computing",
  "software engineering",
  "system design",
  "distributed systems",
];

const itComponents = [
  "authentication module",
  "API gateway",
  "cache layer",
  "database queries",
  "error handling",
  "logging system",
  "configuration management",
  "deployment pipeline",
  "monitoring dashboard",
  "load balancer",
];

const marketplaceItems = [
  "product catalog",
  "shopping cart",
  "payment gateway",
  "user profile",
  "search functionality",
  "recommendation engine",
  "inventory management",
  "order processing",
  "review system",
  "wishlist feature",
];

/**
 * Get a random item from an array
 */
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random timestamp within the last N days
 */
function getRandomTimestamp(daysBack: number = 7): string {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - randomDays);
  now.setHours(now.getHours() - randomHours);
  now.setMinutes(now.getMinutes() - randomMinutes);
  
  return now.toISOString();
}

export interface CommitMessageResult {
  message: string;
  timestamp: string;
}

/**
 * Generate a commit message based on category
 */
export function generateCommitMessage(category: CommitCategory): CommitMessageResult {
  const timestamp = getRandomTimestamp();
  
  let message = "";
  
  switch (category) {
    case "Study": {
      const templates = [
        `Refined study notes on ${getRandomItem(studyTopics)}`,
        `Improved algorithm explanation for ${getRandomItem(studyTopics)}`,
        `Expanded documentation on ${getRandomItem(studyTopics)}`,
        `Added examples for ${getRandomItem(studyTopics)}`,
        `Corrected typos in ${getRandomItem(studyTopics)} section`,
        `Updated references for ${getRandomItem(studyTopics)}`,
        `Enhanced readability of ${getRandomItem(studyTopics)} notes`,
        `Added practice exercises for ${getRandomItem(studyTopics)}`,
      ];
      message = getRandomItem(templates);
      break;
    }
    
    case "IT": {
      const templates = [
        `Refactored ${getRandomItem(itComponents)} logic`,
        `Optimized ${getRandomItem(itComponents)} handling`,
        `Improved ${getRandomItem(itComponents)} strategy`,
        `Fixed bug in ${getRandomItem(itComponents)}`,
        `Updated ${getRandomItem(itComponents)} configuration`,
        `Enhanced ${getRandomItem(itComponents)} performance`,
        `Added validation to ${getRandomItem(itComponents)}`,
        `Improved error handling in ${getRandomItem(itComponents)}`,
      ];
      message = getRandomItem(templates);
      break;
    }
    
    case "Marketplace": {
      const templates = [
        `Enhanced ${getRandomItem(marketplaceItems)} UI`,
        `Improved ${getRandomItem(marketplaceItems)} validation`,
        `Updated ${getRandomItem(marketplaceItems)} performance`,
        `Fixed ${getRandomItem(marketplaceItems)} bug`,
        `Added new features to ${getRandomItem(marketplaceItems)}`,
        `Optimized ${getRandomItem(marketplaceItems)} loading`,
        `Improved ${getRandomItem(marketplaceItems)} accessibility`,
        `Updated ${getRandomItem(marketplaceItems)} styling`,
      ];
      message = getRandomItem(templates);
      break;
    }
    
    default:
      message = "Updated educational content";
  }
  
  return { message, timestamp };
}

/**
 * Generate multiple commit messages
 */
export function generateCommitMessages(
  category: CommitCategory,
  count: number
): CommitMessageResult[] {
  const messages: CommitMessageResult[] = [];
  
  for (let i = 0; i < count; i++) {
    messages.push(generateCommitMessage(category));
  }
  
  // Sort by timestamp (oldest first)
  messages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return messages;
}

/**
 * File content for educational commits
 * This creates a simple log file that gets updated with each commit
 */
export function generateFileContent(commitMessages: CommitMessageResult[]): string {
  const lines: string[] = [
    "# Educational Commit Log",
    "# This file tracks the commit history for learning purposes",
    "",
    "## Commits",
    "",
  ];
  
  commitMessages.forEach((commit, index) => {
    const date = new Date(commit.timestamp).toLocaleString();
    lines.push(`${index + 1}. ${commit.message}`);
    lines.push(`   Date: ${date}`);
    lines.push("");
  });
  
  return lines.join("\n");
}

/**
 * Generate initial file content for a new repository
 */
export function generateInitialContent(): string {
  return `# Educational Commit Log

This repository is being used for educational purposes to learn GitHub API automation.

## Purpose
- Learn how to use the GitHub API
- Understand commit history and Git operations
- Practice working with GitHub's REST API

## Educational Note
This tool is designed for learning GitHub API concepts. Always respect GitHub's terms of service and rate limits.

Last updated: ${new Date().toISOString()}
`;
}
