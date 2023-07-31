import { Anchor } from '@douyinfe/semi-ui';
import UserNameSettingCard from '@/components/SettingPageComps/components/UserName';
import EmailSettingCard from '@/components/SettingPageComps/components/Email';
import AddressSettingCard from '@/components/SettingPageComps/components/Address';
import DescriptionSettingCard from '@/components/SettingPageComps/components/Description';

import styles from './style/index.module.scss';
import DeviceMange from '@/components/SettingPageComps/components/DeviceMange';
import ThirdPartyLoginInfoCard from '@/components/ThirdPartyLoginInfoCard';
import AvatarettingCard from '@/components/SettingPageComps/components/Avatar';
import useUserStore from '@/store/user';

const Setting = () => {
  const { user } = useUserStore();
  const getContainer = () => {
    return document.querySelector('window') as HTMLElement | Window;
  };

  return (
    <main className={styles.settingPage}>
      <div className={styles.settingContainer}>
        <div className={styles.settingNav}>
          <Anchor
            getContainer={getContainer}
            offsetTop={100}
            targetOffset={100}
            railTheme='tertiary'
            scrollMotion
            defaultAnchor='#normalInfo'
            style={{
              position: 'fixed',
              left: '260px',
              top: '100px',
              width: '200px',
              zIndex: 3,
              fontSize: '18px',
            }}
          >
            <Anchor.Link href='#normalInfo' title='基本信息' />
            <Anchor.Link href='#thirdPartyLogin' title='第三方登录' />
            <Anchor.Link href='#deviceMange' title='设备管理' />
          </Anchor>
        </div>
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
            <div className={styles.settingViewItem}>
              <AddressSettingCard />
            </div>
          </div>
          {user && user.githubId && (
            <div id='thirdPartyLogin'>
              <ThirdPartyLoginInfoCard />
            </div>
          )}
          <div id='deviceMange'>
            <DeviceMange />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Setting;
