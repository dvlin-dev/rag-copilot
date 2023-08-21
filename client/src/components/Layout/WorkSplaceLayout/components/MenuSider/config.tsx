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
    text: 'workspace.project',
    icon: <IconComponent />,
    path: '/workspace/project',
  },
  {
    itemKey: '2',
    text: 'workspace.doc',
    icon: <IconGallery />,
    path: '/workspace/doc',
  },
  {
    itemKey: '3',
    text: 'workspace.account',
    icon: <IconIdCard />,
    path: '/workspace/account',
  },
];

export default MENU_CONFIG;
