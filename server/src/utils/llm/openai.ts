import { OpenAI } from 'langchain/llms/openai';
import { ModelType } from 'src/types/chat';
import { KeyConfiguration } from 'src/types/keyConfiguration';
import { ChatOpenAI } from 'langchain/chat_models/openai';

type GetModelType = 'openAi' | 'chatOpenAi';

export const getModel = async (
  keyConfiguration: KeyConfiguration,
  tpye: GetModelType = 'openAi'
) => {
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
    // streaming: true,
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

  return tpye === 'openAi'
    ? new OpenAI(
        apiType === ModelType.AZURE_OPENAI
          ? { ...commonConfig, ...azureConfig }
          : { ...commonConfig, ...openAIConfig }
      )
    : new ChatOpenAI(
        apiType === ModelType.AZURE_OPENAI
          ? { ...commonConfig, ...azureConfig }
          : { ...commonConfig, ...openAIConfig }
      );
};
