import { getInfo } from '@/api/user';
import type { User } from '@/types/user';
import { Modal, Toast, Notification } from '@douyinfe/semi-ui';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import type { Dispatch, SetStateAction } from 'react';

// 通用的正确弹窗
export function ToastSuccess(content: string, duration = 4) {
  return Toast.success({
    content: content,
    duration,
    showClose: false,
  });
}

export function NoticeSuccess(title: string, content?: string, duration = 3) {
  return Notification.success({
    title: title,
    content: content,
    duration,
  });
}

// 通用的信息弹窗
export function ToastInfo(
  content: string,
  duration = 3,
  icon?: React.ReactNode
) {
  return Toast.info({
    content: content,
    duration,
    showClose: false,
    icon,
  });
}

// 通用的错误弹窗
export function ToastError(content: string, duration = 4) {
  return Toast.error({
    content: content || 'Error',
    duration,
    showClose: false,
  });
}
// 通用的警告弹窗
export function ToastWaring(content: string, duration = 4) {
  return Toast.warning({
    content: content || 'Warning',
    duration,
    showClose: false,
  });
}
// 注意：【confirmFun】和【cancelFun】，如果是 http请求，则需要 return http 请求，如果不是 Promise，则在方法前面加 async，即可
export function execConfirm(
  confirmFun: () => Promise<void>,
  cancelFun?: () => Promise<void>,
  msg?: string
) {
  Modal.confirm({
    title: '提示',
    content: msg || '确定执行操作？',
    maskClosable: false,
    onOk: () => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        if (confirmFun) {
          return await confirmFun()
            .then(() => resolve(null))
            .catch(() => resolve(null));
        }
        return resolve(null); // 关闭 confirm弹窗
      });
    },
    onCancel() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        if (cancelFun) {
          return await cancelFun()
            .then(() => resolve(null))
            .catch(() => resolve(null));
        }
        return resolve(null); // 关闭 confirm弹窗
      });
    },
  });
}

// modal 点击各种关闭按钮时
export function onModalCancel(
  setModalVisible: Dispatch<SetStateAction<boolean>>,
  formApi: FormApi<any> | undefined,
  initForm: any
) {
  // 判断表单是否修改
  let flag = false;
  for (const key in formApi?.getValues()) {
    if (
      JSON.stringify(initForm[key]) !==
      JSON.stringify(formApi?.getValues()[key])
    ) {
      flag = true;
      break;
    }
  }

  // 如果没有修改，则关闭 modal
  if (!flag) {
    setModalVisible(false);
    return;
  }

  // 否则进行提示
  execConfirm(
    async () => {
      setModalVisible(false);
    },
    undefined,
    '表单数据已被修改，确定关闭吗？'
  );
}

/**
 *
 * @param length
 * @returns 随机字符串
 */
export function randomString(length = 6) {
  const BASE_CHAR_NUMBER = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let resStr = '';
  for (let index = 0; index < length; index++) {
    resStr += BASE_CHAR_NUMBER.charAt(Math.floor(Math.random() * 36));
  }
  return resStr;
}

export function getUserInfo(): Promise<User> {
  return new Promise((resolve) => {
    getInfo()
      .then((res) => {
        const userinfo: User = res.data;
        resolve(userinfo);
      })
      .catch(() => {});
  });
}

export function clearUserToken() {
  localStorage.setItem('bearerToken', '');
}

interface CompareResult {
  action: 'added' | 'deleted';
  item: string;
}

export function compareArrays(
  A: string[],
  B: string[]
): CompareResult | undefined {
  const setA = new Set(A);
  const setB = new Set(B);

  if (A.length > B.length) {
    // 从A中删除了一个元素
    for (const item of setA) {
      if (!setB.has(item)) {
        return {
          action: 'deleted',
          item: item,
        };
      }
    }
  } else {
    // 在A中添加了一个元素
    for (const item of setB) {
      if (!setA.has(item)) {
        return {
          action: 'added',
          item: item,
        };
      }
    }
  }
}

export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      Notification.success({
        title: '复制成功',
        duration: 3,
        theme: 'light',
      });
    },
    (err) => {
      Notification.error({
        title: '复制失败',
        content: err,
        duration: 3,
        theme: 'light',
      });
    }
  );
};
