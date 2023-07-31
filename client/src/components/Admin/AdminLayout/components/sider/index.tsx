import { FC, useEffect, useMemo, useState } from 'react';
import { Layout, Nav } from '@douyinfe/semi-ui';
import menuList, { MenuItem } from './config';
import { useRouter } from 'next/router';
import { useLocale } from '@/locales';
import useStore from '@/store/common/global';
import Image from 'next/image';

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

const Index: FC = () => {
  const { pathname, push } = useRouter();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { formatMessage } = useLocale();
  const locale = useStore((state) => state.locale);

  const navList = useMemo(() => {
    return menuList.map((e) => {
      return {
        ...e,
        text: formatMessage({ id: e.text }),
        icon: e?.icon,
        items: e?.items
          ? e.items.map((m) => {
              return {
                ...m,
                text: formatMessage({ id: m.text }),
                icon: m.icon,
              };
            })
          : [],
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
    <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
      <Nav
        items={navList}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 220, height: '100%' }}
        header={{
          logo: (
            <Image
              src={'/images/devlink_d_black.svg'}
              alt='logo'
              width={27}
              height={35}
              style={{ cursor: 'pointer' }}
              onClick={() => push('/')}
            />
          ),
          text: 'Devlink Admin',
        }}
        footer={{
          collapseButton: true,
        }}
      />
    </Sider>
  );
};

export default Index;
