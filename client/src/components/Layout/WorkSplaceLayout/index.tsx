import React, { Suspense } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import Header from './components/header';
import Sider from './components/MenuSider';

import styles from './index.module.scss';
import SuspendFallbackLoading from '@/components/FallbackLoading';
import ContentSider, { ContentSiderType } from './components/ContentSider';
import { useRouter } from 'next/router';

const { Content } = Layout;

interface WorkSplaceLayoutProps {
  children: React.ReactNode;
}

const WorkSplaceLayout: React.FC<WorkSplaceLayoutProps> = ({ children }) => {
  const { pathname } = useRouter();

  const isSubRoute = (path: string, baseRoute: string) => {
    return pathname.startsWith(baseRoute) && pathname !== baseRoute;
  };

  const contentSiderType: ContentSiderType = React.useMemo(() => {
    if (isSubRoute(pathname, '/workspace/project')) {
      return 'project';
    } else if (isSubRoute(pathname, '/workspace/doc')) {
      return 'doc';
    }
  }, [pathname]);

  return (
    <div className={styles.Layout}>
      <Layout className='layout-page'>
        <Sider />
        <Layout>
          <Header />
          <Content className='layout-content'>
            <ContentSider contentSiderType={contentSiderType}>
              {/* <Suspense
                fallback={<SuspendFallbackLoading message='正在加载中' />}
              > */}
              {children}
              {/* </Suspense> */}
            </ContentSider>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default WorkSplaceLayout;
