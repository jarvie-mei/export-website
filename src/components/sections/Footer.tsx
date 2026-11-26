import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const footerSchema = z.object({
  // titleblock = 图纸标题栏框线网格（默认）；columns = 多栏链接（对标站常见版式）
  variant: z.enum(["titleblock", "columns"]).default("titleblock"),
  companyName: z.string(),
  tagline: z.string().optional(),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  certs: z.array(z.string()).default([]),
});
export type FooterProps = z.infer<typeof footerSchema>;

// 页脚 = 图纸标题栏（title block）：框线网格，公司 / 站点地图 / 联系 / 认证四格。
export function Footer({
  variant,
  companyName,
  tagline,
  nav,
  email,
  whatsapp,
  address,
  certs,
}: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  if (variant === "columns") {
    return (
      <footer data-section="footer" className="tone-dark border-t border-line bg-bg text-ink">
        <div className="container-site pt-12 pb-7 md:pt-16">
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(8rem,0.6fr)_minmax(0,1fr)] lg:gap-x-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="type-display-sm max-w-[18ch] text-balance">{companyName}</p>
              {tagline && <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-muted">{tagline}</p>}
            </div>
            <nav aria-label={t("sitemap")}>
              <p className="mb-4 border-b border-line pb-3 text-sm font-semibold text-muted">{t("sitemap")}</p>
              <ul className="space-y-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="inline-block py-0.5 text-base text-ink hover:text-primary-bright">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {(email || whatsapp || address) && <div>
              <p className="mb-4 border-b border-line pb-3 text-sm font-semibold text-muted">{t("contact")}</p>
              <ul className="space-y-3 text-base">
                {email && <li>
                  <a href={`mailto:${email}`} className="break-words text-ink underline decoration-line underline-offset-4 hover:text-primary-bright">
                    {email}
                  </a>
                </li>}
                {whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-ink underline decoration-line underline-offset-4 hover:text-primary-bright"
                    >
                      WhatsApp +{whatsapp.replace(/[^\d]/g, "")}
                    </a>
                  </li>
                )}
                {address && <li><address className="max-w-[35ch] text-balance text-muted not-italic">{address}</address></li>}
              </ul>
            </div>}
            {certs.length > 0 && <div>
              <p className="mb-4 border-b border-line pb-3 text-sm font-semibold text-muted">{t("compliance")}</p>
              <ul className="flex flex-wrap gap-2">
                {certs.map((c) => (
                  <li key={c} className="type-label border border-line px-2.5 py-1.5 text-ink/80">
                    {c}
                  </li>
                ))}
              </ul>
            </div>}
          </div>
          <div className="mt-12 border-t border-line pt-5 md:mt-16">
            <p className="text-xs text-muted">
              © {year} {companyName}. {t("rights")}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer data-section="footer" className="tone-dark bg-bg">
      <div className="container-site section-pad-tight">
        <div className="grid grid-cols-1 border border-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-line p-7 lg:border-b-0 lg:border-r">
            <p className="type-display-sm text-xl text-ink">{companyName}</p>
            {tagline && <p className="mt-3 text-sm text-muted">{tagline}</p>}
          </div>

          <nav aria-label={t("sitemap")} className="border-b border-line p-7 sm:border-l lg:border-b-0">
            <p className="type-label mb-4 text-muted">{t("sitemap")}</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-ink/90 hover:text-primary-bright">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-b border-line p-7 sm:border-b-0 lg:border-l">
            <p className="type-label mb-4 text-muted">{t("contact")}</p>
            <ul className="space-y-2 text-sm">
              {email && <li>
                <a href={`mailto:${email}`} className="text-ink/90 hover:text-primary-bright">
                  {email}
                </a>
              </li>}
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/90 hover:text-primary-bright"
                  >
                    WhatsApp +{whatsapp.replace(/[^\d]/g, "")}
                  </a>
                </li>
              )}
              {address && <li className="text-muted">{address}</li>}
            </ul>
          </div>

          <div className="p-7 sm:border-l">
            <p className="type-label mb-4 text-muted">{t("compliance")}</p>
            {certs.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {certs.map((c) => (
                  <li key={c} className="type-label border border-line px-2.5 py-1.5 text-ink/80">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">—</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs text-muted">
            © {year} {companyName}. {t("rights")}
          </p>
          <p className="type-label text-muted">{t("docNo", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
