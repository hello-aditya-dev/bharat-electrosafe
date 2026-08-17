'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { company } from '@/data/company';
import { Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  contactSchema,
  enquiryTypeLabels,
  productOptions,
  readContactPrefillFromUrl,
  type ContactInput,
  type EnquiryType,
  type ProductValue,
} from '@/lib/contact-schema';

/* ────────────────────────────────────────────
   Shared input class names — every text/select
   field uses identical height (44px) + width.
   ──────────────────────────────────────────── */

const fieldBaseClass =
  'h-11 w-full rounded-lg border bg-be-white px-4 text-base outline-none transition-colors ' +
  'border-be-grey-250 focus:border-be-yellow-500 focus:ring-2 focus:ring-be-yellow-500/20';

const fieldErrorClass = 'border-red-400 focus:border-red-400 focus:ring-red-400/20';
const fieldDisabledClass = 'opacity-60 cursor-not-allowed';

/* ────────────────────────────────────────────
   EnquiryQuoteLayout component
   Pure form — rendered in the right column of
   Chapter 1. Submission behaviour, validation,
   URL-prefill and honeypot are unchanged.

   Schema is imported from src/lib/contact-schema.ts
   so the frontend and API share one contract.
   ──────────────────────────────────────────── */

export default function EnquiryQuoteLayout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [fallback, setFallback] = useState<{
    phone: string;
    phoneTel: string;
    email: string;
  } | null>(null);
  const formOpenAtRef = useRef<string>(String(Date.now()));

  /* Read query params on first client render so the form starts with the
     prefilled values. This avoids effect-timing issues with the controlled
     Radix Select, which needs the value present on the initial render. */
  const prefilled =
    typeof window !== 'undefined'
      ? readContactPrefillFromUrl()
      : { enquiryType: undefined, product: undefined, message: '' };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      enquiryType: prefilled.enquiryType,
      product: prefilled.product ?? '',
      message: prefilled.message,
      voltage: '',
      dimensions: '',
      quantity: '',
      deliveryLocation: '',
      website: '', // honeypot
    },
  });

  const enquiryType = watch('enquiryType');
  const isQuoteRequest = enquiryType === 'quote';

  /* If the prefilled message was loaded, keep it in sync in case the user
     navigates again. The enquiry type + product are already set via
     defaultValues above. */
  useEffect(() => {
    if (prefilled.message) {
      setValue('message', prefilled.message, { shouldValidate: true });
    }
  }, [prefilled.message, setValue]);

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    setSubmitError(false);
    setFallback(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          _formOpenAt: formOpenAtRef.current,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 503 && json.fallback) {
        // Honest fallback — email delivery not configured or failed
        setSubmitError(true);
        setFallback({
          phone: json.fallback.phone || company.phonePrimary,
          phoneTel: json.fallback.phoneTel || company.phonePrimaryTel,
          email: json.fallback.email || company.email,
        });
      } else {
        setSubmitError(true);
        if (json.fallback) {
          setFallback({
            phone: json.fallback.phone || company.phonePrimary,
            phoneTel: json.fallback.phoneTel || company.phonePrimaryTel,
            email: json.fallback.email || company.email,
          });
        }
      }
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Success state — replaces just the form region, not the whole section,
     so the contact rows on the left column remain visible. */
  if (submitted) {
    return (
      <div className="reveal-up flex flex-col">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-enquiry-h2 text-be-charcoal-950">
            Send Us an Enquiry
          </h2>
          <p className="text-body-large text-be-grey-650">
            Fill in the form below and our team will review your enquiry and respond with the next steps.
          </p>
        </div>
        <div className="max-w-xl rounded-lg border border-be-grey-250 bg-be-cream p-8 text-center flex flex-col items-center gap-4">
          <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="size-7 text-green-600" />
          </div>
          <h3 className="text-card-title text-be-charcoal-950">
            Thank you!
          </h3>
          <p className="text-body-large text-be-grey-650">
            Your enquiry has been submitted successfully.
          </p>
          <p className="text-body text-be-grey-650">
            Our team will review your enquiry and respond with the next steps. If urgent, feel free to call us directly.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <PrimaryButton onClick={() => {
              setSubmitted(false);
              reset();
            }}>
              Submit Another Enquiry
            </PrimaryButton>
            <SecondaryButton href={`tel:${company.phonePrimaryTel}`}>
              <Phone className="size-4 mr-1.5" />
              Call Us Now
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reveal-up flex flex-col">
      {/* Heading → supporting text → form spacing tightened */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-enquiry-h2 text-be-charcoal-950">
          Send Us an Enquiry
        </h2>
        <p className="text-body-large text-be-grey-650">
          Fill in the form below and our team will review your enquiry and respond with the next steps.
        </p>
      </div>

      {/* Inline error message */}
      {submitError && (
        <div
          className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-semibold">Something went wrong. Please try again or contact us directly.</p>
          <p className="text-body mt-1">
            You can reach us at{' '}
            <a className="underline" href={fallback ? `mailto:${fallback.email}` : `mailto:${company.email}`}>
              {fallback ? fallback.email : company.email}
            </a>{' '}
            or call{' '}
            <a className="underline" href={fallback ? `tel:${fallback.phoneTel}` : `tel:${company.phonePrimaryTel}`}>
              {fallback ? fallback.phone : company.phonePrimary}
            </a>
            .
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Honeypot field (hidden from users) */}
        <div className="sr-only" aria-hidden="true">
          <input type="text" {...register('website')} tabIndex={-1} autoComplete="off" />
        </div>

        {/* Row 1: Name | Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-be-charcoal-800">
              Name <span className="text-be-yellow-text" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              disabled={isSubmitting}
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={cn(
                fieldBaseClass,
                errors.name && fieldErrorClass,
                isSubmitting && fieldDisabledClass
              )}
              placeholder="Your full name"
            />
            {errors.name && (
              <span id="name-error" className="text-sm text-red-600" role="alert">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="companyName" className="text-sm font-medium text-be-charcoal-800">
              Company
            </label>
            <input
              id="companyName"
              type="text"
              {...register('companyName')}
              disabled={isSubmitting}
              autoComplete="organization"
              className={cn(fieldBaseClass, isSubmitting && fieldDisabledClass)}
              placeholder="Company name"
            />
          </div>
        </div>

        {/* Row 2: Email | Phone (both required) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-be-charcoal-800">
              Email <span className="text-be-yellow-text" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              disabled={isSubmitting}
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(
                fieldBaseClass,
                errors.email && fieldErrorClass,
                isSubmitting && fieldDisabledClass
              )}
              placeholder="you@yourcompany.in"
            />
            {errors.email && (
              <span id="email-error" className="text-sm text-red-600" role="alert">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-be-charcoal-800">
              Phone <span className="text-be-yellow-text" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              disabled={isSubmitting}
              autoComplete="tel"
              aria-required="true"
              aria-invalid={errors.phone ? 'true' : undefined}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={cn(
                fieldBaseClass,
                errors.phone && fieldErrorClass,
                isSubmitting && fieldDisabledClass
              )}
              placeholder="Your phone number"
            />
            {errors.phone && (
              <span id="phone-error" className="text-sm text-red-600" role="alert">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Row 3: Enquiry type | Product interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label id="enquiryType-label" htmlFor="enquiryType" className="text-sm font-medium text-be-charcoal-800">
              Enquiry Type <span className="text-be-yellow-text" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <Select
              value={enquiryType}
              onValueChange={(val) => setValue('enquiryType', val as EnquiryType, { shouldValidate: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="enquiryType"
                aria-labelledby="enquiryType-label"
                aria-describedby={errors.enquiryType ? 'enquiryType-error' : undefined}
                className={cn(
                  'h-11 w-full rounded-lg border bg-be-white text-base',
                  'border-be-grey-250 focus:border-be-yellow-500',
                  errors.enquiryType && 'border-red-400',
                  isSubmitting && fieldDisabledClass
                )}
              >
                <SelectValue placeholder="Select enquiry type" />
              </SelectTrigger>
              <SelectContent>
                {enquiryTypeLabels.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.enquiryType && (
              <span id="enquiryType-error" className="text-sm text-red-600" role="alert">{errors.enquiryType.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label id="product-label" htmlFor="product" className="text-sm font-medium text-be-charcoal-800">
              Product Interest
            </label>
            <Select
              value={watch('product')}
              onValueChange={(val) => setValue('product', val)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="product"
                aria-labelledby="product-label"
                className={cn(
                  'h-11 w-full rounded-lg border border-be-grey-250 bg-be-white text-base focus:border-be-yellow-500',
                  isSubmitting && fieldDisabledClass
                )}
              >
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((product) => (
                  <SelectItem key={product.value} value={product.value}>
                    {product.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 4: Message (full width) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-be-charcoal-800">
            Message <span className="text-be-yellow-text" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={4}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={cn(
              'w-full rounded-lg border bg-be-white px-4 py-3 text-base outline-none transition-colors min-h-[120px] resize-y',
              'border-be-grey-250 focus:border-be-yellow-500 focus:ring-2 focus:ring-be-yellow-500/20',
              errors.message && fieldErrorClass,
              isSubmitting && fieldDisabledClass
            )}
            placeholder="Describe your requirement in detail…"
          />
          {errors.message && (
            <span id="message-error" className="text-sm text-red-600" role="alert">{errors.message.message}</span>
          )}
        </div>

        {/* Conditional fields for Quote Request — pale-yellow contained group */}
        {isQuoteRequest && (
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-be-yellow-50 border border-be-yellow-100 animate-in fade-in-0 duration-300">
            <p className="text-sm font-semibold text-be-charcoal-950">
              Additional details for quotation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="voltage" className="text-sm font-medium text-be-charcoal-800">
                  Operating Voltage
                </label>
                <input
                  id="voltage"
                  type="text"
                  {...register('voltage')}
                  disabled={isSubmitting}
                  className={cn(fieldBaseClass, isSubmitting && fieldDisabledClass)}
                  placeholder="e.g. 11 kV"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="dimensions" className="text-sm font-medium text-be-charcoal-800">
                  Required Dimensions
                </label>
                <input
                  id="dimensions"
                  type="text"
                  {...register('dimensions')}
                  disabled={isSubmitting}
                  className={cn(fieldBaseClass, isSubmitting && fieldDisabledClass)}
                  placeholder="e.g. 1000mm × 2000mm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="quantity" className="text-sm font-medium text-be-charcoal-800">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="text"
                  {...register('quantity')}
                  disabled={isSubmitting}
                  className={cn(fieldBaseClass, isSubmitting && fieldDisabledClass)}
                  placeholder="e.g. 25 mats"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="deliveryLocation" className="text-sm font-medium text-be-charcoal-800">
                  Delivery Location
                </label>
                <input
                  id="deliveryLocation"
                  type="text"
                  {...register('deliveryLocation')}
                  disabled={isSubmitting}
                  className={cn(fieldBaseClass, isSubmitting && fieldDisabledClass)}
                  placeholder="City / Pin code"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit + response-time note + privacy reassurance */}
        <div className="flex flex-col gap-1.5 mt-1">
          <PrimaryButton
            type="submit"
            className={cn('w-full sm:w-auto', isSubmitting && 'opacity-70 pointer-events-none')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Sending…
              </span>
            ) : 'Send Enquiry'}
          </PrimaryButton>
          <p className="text-metadata text-be-grey-650">
            Our team will review your enquiry and respond with the next steps.
          </p>
          <p className="text-metadata text-be-grey-650">
            Your details are used only to respond to this enquiry.
          </p>
        </div>
      </form>
    </div>
  );
}
