import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export const getEmbeddings = (keyConfiguration: KeyConfiguration) => {
  const {
    apiType,
    azureApiKey,
    azureInstanceName,
    azureEmbeddingDeploymentName,
    azureApiVersion,
    apiKey,
  } = keyConfiguration;
  return apiType === ModelType.AZURE_OPENAI
    ? new OpenAIEmbeddings({
        azureOpenAIApiKey: azureApiKey,
        azureOpenAIApiInstanceName: azureInstanceName,
        azureOpenAIApiDeploymentName: azureEmbeddingDeploymentName,
        azureOpenAIApiVersion: azureApiVersion,
      })
    : new OpenAIEmbeddings({
        openAIApiKey: apiKey,
      });
};
