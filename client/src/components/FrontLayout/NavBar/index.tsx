import {
  Nav,
  Dropdown,
  Button,
  Typography,
  DropdownDivider,
  Spin,
} from '@douyinfe/semi-ui';
import Image from 'next/image';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import useUserStore from '@/store/user';
import { useState } from 'react';
import { logout } from '@/api/user';
import { NoticeSuccess, clearUserToken } from '@/utils/common';
import { getDeviceId } from '@/utils/device';
import CustomAvatar from '@/components/CustomAvatar';

export default function NavBar() {
  const { push, pathname } = useRouter();
  const { user, clearUser } = useUserStore();
  const [logoutIsLoading, setLogoutIsLoading] = useState(false);

  const UnAuthRightBox = () => {
    const { Text } = Typography;

    return (
      <div className={styles.unAuth}>
        <Text type='primary' link onClick={() => push('/login')}>
          登录
        </Text>
        <Button
          type='primary'
          theme='solid'
          onClick={() => push('/login/register')}
        >
          注册
        </Button>
      </div>
    );
  };

  const logoutHandle = async () => {
    setLogoutIsLoading(true);
    const deviceId = getDeviceId();
    deviceId &&
      logout(deviceId)
        .then(() => {
          NoticeSuccess('退出成功', user?.username);
          push('/login');
          clearUserToken();
          clearUser();
        })
        .catch(() => {})
        .finally(() => {
          setLogoutIsLoading(false);
        });
  };

  const AuthRightBox = () => (
    <>
      <Dropdown
        position='bottomLeft'
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => push(`/user/${user?.id}`)}>
              个人主页
            </Dropdown.Item>
            <Dropdown.Item onClick={() => push('/user/setting')}>
              个人设置
            </Dropdown.Item>
            <DropdownDivider />
            <Dropdown.Item onClick={() => push('/admin')}>
              后台管理
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

  const renderRightBox = () => {
    return <div>{!!user ? AuthRightBox() : UnAuthRightBox()}</div>;
  };

  const renderHorizontal = () => {
    return (
      <header className={styles.navbarContainer}>
        <Nav
          className={styles.navbar}
          mode={'horizontal'}
          style={{ padding: 0 }}
          header={
            <>
              <Image
                src={'/images/devlink_white.svg'}
                alt='logo'
                width={127}
                height={35}
                style={{ cursor: 'pointer' }}
                onClick={() => push('/')}
              />
            </>
          }
          footer={renderRightBox()}
        />
      </header>
    );
  };
  return <div>{renderHorizontal()}</div>;
}
