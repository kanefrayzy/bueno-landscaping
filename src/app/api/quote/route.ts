import { site } from '@/config/site';
import { honeypotField, validateQuote, type QuoteData } from '@/lib/quote';

// TODO: once the domain is verified in Resend, set RESEND_FROM_EMAIL to an address on that domain.
const defaultFrom = `${site.name} Website <onboarding@resend.dev>`;

function buildEmail(data: QuoteData) {
  return [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || 'not provided'}`,
    `Town: ${data.town}`,
    `Service: ${data.service}`,
    '',
    'Message:',
    data.message || 'No message',
  ].join('\n');
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof body[honeypotField] === 'string' && body[honeypotField]) {
    return Response.json({ ok: true });
  }

  const { data, errors, valid } = validateQuote(body);
  if (!valid) return Response.json({ errors }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Quote form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.');
    return Response.json({ error: 'Email is not configured.' }, { status: 500 });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? defaultFrom,
      to: to.split(',').map((address) => address.trim()),
      reply_to: data.email || undefined,
      subject: `Estimate request: ${data.service} in ${data.town}`,
      text: buildEmail(data),
    }),
  });

  if (!response.ok) {
    console.error('Quote form: Resend error', response.status, await response.text());
    return Response.json({ error: 'Could not send the request.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
