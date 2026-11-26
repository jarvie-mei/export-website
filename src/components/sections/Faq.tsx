import { z } from "zod";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const faqSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  items: z.array(z.object({ q: z.string(), a: z.string() })),
});
export type FaqProps = z.infer<typeof faqSchema>;

// 常见问题：<details> 零 JS 折叠 + JSON-LD FAQPage。
export function Faq({ heading, lead, items }: FaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section data-section="faq" className="section-pad bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-site grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(16rem,1fr)_2fr]">
        <div>
          {heading && <SectionHeading title={heading} lead={lead} />}
        </div>
        <div className="border-t border-line">
          {items.map((i) => (
            <details key={i.q} className="group border-b border-line open:bg-surface">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 px-4 py-6 text-base font-semibold sm:text-lg text-ink marker:content-none hover:text-primary [&::-webkit-details-marker]:hidden">
                {i.q}
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-primary transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-prose px-4 pb-6 leading-relaxed text-muted">{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
