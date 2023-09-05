import type { ConfigService } from '@nestjs/config';
import { ModelType } from '../../types/chat';
import { KeyConfiguration } from '../../types/keyConfiguration';

export const getKeyConfigurationFromEnvironment = (
  configService: ConfigService
): KeyConfiguration => {
  const keyConfiguration: KeyConfiguration = {
    apiType: configService.get('OPENAI_TYPE') as ModelType,
    apiKey: configService.get('OPENAI_API_KEY'),
    apiModel: configService.get('OPENAI_API_MODEL'),
    azureApiKey: configService.get('AZURE_OPENAI_API_KEY'),
    azureInstanceName: configService.get('AZURE_OPENAI_API_INSTANCE_NAME'),
    azureApiVersion: configService.get('AZURE_OPENAI_API_VERSION'),
    azureDeploymentName: configService.get('AZURE_OPENAI_API_DEPLOYMENT_NAME'),
    azureEmbeddingDeploymentName: configService.get(
      'AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME'
    ),
    basePath: configService.get('OPENAI_PROXY'),
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
