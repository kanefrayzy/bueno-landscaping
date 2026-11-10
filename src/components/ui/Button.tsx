import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';

type ButtonStyleProps = {
  variant?: 'green' | 'lime' | 'outline';
  size?: 'md' | 'sm';
  icon?: IconName;
};

type LinkButtonProps = ButtonStyleProps & ComponentPropsWithoutRef<'a'> & { href: string };
type NativeButtonProps = ButtonStyleProps & ComponentPropsWithoutRef<'button'> & { href?: never };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'green', size = 'md', icon, className, children, ...rest } = props;
  const classes = cn('button', `button--${variant}`, `button--${size}`, className);
  const content = (
    <>
      {children}
      {icon && <Icon name={icon} size={18} />}
    </>
  );

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<'a'> & { href: string };
    const Anchor = href.startsWith('/') ? Link : 'a';

    return (
      <Anchor href={href} className={classes} {...anchorProps}>
        {content}
      </Anchor>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {content}
    </button>
  );
}
