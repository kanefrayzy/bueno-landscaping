'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { serviceAreas } from '@/config/service-areas';
import { serviceOptions } from '@/config/services';
import { site } from '@/config/site';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { honeypotField, validateQuote, type QuoteErrors, type QuoteField } from '@/lib/quote';

type Status = 'idle' | 'sending' | 'success' | 'error';

type FieldProps = {
  name: QuoteField;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
};

function Field({ name, label, error, optional, className, children }: FieldProps) {
  const id = `quote-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className={cn('quote-form__field', className)}>
      <label className="quote-form__label" htmlFor={id}>
        {label}
        {optional && <span className="quote-form__optional"> (optional)</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="quote-form__error">
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteForm({ defaultService = '' }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<QuoteErrors>({});
  const started = useRef(false);

  function handleStart() {
    if (started.current) return;
    started.current = true;
    track('form_start', { form_id: 'quote' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const result = validateQuote(values);

    setErrors(result.errors);
    if (!result.valid) {
      const firstInvalid = Object.keys(result.errors)[0];
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 400 && body.errors) {
        setErrors(body.errors);
        setStatus('idle');
        return;
      }
      if (!response.ok) throw new Error(body.error ?? 'Request failed');

      track('quote_submit', { service: result.data.service, form_id: 'quote' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="quote-form quote-form--done" role="status">
        <p className="quote-form__done-title">Thanks, we got your request.</p>
        <p>
          We’ll get back to you to set up your free estimate. If you need us sooner, call{' '}
          <a href={site.phone.href} data-track="quote_success">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="quote-form" noValidate onSubmit={handleSubmit} onInput={handleStart} onChange={handleStart}>
      <div className="quote-form__grid">
        <Field name="name" label="Name" error={errors.name}>
          {(props) => <input {...props} className="quote-form__control" name="name" autoComplete="name" maxLength={80} required />}
        </Field>
        <Field name="phone" label="Phone" error={errors.phone}>
          {(props) => (
            <input {...props} className="quote-form__control" name="phone" type="tel" autoComplete="tel" maxLength={25} required />
          )}
        </Field>
        <Field name="email" label="Email" optional error={errors.email}>
          {(props) => <input {...props} className="quote-form__control" name="email" type="email" autoComplete="email" maxLength={120} />}
        </Field>
        <Field name="town" label="Town" error={errors.town}>
          {(props) => (
            <>
              <input
                {...props}
                className="quote-form__control"
                name="town"
                list="quote-towns"
                autoComplete="address-level2"
                maxLength={60}
                required
              />
              <datalist id="quote-towns">
                {serviceAreas.map((town) => (
                  <option key={town} value={town} />
                ))}
              </datalist>
            </>
          )}
        </Field>
        <Field name="service" label="Service" error={errors.service} className="quote-form__field--wide">
          {(props) => (
            <select {...props} className="quote-form__control" name="service" defaultValue={defaultService} required>
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          )}
        </Field>
        <Field name="message" label="Tell us about the job" optional error={errors.message} className="quote-form__field--wide">
          {(props) => <textarea {...props} className="quote-form__control" name="message" rows={4} maxLength={2000} />}
        </Field>
      </div>

      {/* Spam trap: off screen, hidden from screen readers, skipped by Tab, and without text, so it never shows up in a text-only view either. Bots fill it; people never see it. */}
      <div className="quote-form__trap" aria-hidden="true">
        <input name={honeypotField} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {status === 'error' && (
        <p className="quote-form__alert" role="alert">
          Sorry, your request didn’t go through. Please try again, or call or text us at{' '}
          <a href={site.phone.href} data-track="quote_error">
            {site.phone.display}
          </a>
          .
        </p>
      )}

      <Button type="submit" icon="arrow" className="quote-form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Request a Free Estimate'}
      </Button>
    </form>
  );
}
