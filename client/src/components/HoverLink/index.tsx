import Link, { LinkProps } from 'next/link';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface HoverLinkProps {
  styleSheet?: React.CSSProperties;
  href: string;
  children: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
}

const HoverLink = forwardRef<HTMLAnchorElement, HoverLinkProps>(
  ({ children, href, openNewTab, className, nextLinkProps, ...rest }, ref) => {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab) {
      return (
        <Link
          href={href}
          {...nextLinkProps}
          ref={ref}
          className={clsx(styles.hoverLink, className)}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={href}
        {...rest}
        className={clsx(styles.hoverLink, className)}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </a>
    );
  }
);

HoverLink.displayName = 'HoverLink';

export default HoverLink;
