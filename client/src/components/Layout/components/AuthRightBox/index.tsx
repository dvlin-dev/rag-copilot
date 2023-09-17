import { logout } from '@/api/user';
import CustomAvatar from '@/components/CustomAvatar';
import useUserStore from '@/store/user';
import { ToastSuccess, clearUserToken } from '@/utils/common';
import { Dropdown, DropdownDivider, Spin } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { useState } from 'react';

const AuthRightBox = () => {
  const { push, pathname } = useRouter();
  const [logoutIsLoading, setLogoutIsLoading] = useState(false);
  const { user, clearUser } = useUserStore();
  if (!user) return null;

  const logoutHandle = async () => {
    setLogoutIsLoading(true);
    logout()
      .then(() => {
        ToastSuccess('退出成功');
        push('/login');
        clearUserToken();
        clearUser();
      })
      .catch(() => {})
      .finally(() => {
        setLogoutIsLoading(false);
      });
  };
  return (
    <>
      <Dropdown
        position='bottomLeft'
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => push('/workspace/project')}>
              应用列表
            </Dropdown.Item>
            <Dropdown.Item onClick={() => push('/workspace/doc')}>
              知识库列表
            </Dropdown.Item>
            <Dropdown.Item onClick={() => push('/workspace/account')}>
              账号设置
            </Dropdown.Item>
            <DropdownDivider />
            <Dropdown.Item onClick={logoutHandle}>
              {logoutIsLoading && <Spin />}
              退出
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <CustomAvatar
          id={user?.id}
          src={user?.profile?.avatar ?? ''}
          username={user?.username as string}
          size='small'
        />
        <div />
      </Dropdown>
    </>
  );
};
export default AuthRightBox;
