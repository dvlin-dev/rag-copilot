import React, { Suspense } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import Header from './components/header';
import Sider from './components/sider';
import Footer from './components/footer';

import styles from './index.module.scss';
import SuspendFallbackLoading from '@/components/FallbackLoading';

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <Layout className='layout-page'>
        <Sider />
        <Layout>
          <Header />
          <Content className='layout-content'>
            <Suspense
              fallback={<SuspendFallbackLoading message='正在加载中' />}
            >
              {children}
            </Suspense>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;
