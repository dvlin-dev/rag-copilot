import React, { FC } from 'react';
import { IconSemiLogo } from '@douyinfe/semi-icons';
import { Layout } from '@douyinfe/semi-ui';

const { Footer } = Layout;

const Index: FC = () => {
  return (
    <Footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        color: 'var(--semi-color-text-2)',
        backgroundColor: 'rgba(var(--semi-grey-0), 1)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span>{new Date().getFullYear()}</span>
      </span>
      <span>
        <span>私有化定制</span>
      </span>
    </Footer>
  );
};

export default Index;
