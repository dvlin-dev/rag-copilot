import { IconComponent, IconGallery, IconIdCard } from '@douyinfe/semi-icons';

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
    text: 'worksplace.project',
    icon: <IconComponent />,
    path: '/worksplace/project',
  },
  {
    itemKey: '2',
    text: 'worksplace.docs',
    icon: <IconGallery />,
    path: '/worksplace/docs',
  },
  {
    itemKey: '3',
    text: 'worksplace.account',
    icon: <IconIdCard />,
    path: '/worksplace/account',
  },
];

export default MENU_CONFIG;
