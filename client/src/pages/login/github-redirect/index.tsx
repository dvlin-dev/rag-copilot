import { getGithubUser } from '@/api/github';
import React, { useEffect } from 'react';
import useUserStore from '@/store/user';
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
    // const isAdmin =
    //   roles.findIndex(
    //     (item) => item.name === 'super' || item.name === 'admin'
    //   ) !== -1;
    // 判断权限
    push('/workspace');
    ToastSuccess('欢迎 👏');
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      const params = {
        code,
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
    } else {
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
