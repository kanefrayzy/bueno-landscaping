import { serviceOptions } from '@/config/services';

export type QuoteData = {
  name: string;
  phone: string;
  email: string;
  town: string;
  service: string;
  message: string;
};

export type QuoteField = keyof QuoteData;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const honeypotField = 'website';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(input: Record<string, unknown>, field: string) {
  const value = input[field];
  return typeof value === 'string' ? value.trim() : '';
}

export function validateQuote(input: Record<string, unknown>) {
  const data: QuoteData = {
    name: text(input, 'name'),
    phone: text(input, 'phone'),
    email: text(input, 'email'),
    town: text(input, 'town'),
    service: text(input, 'service'),
    message: text(input, 'message'),
  };
  const errors: QuoteErrors = {};
  const phoneDigits = data.phone.replace(/\D/g, '');

  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Please enter your name.';
  if (phoneDigits.length < 10 || phoneDigits.length > 15) errors.phone = 'Please enter a phone number with area code.';
  if (data.email && (!emailPattern.test(data.email) || data.email.length > 120)) {
    errors.email = 'Please check your email address.';
  }
  if (data.town.length < 2 || data.town.length > 60) errors.town = 'Please enter your town.';
  if (!serviceOptions.includes(data.service)) errors.service = 'Please choose a service.';
  if (data.message.length > 2000) errors.message = 'Please keep the message under 2000 characters.';

  return { data, errors, valid: Object.keys(errors).length === 0 };
}
