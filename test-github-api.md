# GitHub README Fetcher API Test Guide

## Setup (Optional)

### **Option 1: No Token (Limited)**
- **Works immediately** without any setup
- **Rate limit**: 60 requests/hour
- **Only public repositories**

### **Option 2: With GitHub Token (Recommended)**
1. **Add GitHub Token to Environment Variables**
   ```bash
   # Add this to your .env.local file
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

2. **Get GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` scope for private repos, or `public_repo` for public repos
   - **Rate limit**: 5,000 requests/hour

## Test the API

### Method 1: Using GitHub URL (Recommended)
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
  "githubUrl": "https://github.com/vercel/next.js"
}'
```

### Method 2: Using Owner and Repo (Legacy)
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
  "owner": "vercel",
  "repo": "next.js"
}'
```

### Test with Different Repositories

#### React Repository
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
  "githubUrl": "https://github.com/facebook/react"
}'
```

#### Vue.js Repository
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
  "githubUrl": "https://github.com/vuejs/vue"
}'
```

#### Your Example Repository
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}'
```

## What You'll Get

The API returns:
- **README Content**: The full text content of the README file
- **File Metadata**: Filename, path, size, SHA hash
- **Download URL**: Direct link to download the file
- **Repository Info**: Owner/repo name for reference

## Response Format
```json
{
  "success": true,
  "message": "GitHub README fetched successfully",
  "repository": "assafelovic/gpt-researcher",
  "extractedFrom": {
    "githubUrl": "https://github.com/assafelovic/gpt-researcher",
    "owner": "assafelovic",
    "repo": "gpt-researcher"
  },
  "readme": {
    "filename": "README.md",
    "path": "README.md",
    "size": 12345,
    "sha": "abc123...",
    "content": "# GPT Researcher\n\nAn autonomous research agent...",
    "encoding": "base64",
    "download_url": "https://raw.githubusercontent.com/..."
  },
  "keyDetails": { ... }
}
```

## Error Handling

- **Missing API Key**: 400 error
- **Invalid API Key**: 401 error
- **Insufficient Permissions**: 403 error
- **Missing Repository Info**: 400 error
- **README Not Found**: 500 error with details
- **GitHub API Errors**: 500 error with details

## Rate Limits

GitHub API has rate limits:
- **With GitHub Token**: 5,000 requests/hour
- **Without Token**: 60 requests/hour

**Note**: If you hit rate limits, you'll get a 403 error. Add a GitHub token to increase your limit.

## How It Works

1. **Accepts GitHub URL** or direct owner/repo parameters
2. **Extracts owner and repo** from GitHub URLs automatically
3. **Fetches README.md** from the repository root
4. **Falls back to README** (without extension) if README.md not found
5. **Decodes base64 content** to readable text
6. **Returns formatted response** with content and metadata

## URL Parsing

The API automatically extracts repository information from GitHub URLs:
- ✅ `https://github.com/owner/repo`
- ✅ `https://github.com/owner/repo.git`
- ✅ `https://github.com/owner/repo/`
- ❌ `https://github.com/owner/repo/tree/main` (will extract `owner/repo`)
