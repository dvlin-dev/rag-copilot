import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useMemo } from 'react';
import Seo from '@/components/Seo';
import FrontLayout from '@/components/FrontLayout/Layout';
import { LocaleProvider } from '@douyinfe/semi-ui';
import IntlProvider from 'react-intl/src/components/provider';
import useStore from '../store/common/global';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import { localeConfig } from '../locales';

import '@/styles/nprogress.module.scss';
import '@/styles/normalize.css';
import useFetchUserInfo from '@/hooks/useFetchUserInfo';
import AdminLayout from '@/components/Admin/AdminLayout';
Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = useStore((state) => state.locale);
  useFetchUserInfo();
  const getLocale = useMemo(() => {
    if (locale === 'en_GB') {
      return en_GB;
    } else if (locale === 'zh_CN') {
      return zh_CN;
    }
  }, [locale]);

  const isAdminRoute = router.pathname.startsWith('/admin');

  const LayoutComponent = isAdminRoute ? AdminLayout : FrontLayout;
  return (
    <LocaleProvider locale={getLocale}>
      <IntlProvider
        locale={locale.split('_')[0]}
        messages={localeConfig[locale]}
      >
        <LayoutComponent>
          <Seo />
          <Component {...pageProps} />
        </LayoutComponent>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default MyApp;
