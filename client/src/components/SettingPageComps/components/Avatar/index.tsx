import EditorCard from '@/components/EditorCard';
import { settingConfig } from '../../config';
import useUserStore from '@/store/user';
import { updateUserInfo } from '@/api/user';
import UploadImg from '@/components/Upload';

import styles from './index.module.scss';

const AvatarettingCard = () => {
  const { user, setUser } = useUserStore();

  const config = settingConfig.avatar;
  const defaultAvatar = user?.profile.avatar || '';

  const successHandle = (url) => {
    return new Promise((resolve, reject) => {
      updateUserInfo({ avatar: url })
        .then((data) => {
          setUser(data.data);
          resolve(data.data);
        })
        .catch(reject);
    });
  };
  return (
    <EditorCard
      title={config.title}
      type='customDefinition'
      description={config.description}
      tips={config.tips}
    >
      <div className={styles.avatarContainer}>
        {config.description}
        <UploadImg
          imageUrl={defaultAvatar}
          username={user?.username || ''}
          successHandle={successHandle}
        />
      </div>
    </EditorCard>
  );
};
export default AvatarettingCard;
