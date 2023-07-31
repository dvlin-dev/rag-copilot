import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Admin = () => {
  const { push } = useRouter();
  useEffect(() => {
    push('/admin/anlyanis');
  }, []);
  return <>admin</>;
};

export default Admin;
