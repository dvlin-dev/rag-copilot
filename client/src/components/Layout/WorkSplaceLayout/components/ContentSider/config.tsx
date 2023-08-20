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
    text: 'worksplace.project.workshop',
    path: '/worksplace/project/workshop',
  },
  {
    itemKey: '1-3',
    text: 'worksplace.project.feekback',
    path: '/worksplace/project/feekback',
  },
  {
    itemKey: '1-4',
    text: 'worksplace.project.setting',
    path: '/worksplace/project/setting',
  },
];

const DOC_CONFIG: MenuItem[] = [
  {
    itemKey: '2-1',
    text: 'worksplace.doc.data',
    path: '/worksplace/doc/data',
  },
  {
    itemKey: '2-2',
    text: 'worksplace.doc.import',
    path: '/worksplace/doc/import',
  },
  {
    itemKey: '2-3',
    text: 'worksplace.doc.workshop',
    path: '/worksplace/doc/workshop',
  },
];

export { PROJECT_CONFIG, DOC_CONFIG };
