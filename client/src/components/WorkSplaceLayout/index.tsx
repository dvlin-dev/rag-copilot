import React, { Suspense } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import Header from './components/header';
import Sider from './components/sider';

import styles from './index.module.scss';
import SuspendFallbackLoading from '@/components/FallbackLoading';

const { Content } = Layout;

interface WorkSplaceLayoutProps {
  children: React.ReactNode;
}

const WorkSplaceLayout: React.FC<WorkSplaceLayoutProps> = ({ children }) => {
  return (
    <div className={styles.Layout}>
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
        </Layout>
      </Layout>
    </div>
  );
};

export default WorkSplaceLayout;
