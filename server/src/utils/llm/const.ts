// Default Constants
export const DEFAULT_SYSTEM_PROMPT =
  'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.';

// Environment variables
const {
  NEXT_PUBLIC_CHAT_FILES_MAX_SIZE,
  NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH,
  OPENAI_TYPE,
  OPENAI_API_KEY,
  OPENAI_API_MODEL,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_INSTANCE_NAME,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_VERSION,
  OPENAI_PROXY,
} = process.env;

export {
  NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH,
  OPENAI_TYPE, // Or OPENAI || AZURE_OPENAI
  OPENAI_API_KEY,
  OPENAI_API_MODEL,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_INSTANCE_NAME,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_VERSION,
  OPENAI_PROXY,
};

// Number Parsing
export const CHAT_FILES_MAX_SIZE =
  parseInt(NEXT_PUBLIC_CHAT_FILES_MAX_SIZE || '') || 0;
