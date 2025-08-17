import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: 'gpt-5-nano', // More cost-effective than gpt-3.5-turbo
  temperature: 1,
  openAIApiKey: process.env.OPENAI_API_KEY
})

// Define the output schema
const outputSchema = {
  summary: 'string',
  cool_facts: 'array of strings'
}

// Create the output parser
const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
  summary: 'A comprehensive summary of the GitHub repository based on the README content',
  cool_facts: 'An array of interesting facts, features, or highlights about the repository'
})

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

{format_instructions}

Please provide a well-structured analysis of this repository.
`)

// Create the chain
export const githubSummaryChain = RunnableSequence.from([
  {
    readmeContent: (input) => input.readmeContent,
    format_instructions: () => outputParser.getFormatInstructions()
  },
  promptTemplate,
  llm,
  outputParser
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
