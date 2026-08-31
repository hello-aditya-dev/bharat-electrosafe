'use client';

import { useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  eyebrow?: string;
  supportingText?: string;
  className?: string;
}

export function FAQ({
  items,
  title,
  eyebrow,
  supportingText,
  className,
}: FAQProps) {
  const staggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!staggerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(staggerRef.current);
    return () => observer.disconnect();
  }, []);

  const showHeader = Boolean(title || eyebrow);

  return (
    <div className={cn('w-full', className)}>
      {showHeader && (
        <div className="reveal-up mb-6 max-w-2xl">
          <SectionHeader
            eyebrow={eyebrow}
            title={title ?? ''}
            supportingText={supportingText}
            align="left"
          />
        </div>
      )}

      <div ref={staggerRef} className="stagger-reveal print:hidden">
        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-4"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="group relative overflow-hidden border border-be-grey-250 last:border-b rounded-lg bg-be-warm-white px-5 pl-6 transition-colors duration-200 hover:border-be-yellow-400 data-[state=open]:bg-be-yellow-50/60 data-[state=open]:border-be-yellow-400"
            >
              {/* Thin yellow accent on the left edge of the open item */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-[3px] bg-be-brand-yellow opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100"
              />
              <AccordionTrigger className="hover:no-underline py-4 [&>svg:last-child]:hidden">
                <span className="text-[1.05rem] sm:text-card-title font-semibold text-be-charcoal-950 text-left flex-1 pr-4 leading-snug">
                  {item.question}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-be-yellow-50 text-be-yellow-text border border-be-yellow-100 transition-all duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-be-yellow-500 group-data-[state=open]:text-be-charcoal-950 group-data-[state=open]:border-be-yellow-500" aria-hidden="true">
                  <Plus className="h-4 w-4" focusable="false" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-body text-be-grey-650 leading-relaxed pb-4 pr-4 sm:pr-8 max-w-[60ch]">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Print-only flat Q&A list — Radix unmounts closed answers, so the
          interactive accordion cannot print its hidden content. The paper
          output therefore gets a static full list from the same `items`
          data (screen layout is untouched). */}
      <div className="hidden print:block">
        <dl className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="break-inside-avoid">
              <dt className="text-sm font-semibold text-be-charcoal-950">{item.question}</dt>
              <dd className="text-sm text-be-charcoal-800 mt-1 leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default FAQ;
