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
    tips: '上下文：{background}。 历史消息：{history}。 问题：{input} ',
  },
};
