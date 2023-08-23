export enum ConfigType {
  MODAL = 'modal',
  DOC = 'doc',
  PROMPT = 'prompt',
}

export type settingConfigType = {
  [key in ConfigType]: {
    title: string;
    tips?: string;
    description?: string;
  };
};

export const ProjectSettingConfig: settingConfigType = {
  modal: {
    title: '模型',
    tips: 'gpt3.5 限时免费',
  },
  doc: {
    title: '知识库',
    description: '应用的知识库',
    tips: '应用的会根据知识库来回答问题',
  },
  prompt: {
    title: '提示词',
    tips: '通过设定模型的固定提示词，我们可以引导模型交流的方向。这些内容将始终位于上下文的开始位置',
  },
};
