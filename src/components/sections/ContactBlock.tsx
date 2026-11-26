import { z } from "zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    <section data-section="contact_block" className="section-pad-tight bg-bg">
      <div className={`container-site grid gap-10 ${mapImage ? "lg:grid-cols-2" : ""}`}>
        <div>
          {heading && <SectionHeading title={heading} />}
          <dl className={`grid gap-x-8 border-t border-line ${mapImage ? "" : "md:grid-cols-3"}`}>
            {contacts.map((contact) => contact && (
              <div key={contact.label} className="min-w-0 border-b border-line py-5">
                <dt className="text-sm font-medium text-muted">{contact.label}</dt>
                <dd className="mt-1 break-words text-lg font-semibold text-ink">
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-primary underline underline-offset-4 hover:text-ink"
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
            {address && (
              <div className="col-span-full border-b border-line py-5">
                <dt className="text-sm font-medium text-muted">{t("address")}</dt>
                <dd className="mt-1"><address className="not-italic">{address}</address></dd>
              </div>
            )}
          </dl>
        </div>

        {mapImage && (
          <figure className="relative min-h-72 overflow-hidden border border-line bg-surface lg:min-h-0">
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
