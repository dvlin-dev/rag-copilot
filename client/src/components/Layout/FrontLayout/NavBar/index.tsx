import { Nav, Button, Typography } from '@douyinfe/semi-ui';
import Image from 'next/image';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import useUserStore from '@/store/user';
import AuthRightBox from '../../components/AuthRightBox';

export default function NavBar() {
  const { push } = useRouter();
  const { user, clearUser } = useUserStore();

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

  const renderRightBox = () => {
    return <div>{!!user ? <AuthRightBox /> : UnAuthRightBox()}</div>;
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
