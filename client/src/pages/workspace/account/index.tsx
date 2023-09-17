import { Anchor } from '@douyinfe/semi-ui';
import UserNameSettingCard from '@/components/SettingPageComps/components/UserName';
import EmailSettingCard from '@/components/SettingPageComps/components/Email';
import DescriptionSettingCard from '@/components/SettingPageComps/components/Description';

import styles from './style/index.module.scss';
// import ThirdPartyLoginInfoCard from '@/components/ThirdPartyLoginInfoCard';
import AvatarettingCard from '@/components/SettingPageComps/components/Avatar';
import useUserStore from '@/store/user';

const Account = () => {
  const { user } = useUserStore();
  const getContainer = () => {
    return document.querySelector('window') as HTMLElement | Window;
  };

  return (
    <main className={styles.settingPage}>
      <div className={styles.settingContainer}>
        <div className={styles.settingView}>
          <div id='normalInfo'>
            <div className={styles.settingBaseTitle}>基本信息</div>
            <div className={styles.settingViewItem}>
              <AvatarettingCard />
            </div>
            <div className={styles.settingViewItem}>
              <UserNameSettingCard />
            </div>
            <div className={styles.settingViewItem}>
              <EmailSettingCard />
            </div>
            <div className={styles.settingViewItem}>
              <DescriptionSettingCard />
            </div>
          </div>
          {/* {user && user.githubId && (
            <div id='thirdPartyLogin'>
              <ThirdPartyLoginInfoCard />
            </div>
          )} */}
        </div>
      </div>
    </main>
  );
};

export default Account;
