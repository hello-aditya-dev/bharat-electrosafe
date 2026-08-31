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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  contactSchema,
  enquiryTypeLabels,
  groupedProductOptions,
  productLabelFromValue,
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
  /* True briefly after the Operating Voltage field is auto-prefilled from a
     ?class= link (IEC class selector / domestic class selector), giving the
     user a visual cue about where the value came from. */
  const [voltageHighlighted, setVoltageHighlighted] = useState(false);

  /* Read query params on first client render so the form starts with the
     prefilled values. This avoids effect-timing issues with the controlled
     Radix Select, which needs the value present on the initial render. */
  const prefilled =
    typeof window !== 'undefined'
      ? readContactPrefillFromUrl()
      : { enquiryType: undefined, product: undefined, message: '', voltage: '' };

  /* Mirror state for the two Radix Select fields.

     WHY: react-hook-form prunes values of fields that have no registered
     native input — enquiryType / product are Radix Selects with no native
     input, so a setValue() performed after a client-side navigation was
     silently wiped before submit ("Please select an enquiry type"), even
     though the quote block rendered correctly. These mirrors own the UI
     (Select value + quote block visibility), while hidden registered
     inputs below keep the values alive in RHF for validation/submission. */
  const [enquiryTypeState, setEnquiryTypeState] = useState<EnquiryType | undefined>(
    prefilled.enquiryType,
  );
  const [productState, setProductState] = useState<ProductValue | ''>(
    prefilled.product ?? '',
  );

  const {
    register,
    handleSubmit,
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
      voltage: prefilled.voltage,
      dimensions: '',
      quantity: '',
      deliveryLocation: '',
      website: '', // honeypot
    },
  });

  const isQuoteRequest = enquiryTypeState === 'quote';

  /* URL-prefill sync — fixes the client-side navigation timing hole.

     During a <Link> navigation to /contact-us, this component's first
     render(s) can execute BEFORE the router commits the new URL to
     history, so the render-time `prefilled` above (and useForm's
     defaultValues, which are applied only on the first render) can read
     a stale or empty query string. That left enquiryType / product /
     voltage silently un-prefilled for every product CTA reached via
     client-side navigation.

     This effect re-reads the URL after every render but only acts when
     the prefill-relevant params (type | product | class | message)
     actually CHANGED since the last sync. Renders before the URL commit
     see an unchanged key; the render after the commit sees a new key and
     applies the prefill. Params absent from the URL never overwrite
     anything, and a bare /contact-us never wipes user-entered data.
     It also covers same-route param changes (contact → contact with a
     different ?product=), where React does not remount the page. */
  const lastPrefillKeyRef = useRef<string>('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = [
      params.get('type') ?? '',
      params.get('product') ?? '',
      params.get('class') ?? '',
      params.get('message') ?? '',
    ].join('|');
    if (key === lastPrefillKeyRef.current) return;
    lastPrefillKeyRef.current = key;
    if (key === '|||') return; // no prefill params — keep the current form

    const urlPrefill = readContactPrefillFromUrl();
    if (urlPrefill.enquiryType) {
      setEnquiryTypeState(urlPrefill.enquiryType);
      setValue('enquiryType', urlPrefill.enquiryType, { shouldValidate: true });
    }
    if (urlPrefill.product) {
      setProductState(urlPrefill.product);
      setValue('product', urlPrefill.product);
    }
    if (urlPrefill.voltage) {
      setValue('voltage', urlPrefill.voltage);
      setVoltageHighlighted(true);
    }
    if (urlPrefill.message) {
      setValue('message', urlPrefill.message, { shouldValidate: true });
    }
  });

  /* Clear the prefill highlight after a short pause so it reads as a
     transient cue, not a permanent state. */
  useEffect(() => {
    if (!voltageHighlighted) return;
    const t = setTimeout(() => setVoltageHighlighted(false), 2600);
    return () => clearTimeout(t);
  }, [voltageHighlighted]);

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
              setEnquiryTypeState(undefined);
              setProductState('');
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

        {/* Hidden registered inputs for the two Radix Select fields.
            Radix renders no native input for its Selects, and RHF prunes
            setValue data for unregistered fields — these keep enquiryType
            and product registered so prefilled/chosen values survive until
            submission. The visible Selects write through setValue (see
            onValueChange and the URL-prefill sync effect). */}
        <input type="hidden" {...register('enquiryType')} value={enquiryTypeState ?? ''} />
        <input type="hidden" {...register('product')} value={productState} />

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
              value={enquiryTypeState}
              onValueChange={(val) => {
                /* Radix Select keeps a hidden native <select> whose options
                   only exist once the dropdown has opened. Setting a value
                   that the empty option list cannot match makes the browser
                   reset the native select to "" and fire change — which
                   Radix forwards here as an empty onValueChange. Ignoring
                   the empty value prevents that reset loop from wiping a
                   prefilled selection (the visible label is rendered by
                   SelectValue children, not by the native select). */
                if (!val) return;
                setEnquiryTypeState(val as EnquiryType);
                setValue('enquiryType', val as EnquiryType, { shouldValidate: true });
              }}
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
                {/* Label text rendered directly (instead of relying on Radix's
                    item registry, which is empty until the dropdown opens) so
                    a prefilled value always displays its label. */}
                <SelectValue placeholder="Select enquiry type">
                  {enquiryTypeState
                    ? enquiryTypeLabels.find((t) => t.value === enquiryTypeState)?.label
                    : undefined}
                </SelectValue>
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
              value={productState || undefined}
              onValueChange={(val) => {
                /* Same empty-value guard as the enquiry type select above. */
                if (!val) return;
                setProductState(val as ProductValue);
                setValue('product', val);
              }}
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
                {/* Same registry-independent label rendering as enquiryType. */}
                <SelectValue placeholder="Select a product">
                  {productState ? productLabelFromValue(productState) : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {groupedProductOptions().map(({ group, options }) => (
                  <SelectGroup key={group}>
                    <SelectLabel className="text-xs font-semibold uppercase tracking-wide text-be-grey-650">
                      {group}
                    </SelectLabel>
                    {options.map((product) => (
                      <SelectItem key={product.value} value={product.value}>
                        {product.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="voltage" className="text-sm font-medium text-be-charcoal-800">
                    Operating Voltage
                  </label>
                  {voltageHighlighted && (
                    <span
                      id="voltage-prefilled-note"
                      className="text-metadata text-be-yellow-text animate-in fade-in-0 duration-500"
                    >
                      Auto-filled from class selection
                    </span>
                  )}
                </div>
                <input
                  id="voltage"
                  type="text"
                  {...register('voltage')}
                  disabled={isSubmitting}
                  aria-describedby={voltageHighlighted ? 'voltage-prefilled-note' : undefined}
                  className={cn(
                    fieldBaseClass,
                    isSubmitting && fieldDisabledClass,
                    voltageHighlighted &&
                      'border-be-yellow-500 ring-2 ring-be-yellow-500/40 transition-shadow duration-500'
                  )}
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
