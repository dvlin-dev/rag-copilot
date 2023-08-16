import React, { FC, useEffect, useState } from 'react';
import {
  Layout,
  Nav,
  Button,
  Badge,
  Dropdown,
  RadioGroup,
  Radio,
  DropdownDivider,
  Spin,
} from '@douyinfe/semi-ui';
import useStore from '@/store/common/global';
import useUserStore from '@/store/user';
import { useRouter } from 'next/router';
import CustomAvatar from '@/components/CustomAvatar';
import { getDeviceId } from '@/utils/device';
import { logout } from '@/api/user';
import { NoticeSuccess, clearUserToken } from '@/utils/common';

const { Header } = Layout;

const Index: FC = () => {
  const locale = useStore((state) => state.locale);
  const changeLocale = useStore((state) => state.changeLocale);
  const { push, pathname } = useRouter();
  const { user, clearUser } = useUserStore();
  const [logoutIsLoading, setLogoutIsLoading] = useState(false);
  if (!user) return null;

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

  const selectLocale = (locale: 'zh_CN' | 'en_GB') => {
    changeLocale(locale);
    localStorage.setItem('semi_locale', locale);
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

  return (
    <Header className='layout-header'>
      <Nav
        mode='horizontal'
        footer={
          <>
            {AuthRightBox()}
            <RadioGroup
              type='button'
              defaultValue={locale}
              style={{ marginLeft: '20px' }}
            >
              <Radio value={'zh_CN'} onChange={() => selectLocale('zh_CN')}>
                中文
              </Radio>
              <Radio value={'en_GB'} onChange={() => selectLocale('en_GB')}>
                EN
              </Radio>
            </RadioGroup>
          </>
        }
      ></Nav>
    </Header>
  );
};

export default Index;
