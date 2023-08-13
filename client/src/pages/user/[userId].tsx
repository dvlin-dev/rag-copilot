import useSWR from 'swr';
import Layout from '@/components/FrontLayout/Layout';
import Seo from '@/components/Seo';
import UserInfoCard from '@/components/UserInfoCard';

import styles from './index.module.scss';
import { fetcher } from '@/utils/http';

interface UserProps {
  user_id: string;
}

const User = ({ user_id }: UserProps) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`/user/profile?id=${user_id}`, fetcher);

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
  const { user_id } = query;
  return { user_id };
};

export default User;
