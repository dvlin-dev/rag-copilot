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
    tips: '修改或者删除下面三个参数：background、history、input，会导致对应的功能缺失。',
  },
};
