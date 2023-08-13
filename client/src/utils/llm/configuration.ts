import {
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_INSTANCE_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  OPENAI_API_KEY,
  OPENAI_API_MODEL,
  OPENAI_TYPE,
} from './const';

export const getKeyConfigurationFromEnvironment = (): KeyConfiguration => {
  const keyConfiguration: KeyConfiguration = {
    apiType: OPENAI_TYPE as ModelType,
    apiKey: OPENAI_API_KEY,
    apiModel: OPENAI_API_MODEL,
    azureApiKey: AZURE_OPENAI_API_KEY,
    azureInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
    azureApiVersion: AZURE_OPENAI_API_VERSION,
    azureDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureEmbeddingDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  };
  validateKeyConfiguration(keyConfiguration);
  return keyConfiguration;
};

const validateKeyConfiguration = (keyConfiguration: KeyConfiguration): void => {
  switch (keyConfiguration.apiType) {
    case ModelType.OPENAI:
      if (!keyConfiguration.apiKey) {
        throw new Error(`Expected environment value: OPENAI_API_KEY`);
      }
      break;

    case ModelType.AZURE_OPENAI:
      const missingKeys: string[] = [];

      if (!keyConfiguration.azureApiKey)
        missingKeys.push('AZURE_OPENAI_API_KEY');
      if (!keyConfiguration.azureInstanceName)
        missingKeys.push('AZURE_OPENAI_API_INSTANCE_NAME');
      if (!keyConfiguration.azureApiVersion)
        missingKeys.push('AZURE_OPENAI_API_VERSION');
      if (!keyConfiguration.azureDeploymentName)
        missingKeys.push('AZURE_OPENAI_API_DEPLOYMENT_NAME');
      if (!keyConfiguration.azureEmbeddingDeploymentName)
        missingKeys.push('AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME');

      if (missingKeys.length > 0) {
        throw new Error(
          `Expected environment values: ${missingKeys.join(', ')}`
        );
      }
      break;
  }
};
