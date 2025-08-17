import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { z } from 'zod'

// Initialize the LLM with structured output
const llm = new ChatOpenAI({
  modelName: 'gpt-5-nano',
  temperature: 1,
  openAIApiKey: process.env.OPENAI_API_KEY
}).withStructuredOutput(
  z.object({
    summary: z.string().describe('A comprehensive summary of the GitHub repository based on the README content'),
    cool_facts: z.array(z.string()).describe('An array of 3-5 interesting facts, features, or highlights about the repository')
  })
)

// Create the prompt template
const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert at analyzing GitHub repositories. Your task is to summarize a GitHub repository based on its README file content.

README Content:
{readmeContent}

Instructions:
1. Read and analyze the README content carefully
2. Provide a comprehensive summary of what this repository is about
3. Extract 3-5 interesting facts, features, or highlights
4. Focus on the most important aspects: purpose, technology, features, and use cases

Please provide a well-structured analysis of this repository.
`)

// Create the chain
export const githubSummaryChain = RunnableSequence.from([
  promptTemplate,
  llm
])

// Alternative: Simple function that uses the chain
export async function summarizeGitHubRepo(readmeContent) {
  try {
    const result = await githubSummaryChain.invoke({
      readmeContent: readmeContent
    })
    
    return {
      success: true,
      summary: result.summary,
      cool_facts: result.cool_facts
    }
  } catch (error) {
    console.error('LangChain summarization error:', error)
    return {
      success: false,
      error: `Failed to summarize repository: ${error.message}`
    }
  }
}

// Export the chain for direct use
export default githubSummaryChain
