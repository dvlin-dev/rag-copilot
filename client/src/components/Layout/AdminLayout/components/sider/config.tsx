import { IconHome, IconGridRectangle } from '@douyinfe/semi-icons';

export interface MenuItem {
  itemKey: string;
  text: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}

const MENU_CONFIG: MenuItem[] = [
  {
    itemKey: '1',
    text: 'app.menu.dashboard',
    icon: <IconHome />,
    items: [
      {
        itemKey: '1-1',
        text: 'app.menu.dashboard.anlyanis',
        path: '/admin/anlyanis',
      },
    ],
  },
  {
    itemKey: '2',
    text: 'app.menu.management',
    icon: <IconGridRectangle />,
    items: [
      {
        itemKey: '2-1',
        text: 'app.menu.management.user',
        path: '/admin/user',
      },
    ],
  },
];

export default MENU_CONFIG;
