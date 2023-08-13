import { OpenAIChat } from 'langchain/llms/openai';
import { ModelType } from '../../../types/chat';
import { KeyConfiguration } from '../../../types/keyConfiguration';

export const getModel = async (keyConfiguration: KeyConfiguration) => {
  const {
    apiType,
    azureApiKey,
    azureInstanceName,
    azureDeploymentName,
    azureApiVersion,
    apiModel,
    apiKey,
  } = keyConfiguration;

  const commonConfig = {
    temperature: 0.6,
    streaming: true,
  };

  const azureConfig = {
    azureOpenAIApiKey: azureApiKey,
    azureOpenAIApiInstanceName: azureInstanceName,
    azureOpenAIApiDeploymentName: azureDeploymentName,
    azureOpenAIApiVersion: azureApiVersion,
  };

  const openAIConfig = {
    modelName: apiModel,
    openAIApiKey: apiKey,
  };

  return new OpenAIChat(
    apiType === ModelType.AZURE_OPENAI
      ? { ...commonConfig, ...azureConfig }
      : { ...commonConfig, ...openAIConfig }
  );
};
