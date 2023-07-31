export interface IValidate {
  errorMsg: string;
  validate: (value: string) => boolean;
  emptyErrorMsg: string;
}

const validate: Record<string, IValidate> = {
  phone: {
    emptyErrorMsg: '请输入手机号',
    errorMsg: '手机格式错误',
    validate(value: string) {
      return /^\d{5,11}$/.test(value);
    },
  },
  email: {
    emptyErrorMsg: '请输入邮箱',
    errorMsg: '邮箱格式错误',
    validate(value: string) {
      return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    },
  },
  password: {
    emptyErrorMsg: '请输入密码',
    errorMsg: '密码强度弱：请包含大小写字母和数字，可以使用特殊字符，长度8-20',
    validate(value: string) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(value);
    },
  },
  code: {
    emptyErrorMsg: '请输入验证码',
    errorMsg: '验证码格式错误',
    validate(value: string) {
      return /^[A-Za-z0-9]{6}$/.test(value);
    },
  },
};

const install: Record<
  string,
  (fieldValue: string, values: Record<string, any>) => string
> = {};

Object.keys(validate).forEach((item) => {
  install[item + 'Validate'] = (fieldValue: string): string => {
    if (!fieldValue) {
      return validate[item].emptyErrorMsg;
    }
    if (!validate[item].validate(fieldValue)) {
      return validate[item].errorMsg;
    }
    return '';
  };
});

export default install;
