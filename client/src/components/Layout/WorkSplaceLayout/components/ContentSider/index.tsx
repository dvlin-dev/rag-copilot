import { FC, useEffect, useMemo, useState } from 'react';
import { Layout, Nav } from '@douyinfe/semi-ui';
import { MenuItem, DOCS_CONFIG, PROJECT_CONFIG } from './config';
import { useRouter } from 'next/router';
import { useLocale } from '@/locales';
import useStore from '@/store/common/global';

const { Sider } = Layout;

function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
  for (const menu of menus) {
    if (menu.path === path) {
      return [...keys, menu.itemKey];
    }
    if (menu.items && menu.items.length > 0) {
      const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey]);
      if (result.length === 0) {
        continue;
      }
      return result;
    }
  }
  return [];
}

export type ContentSiderType = 'project' | 'docs' | undefined;

interface ContentSiderProps {
  contentSiderType: ContentSiderType;
  children: React.ReactNode;
}

const { Content } = Layout;

const ContentSider: FC<ContentSiderProps> = ({
  contentSiderType,
  children,
}) => {
  const { pathname, push } = useRouter();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { formatMessage } = useLocale();
  const locale = useStore((state) => state.locale);

  const menuList = useMemo(() => {
    if (contentSiderType === 'project') {
      return PROJECT_CONFIG;
    } else if (contentSiderType === 'docs') {
      return DOCS_CONFIG;
    } else {
      return [];
    }
  }, [contentSiderType]);

  const navList = useMemo(() => {
    return menuList.map((e) => {
      return {
        ...e,
        text: formatMessage({ id: e.text }),
        icon: e?.icon,
      };
    });
  }, [menuList, locale]);

  const onSelect = (data) => {
    setSelectedKeys([...data.selectedKeys]);
    push(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data) => {
    setOpenKeys([...data.openKeys]);
  };

  useEffect(() => {
    const keys: string[] = findMenuByPath(menuList, pathname, []);
    setSelectedKeys([keys.pop() as string]);
    setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
  }, [pathname]);

  return (
    <>
      {!!contentSiderType ? (
        <Layout>
          <Sider
            style={{
              backgroundColor: 'var(--semi-color-bg-1)',
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <Nav
              items={navList}
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onSelect={onSelect}
              onOpenChange={onOpenChange}
              style={{ maxWidth: 220, height: '100%' }}
            />
            <Content className='layout-content'>{children}</Content>
          </Sider>
        </Layout>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ContentSider;
