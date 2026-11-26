import { z } from "zod";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const contactBlockSchema = z.object({
  heading: z.string().optional(),
  whatsapp: z.string().optional(),
  wechat: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  mapImage: z.string().optional(), // 地图用静态图（性能），不用 iframe
});
export type ContactBlockProps = z.infer<typeof contactBlockSchema>;

export function ContactBlock({
  heading,
  whatsapp,
  wechat,
  email,
  phone,
  address,
  mapImage,
}: ContactBlockProps) {
  const t = useTranslations("contact");
  const waNumber = whatsapp?.replace(/[^\d]/g, "");

  const contacts = [
    phone && { label: t("phone"), value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    wechat && { label: t("wechat"), value: wechat },
    email && { label: t("email"), value: email, href: `mailto:${email}` },
    waNumber && { label: "WhatsApp", value: `+${waNumber}`, href: `https://wa.me/${waNumber}` },
  ];

  return (
    <section data-section="contact_block" className="section-pad bg-bg">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-lg border border-line bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="tone-dark flex min-w-0 flex-col justify-between gap-10 bg-bg p-7 text-ink sm:p-10 lg:gap-20">
            {heading && <h2 className="type-display-sm max-w-[18ch] text-balance">{heading}</h2>}
            {address && (
              <div className="border-t border-line pt-5">
                <p className="text-sm text-muted">{t("address")}</p>
                <address className="mt-2 max-w-[38ch] select-all text-balance text-base leading-relaxed not-italic">{address}</address>
              </div>
            )}
          </div>
          <dl className="grid content-center divide-y divide-line bg-surface px-7 py-3 sm:px-10 sm:py-5">
            {contacts.map((contact) => contact && (
              <div key={contact.label} className="grid min-w-0 gap-1 py-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                <dt className="text-sm text-muted">{contact.label}</dt>
                <dd className="min-w-0 text-lg font-medium tracking-tight text-ink [overflow-wrap:anywhere]">
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                      {...(contact.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="select-all">{contact.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {mapImage && (
          <figure className="relative mt-6 min-h-72 overflow-hidden rounded-lg border border-line bg-surface">
            <Image
              src={mapImage}
              alt={t("mapAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        )}
      </div>
    </section>
  );
}
