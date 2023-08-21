import { IconHome, IconGridRectangle } from '@douyinfe/semi-icons';

export interface MenuItem {
  itemKey: string;
  text: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}

const PROJECT_CONFIG: MenuItem[] = [
  {
    itemKey: '1-2',
    text: 'workspace.project.workshop',
    path: '/workspace/project/workshop',
  },
  {
    itemKey: '1-3',
    text: 'workspace.project.feekback',
    path: '/workspace/project/feekback',
  },
  {
    itemKey: '1-4',
    text: 'workspace.project.setting',
    path: '/workspace/project/setting',
  },
];

const DOC_CONFIG: MenuItem[] = [
  {
    itemKey: '2-1',
    text: 'workspace.doc.data',
    path: '/workspace/doc/data',
  },
  {
    itemKey: '2-2',
    text: 'workspace.doc.import',
    path: '/workspace/doc/import',
  },
  {
    itemKey: '2-3',
    text: 'workspace.doc.workshop',
    path: '/workspace/doc/workshop',
  },
];

export { PROJECT_CONFIG, DOC_CONFIG };
