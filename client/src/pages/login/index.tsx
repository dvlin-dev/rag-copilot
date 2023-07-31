import styles from './index.module.scss';
import { Button } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { githubClientId } from '@/api/github';

export default function Login() {
  const { push } = useRouter();
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;

  const githubAuth = () => {
    window.location.href = githubAuthUrl;
  };

  return (
    <main className={styles.loginScreen}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>登录 DevLink</h1>
        </div>
        <div className={styles.loginPath}>
          <Button
            type='primary'
            theme='solid'
            block
            className={styles.loginPathButton}
            onClick={() => push('/login/email')}
          >
            密码登录
          </Button>
          <Button
            type='primary'
            theme='solid'
            block
            className={styles.loginPathButton}
            onClick={() => push('/login/code')}
          >
            验证码登录
          </Button>
          <Button
            type='primary'
            theme='solid'
            block
            className={styles.loginPathButton}
            onClick={githubAuth}
          >
            Github 授权
          </Button>
        </div>
        <div className={styles.forgetContainer}>
          <Button
            theme='borderless'
            type='tertiary'
            block
            className={styles.loginPathButton}
            onClick={() => push('/login/register')}
          >
            注册
          </Button>
          {/* //TODO: 忘记密码 */}
          {/* <Button
            theme='borderless'
            type='tertiary'
            block
            className={styles.loginPathButton}
          >
            忘记密码
          </Button> */}
        </div>
      </div>
    </main>
  );
}
