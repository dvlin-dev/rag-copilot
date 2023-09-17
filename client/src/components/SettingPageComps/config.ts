export enum ConfigType {
  PHOTO = 'photo',
  AVATAR = 'avatar',
  USERNAME = 'username',
  EMAIL = 'email',
  DESCRIPTION = 'description',
}

export type settingConfigType = {
  [key in ConfigType]: {
    title: string;
    tips?: string;
    description?: string;
  };
};

export const settingConfig: settingConfigType = {
  photo: {
    title: '照片',
    tips: '照片是可选的，但强烈推荐使用。他将在一些场景下当作你的背景墙',
  },
  avatar: {
    title: '头像',
    description: '点击头像从你的文件中上传一个定制的头像。',
    tips: '允许上传图片最大体积 10MB',
  },
  username: {
    title: '用户名',
    tips: '请输入 6 至 20 位字符',
  },
  email: {
    title: '邮箱',
    // tips: '我们将通过电子邮件向您确认更改',
  },
  description: {
    title: '个人简介',
    tips: '请输入 200 字符以内的简介',
  },
};
