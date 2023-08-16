import useSWR from 'swr';
import Layout from '@/components/FrontLayout/Layout';
import Seo from '@/components/Seo';
import UserInfoCard from '@/components/UserInfoCard';

import styles from './index.module.scss';
import { fetcher } from '@/utils/http';

interface UserProps {
  userId: string;
}

const User = ({ userId }: UserProps) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`/user/profile?id=${userId}`, fetcher);

  if (isLoading) return <div>用户信息获取中...</div>;
  if (error) return <div>用户信息获取失败</div>;

  return (
    <main className={styles.userPage}>
      <div className={styles.userContainer}>
        <div className={styles.useInfoAside}>
          <UserInfoCard {...user} />
        </div>
      </div>
    </main>
  );
};

User.getInitialProps = async ({ query }: { query: UserProps }) => {
  const { userId } = query;
  return { userId };
};

export default User;
