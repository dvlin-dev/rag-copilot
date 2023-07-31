import { OpenAIChat } from 'langchain/llms/openai';
import { ModelType } from '../types/chat';
import { KeyConfiguration } from '../types/keyConfiguration';

export const getModel = async (keyConfiguration: KeyConfiguration) => {
  if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
    return new OpenAIChat({
      temperature: 0.9,
      streaming: true,
      azureOpenAIApiKey: keyConfiguration.azureApiKey,
      azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
      azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
      azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
    });
  } else {
    return new OpenAIChat({
      temperature: 0.9,
      modelName: keyConfiguration.apiModel,
      streaming: true,
      openAIApiKey: keyConfiguration.apiKey,
    });
  }
};

export const getChatModel = async (keyConfiguration: KeyConfiguration) => {
  if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
    return new OpenAIChat({
      temperature: 0.9,
      streaming: true,
      azureOpenAIApiKey: keyConfiguration.azureApiKey,
      azureOpenAIApiInstanceName: keyConfiguration.azureInstanceName,
      azureOpenAIApiDeploymentName: keyConfiguration.azureDeploymentName,
      azureOpenAIApiVersion: keyConfiguration.azureApiVersion,
    });
  } else {
    return new OpenAIChat({
      temperature: 0.9,
      modelName: keyConfiguration.apiModel,
      streaming: true,
      openAIApiKey: keyConfiguration.apiKey,
    });
  }
};
