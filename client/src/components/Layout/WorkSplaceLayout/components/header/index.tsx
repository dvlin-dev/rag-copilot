import React, { FC } from 'react';
import { Layout, Nav, RadioGroup, Radio } from '@douyinfe/semi-ui';
import useStore from '@/store/common/global';

import AuthRightBox from '@/components/Layout/components/AuthRightBox';

const { Header } = Layout;

const Index: FC = () => {
  const locale = useStore((state) => state.locale);
  const changeLocale = useStore((state) => state.changeLocale);

  const selectLocale = (locale: 'zh_CN' | 'en_GB') => {
    changeLocale(locale);
    localStorage.setItem('semi_locale', locale);
  };

  return (
    <Header className='layout-header'>
      <Nav
        mode='horizontal'
        footer={
          <>
            <RadioGroup
              type='button'
              defaultValue={locale}
              style={{ marginRight: '20px' }}
            >
              <Radio value={'zh_CN'} onChange={() => selectLocale('zh_CN')}>
                中文
              </Radio>
              <Radio value={'en_GB'} onChange={() => selectLocale('en_GB')}>
                EN
              </Radio>
            </RadioGroup>
            <AuthRightBox />
          </>
        }
      ></Nav>
    </Header>
  );
};

export default Index;
