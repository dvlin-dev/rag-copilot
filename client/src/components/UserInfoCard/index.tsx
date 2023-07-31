import moment from 'moment';
import 'moment/locale/zh-cn';
import { User } from '@/types/user';
import CustomAvatar from '../CustomAvatar';
import { Button, Spin } from '@douyinfe/semi-ui';
import { IconCalendarClock, IconLink } from '@douyinfe/semi-icons';
import useSWR, { mutate } from 'swr';

import styles from './index.module.scss';
import { fetcher } from '@/utils/http';
import { follow, unfollow } from '@/api/user';
import { NoticeSuccess, handleCopy } from '@/utils/common';
import useUserStore from '@/store/user';

moment.locale('zh-cn');

const UserInfoCard = (user: User) => {
  const {
    id,
    username,
    profile: { avatar, description },
    createdAt,
  } = user;

  const { user: userSelf } = useUserStore();

  const followerKey = `/follow/${id}/followers`;
  const followingKey = `/follow/${id}/following`;

  const {
    data: followers,
    isLoading: followerFetchIsLoading,
    error: followerFetchError,
  } = useSWR(followerKey, fetcher);

  const {
    data: following,
    isLoading: followingFetchIsLoading,
    error: followingFetchError,
  } = useSWR(followingKey, fetcher);

  const isFollowed =
    !followerFetchIsLoading &&
    followers.data.filter((item) => item.id === userSelf?.id).length !== 0;

  const followHandle = () => {
    const handle = isFollowed ? unfollow : follow;
    handle(id)
      .then(() => {
        NoticeSuccess(isFollowed ? '取消关注' : '关注成功');
        mutate(followerKey);
        mutate(followingKey);
      })
      .catch(() => {})
      .finally(() => {});
  };

  const shareHandle = () => {
    handleCopy(window.location.href);
  };

  const avatarClick = (id: string) => {
    const { pathname } = window.location;
    if (!pathname.startsWith('/user')) {
      open(`/user/${id}`);
    }
  };

  return (
    <div className={styles.userInfoCard}>
      <div className={styles.userAvatarContainer}>
        <CustomAvatar
          id={id}
          username={username}
          src={avatar ?? ''}
          size='large'
          clickHandle={() => avatarClick(id)}
        />
      </div>
      <div className={styles.userName}>{username}</div>
      <div className={styles.operationBar}>
        <div className={styles.operationItem}>
          <Button type='primary' theme='solid' onClick={followHandle}>
            {isFollowed ? '已关注' : '关注'}
          </Button>
        </div>
        <div className={styles.operationItem}>
          <Button icon={<IconLink />} onClick={shareHandle}>
            分享
          </Button>
        </div>
      </div>
      {description && (
        <div className={styles.description}>
          <div className={styles.descriptionContent}>{description}</div>
        </div>
      )}
      <div className={styles.situation}>
        <div className={styles.situationItem}>
          <div className={styles.situationItemTitle}>粉丝</div>
          <div className={styles.situationItemValue}>
            {followerFetchIsLoading ? (
              <Spin />
            ) : followerFetchError ? (
              '获取失败请刷新重试'
            ) : (
              followers.data.length
            )}
          </div>
        </div>
        <div className={styles.situationItem}>
          <div className={styles.situationItemTitle}>关注</div>
          <div className={styles.situationItemValue}>
            {followingFetchIsLoading ? (
              <Spin />
            ) : followingFetchError ? (
              '获取失败请刷新重试'
            ) : (
              following.data.length
            )}
          </div>
        </div>
      </div>
      <div className={styles.creatAt}>
        <IconCalendarClock />
        {moment(createdAt).format('ll')}
      </div>
    </div>
  );
};

export default UserInfoCard;
