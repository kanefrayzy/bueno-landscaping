import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Button } from './Button';

type ContactButtonsProps = {
  location: string;
  quoteHref?: string;
  variant?: 'light' | 'dark';
  className?: string;
};

export function ContactButtons({ location, quoteHref, variant = 'light', className }: ContactButtonsProps) {
  const primary = variant === 'dark' ? 'lime' : 'green';

  return (
    <div className={cn('contact-buttons', className)}>
      {quoteHref && (
        <Button href={quoteHref} variant={primary} icon="arrowUp">
          Get a Free Estimate
        </Button>
      )}
      <Button
        href={site.phone.href}
        variant={quoteHref ? 'outline' : primary}
        icon="phone"
        className={cn(variant === 'dark' && quoteHref && 'button--outline-light')}
        data-track={location}
      >
        Call {site.phone.display}
      </Button>
      <Button
        href={site.phone.sms}
        variant="outline"
        icon="message"
        className={cn('sms-only', variant === 'dark' && 'button--outline-light')}
        data-track={location}
      >
        Text us
      </Button>
    </div>
  );
}
