import Layout from '@/components/FrontLayout/Layout';
import Seo from '@/components/Seo';
import styles from './index.module.scss';
import { Button } from '@douyinfe/semi-ui';

export default function Email() {
  return (
    <main className={styles.loginScreen}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>密码登录</h1>
        </div>
        <div className={styles.loginPath}></div>
        <div className={styles.forgetContainer}>
          <Button
            theme='borderless'
            type='tertiary'
            block
            className={styles.loginPathButton}
          >
            忘记密码
          </Button>
        </div>
      </div>
    </main>
  );
}
