# AI-Powered GitHub README Summarizer Test Guide

## New Features

Your endpoint now includes **AI-powered summarization** using LangChain and OpenAI!

## Setup Required

1. **Add OpenAI API Key** to your `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Get OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy it to your environment variables

## Test the AI Summarization

### Basic Test with AI Summary
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
    "githubUrl" : "https://github.com/assafelovic/gpt-researcher"
}'
```

## What You'll Get Now

### Enhanced Response with AI Summary
```json
{
  "success": true,
  "message": "GitHub README analyzed and summarized successfully",
  "repository": "assafelovic/gpt-researcher",
  "extractedFrom": {
    "githubUrl": "https://github.com/assafelovic/gpt-researcher",
    "owner": "assafelovic",
    "repo": "gpt-researcher"
  },
  "aiSummary": {
    "summary": "GPT Researcher is an autonomous research agent that can conduct comprehensive research on any given topic. It uses GPT-4 to analyze information from multiple sources and generate detailed research reports. The tool is designed to automate the research process, making it faster and more thorough than manual research methods.",
    "cool_facts": [
      "Uses GPT-4 for intelligent analysis and synthesis of information",
      "Can research any topic autonomously without human intervention",
      "Generates comprehensive research reports with citations",
      "Supports multiple research methodologies and approaches",
      "Open-source project with active community contributions"
    ]
  },
  "keyDetails": { ... }
}
```

## AI Summary Structure

The `aiSummary` field contains:
- **`summary`**: A comprehensive summary of the repository
- **`cool_facts`**: Array of interesting facts and features

## How the AI Works

1. **Fetches README** from GitHub repository
2. **Sends content** to OpenAI GPT-5-nano via LangChain (cost-effective model)
3. **Analyzes content** using the prompt: "Summarize this github repository from this readme file content"
4. **Structures output** into summary and cool_facts
5. **Returns both** raw README and AI analysis

## LangChain Chain Details

The chain uses:
- **Prompt Template**: Structured instructions for repository analysis
- **Output Parser**: Ensures consistent JSON structure
- **RunnableSequence**: Efficient chain execution
- **Error Handling**: Graceful fallback if AI fails

## Test Different Repositories

### React Repository
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
    "githubUrl" : "https://github.com/facebook/react"
}'
```

### Next.js Repository
```bash
curl --location --request POST 'http://localhost:3000/api/github-summarizer' \
--header 'apiKey: api_bcBXvSWXNUtR0Pt4iQDLtUewtYDU3PsX' \
--header 'Content-Type: application/json' \
--data '{
    "githubUrl" : "https://github.com/vercel/next.js"
}'
```

## Error Handling

- **AI Summary Fails**: Returns README with error in aiSummary
- **OpenAI API Issues**: Gracefully handles and reports errors
- **Rate Limits**: Respects both GitHub and OpenAI rate limits

## Benefits

- ✅ **Instant Analysis**: Get AI-powered insights in seconds
- ✅ **Structured Output**: Consistent summary and cool facts format
- ✅ **Comprehensive**: Both raw content and AI analysis
- ✅ **Professional**: High-quality summaries using GPT-4o-mini (cost-effective)
- ✅ **Scalable**: Built with LangChain for production use

## Cost Savings

**GPT-4o-mini** is significantly cheaper than GPT-3.5-turbo:
- **Input tokens**: ~$0.15 per 1M tokens (vs $0.50 for GPT-3.5-turbo)
- **Output tokens**: ~$0.60 per 1M tokens (vs $1.50 for GPT-3.5-turbo)
- **Typical README summary**: ~$0.001-0.005 per request
- **Cost reduction**: ~70% cheaper than GPT-3.5-turbo
