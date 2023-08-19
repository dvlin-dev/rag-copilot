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
    itemKey: '1-1',
    text: 'worksplace.project.list',
    path: '/worksplace/project/list',
  },
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

const DOCS_CONFIG: MenuItem[] = [
  {
    itemKey: '2-1',
    text: 'worksplace.docs.list',
    path: '/worksplace/docs/list',
  },
  {
    itemKey: '2-2',
    text: 'worksplace.docs.import',
    path: '/worksplace/docs/import',
  },
  {
    itemKey: '2-3',
    text: 'worksplace.docs.workshop',
    path: '/worksplace/docs/workshop',
  },
];

export { PROJECT_CONFIG, DOCS_CONFIG };
