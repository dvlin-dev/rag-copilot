import { getGithubUser } from '@/api/github';
import { generateDeviceInfo } from '@/utils/device';
import React, { useEffect } from 'react';
import useUserStore from '@/store/user';
import { User } from '@/types/user';
import { useRouter } from 'next/router';
import { ToastError, ToastSuccess } from '@/utils/common';
import { Empty, Spin } from '@douyinfe/semi-ui';
import {
  IllustrationConstructionDark,
  IllustrationConstruction,
} from '@douyinfe/semi-illustrations';

const GithubRedirect = () => {
  const { setUser } = useUserStore();
  const { push } = useRouter();

  const afterLoginSuccess = (user: User) => {
    const { roles } = user;
    setUser(user);
    const isAdmin =
      roles.findIndex(
        (item) => item.name === 'super' || item.name === 'admin'
      ) !== -1;
    // 判断权限
    push(isAdmin ? '/admin' : '/');
    ToastSuccess('欢迎 👏');
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      generateDeviceInfo(code).then((res) => {
        const { deviceId, deviceType } = res;
        const params = {
          code,
          deviceId,
          deviceType,
        };
        getGithubUser(params)
          .then((res) => {
            const { accessToken, user } = res.data;
            localStorage.setItem('bearerToken', accessToken);
            afterLoginSuccess(user);
          })
          .catch(() => {
            errorHandle();
          });
      });
    } else {
      // 导航到登录界面，显示错误信息
      errorHandle();
    }
  }, []);

  const errorHandle = () => {
    ToastError('验证失败');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Empty
        image={<IllustrationConstruction style={{ width: 300, height: 300 }} />}
        darkModeImage={
          <IllustrationConstructionDark style={{ width: 300, height: 300 }} />
        }
        description={
          <>
            <Spin size='large'>身份验证中</Spin>
          </>
        }
      />
    </div>
  );
};

export default GithubRedirect;
