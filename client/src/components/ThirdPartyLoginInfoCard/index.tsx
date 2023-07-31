import moment from 'moment';
import 'moment/locale/zh-cn';
import { Button } from '@douyinfe/semi-ui';
import {
  IconCalendarClock,
  IconGithubLogo,
  IconLink,
  IconMore,
} from '@douyinfe/semi-icons';

import styles from './index.module.scss';
import HoverLink from '../HoverLink';
import useUserStore from '@/store/user';
import { User } from '@/types/user';

moment.locale('zh-cn');

const ThirdPartyLoginInfoCard = () => {
  const { user } = useUserStore();
  const {
    profile: { githubLogin, githubName },
  } = user as User;
  const githubUrl = `https://github.com/${githubLogin}`;
  return (
    <div className={styles.ThirdPartyLoginInfoCard}>
      <div className={styles.cardTitle}>第三方登录</div>
      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <IconGithubLogo size='extra-large' />
          <div className={styles.userInfo}>
            <div className={styles.platformName}>Github</div>
            <div className={styles.userName}>
              <div>{githubName}</div>
              <HoverLink href={githubUrl} openNewTab>
                ({githubLogin})
              </HoverLink>
            </div>
          </div>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.operation}>
            <Button theme='borderless' icon={<IconMore />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyLoginInfoCard;
