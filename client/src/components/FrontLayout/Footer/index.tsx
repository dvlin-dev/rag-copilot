import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@douyinfe/semi-ui';
import { IconCloud } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { group } from 'console';
import DeployStatus from '../DeployStatus';
import HoverLink from '../../HoverLink';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerMarketing}>
        <div className={styles.group}>
          <div className={styles.statusContinaer}>
            <Image
              src={'/images/devlink_black.svg'}
              alt='logo'
              width={100}
              height={50}
            />
            <div className={styles.groupItem}>
              <DeployStatus />
            </div>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.groupHeader}>产品</div>
          <div className={styles.groupItem}>
            <HoverLink href='/commitlist'>devlink 相关项目开发日志</HoverLink>
          </div>
          <div className={styles.groupItem}>
            <HoverLink href='https://github.com/developerlinks/devlink-cli'>
              devlink-cli
            </HoverLink>
          </div>
          <div className={styles.groupItem}>
            <HoverLink href='https://github.com/developerlinks/devlink-web'>
              devlink-web
            </HoverLink>
          </div>
          <div className={styles.groupItem}>
            <HoverLink href='https://github.com/developerlinks/devlink-server'>
              devlink-server
            </HoverLink>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.groupHeader}>关于我们</div>
          <div className={styles.groupItem}>
            <HoverLink href='https://beian.miit.gov.cn/'>
              豫ICP备2020029001号-7
            </HoverLink>
          </div>
        </div>
      </div>
    </div>
  );
}
