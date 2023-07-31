import { User } from '@/types/user';
import useUserStore from '@/store/user';
import { useState, useEffect } from 'react';

const useFetchUserInfo = () => {
  const [userInfo, setUserInfo] = useState<User>();
  const { getUser } = useUserStore();

  useEffect(() => {
    const bearerToken = localStorage.getItem('bearerToken');
    if (bearerToken) {
      getUser().then((data) => {
        if (data.isRefresh) {
          setUserInfo(data.user);
        }
      });
    }
  }, []);

  return userInfo;
};

export default useFetchUserInfo;
