# Git Commit Tool - Educational GitHub API Automation

<p align="center">
  <img src="https://img.shields.io/badge/Educational-Only-yellow" alt="Educational Use Only" />
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

## ⚠️ Educational Use Only

This tool is strictly for educational purposes. It is designed to help developers learn how to:

- Work with the GitHub REST API
- Understand commit history and Git operations
- Automate repository operations programmatically

**Do not use this tool for:**
- Manipulating contribution history for hiring purposes
- Bypassing GitHub's rate limits
- Spamming repositories
- Any activity that violates GitHub's Terms of Service

---

## Features

- 🔐 Secure GitHub API integration using Octokit
- 📊 Visual Git Story timeline with animations
- 🎯 Multiple commit categories (Study, IT, Marketplace)
- 🔒 Token handling in memory only - never stored
- ⏱️ Rate limiting to prevent API abuse
- 🎨 Dark mode developer UI
- 📱 Responsive design

---

## Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Account
- (Optional) GitHub Personal Access Token for private repos

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd git-commit-tool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### Getting a GitHub Personal Access Token

For private repositories, you'll need a GitHub PAT:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` - Full control of private repositories
   - `public_repo` - Access public repositories (if needed)
4. Generate and copy the token

**Important:** Tokens are only used for the current request and are never stored.

### Using the Tool

1. Enter a GitHub repository URL (e.g., `owner/repo` or full URL)
2. (Optional) Enter your GitHub PAT for private repos
3. Select the number of commits (1-100)
4. Choose a commit category
5. Click "Generate Educational Commits"
6. Watch the Git Story timeline animate

---

## API Reference

### POST /api/generate-commits

Generate educational commits in a repository.

**Request Body:**

```json
{
  "repoUrl": "owner/repo or https://github.com/owner/repo",
  "token": "ghp_xxxxxxxxxxxx (optional)",
  "commitCount": 5,
  "category": "Study"
}
```

**Response:**

```json
{
  "success": true,
  "commits": [
    {
      "sha": "abc1234",
      "message": "Educational Study commit 1/5",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "branch": "main",
      "url": "https://github.com/owner/repo/commit/abc1234"
    }
  ],
  "repository": "owner/repo",
  "totalCommits": 5
}
```

---

## Security Features

- ✅ Tokens handled only in memory
- ✅ No token storage in databases
- ✅ Input validation before API calls
- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Repository ownership validation
- ✅ Maximum 100 commits per request
- ✅ 500ms throttle between commits

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, TailwindCSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Backend:** Next.js API Routes
- **GitHub API:** Octokit

---

## Project Structure

```
git-commit-tool/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-commits/
│   │   │       └── route.ts        # API endpoint
│   │   ├── components/
│   │   │   ├── RepoInput.tsx       # Input form
│   │   │   └── GitTimeline.tsx     # Timeline visualization
│   │   ├── lib/
│   │   │   ├── github.ts           # GitHub API integration
│   │   │   └── validation.ts       # Input validation
│   │   ├── store/
│   │   │   └── commitStore.ts      # Zustand state
│   │   ├── utils/
│   │   │   └── templates.ts        # Commit message templates
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main page
│   └── (Next.js app router files)
├── .env.example                    # Environment config
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Limitations

- Maximum 100 commits per session
- Cannot push to protected branches without explicit confirmation
- Cannot operate on archived repositories
- Rate limited to prevent abuse

---

## Troubleshooting

### "Repository not found"
- Check the repository URL format
- Ensure the repository exists and is accessible

### "Access denied"
- For private repos, provide a valid GitHub PAT
- Verify the token has appropriate permissions

### "Rate limit exceeded"
- Wait a minute before retrying
- Use a GitHub PAT for higher rate limits

### "Failed to create commit"
- Check if branch is protected
- Verify repository is not archived

---

## Contributing

This is an educational project. Contributions are welcome for:

- Bug fixes
- Documentation improvements
- New features that enhance learning

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Disclaimer

This tool is provided for educational purposes only. The author is not responsible for any misuse of this tool. Always respect GitHub's Terms of Service and API guidelines.

---

## Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit Documentation](https://octokit.github.io/)
- [GitHub Terms of Service](https://github.com/terms)
