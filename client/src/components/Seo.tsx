import Head from 'next/head';
import { useRouter } from 'next/router';

const defaultMeta = {
  title: 'devlink',
  siteName: 'devlink',
  description: 'devlink',
  keywords: 'devlink',
  url: 'https://devlink.wiki',
  type: 'website',
  robots: 'follow, index',
  image: 'https://qiniuyun.devlink.wiki/devlink_d_black.png',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
  isBlog?: boolean;
  banner?: string;
} & Partial<typeof defaultMeta>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  meta['title'] = props.templateTitle
    ? `${props.templateTitle} | ${meta.siteName}`
    : meta.title;

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name='robots' content={meta.robots} />
      <meta content={meta.keywords} name='keywords' />
      <meta content={meta.description} name='description' />
      <meta property='' name='header_title' content='devlink 官网'></meta>
      <meta name='image' property='og:image' content={meta.image} />
      <meta property='og:type' content={meta.type} />
      <meta property='og:site_name' content={meta.siteName} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:title' content={meta.title} />
      <meta property='og:url' content={`${meta.url}${router.asPath}`} />
      <link rel='canonical' href={`${meta.url}${router.asPath}`} />
      <link
        key='/images/devlink_d_black.svg'
        href='/images/devlink_d_black.svg'
        rel='icon'
      />
      <meta name='theme-color' content='#ffffff' />
    </Head>
  );
}
