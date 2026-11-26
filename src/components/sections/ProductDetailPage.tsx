import { z } from "zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";

export const productDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  model: z.string().optional(),
  images: z.array(z.string()).min(1),
  specs: z.array(z.tuple([z.string(), z.string()])),
  moq: z.string().optional(),
  // JSON-LD 与 CTA 上下文
  brandName: z.string().optional(),
  whatsapp: z.string().optional(),
  breadcrumbs: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});
export type ProductDetailProps = z.infer<typeof productDetailSchema>;

function ProductPhoto({ src, name, index }: { src: string; name: string; index: number }) {
  const t = useTranslations("product");
  const view = t("imageView", { name, number: index + 1 });
  const target = `pdp-photo-${index + 1}`;
  const isCover = index === 0;

  return (
    <>
      <button
        type="button"
        popoverTarget={target}
        aria-label={t("zoom", { view })}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-(--radius) border border-line bg-white transition-colors hover:border-primary/60"
      >
        <Image
          src={src}
          alt={view}
          fill
          preload={isCover}
          sizes={isCover ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 24vw, 9rem"}
          className="object-contain"
        />
      </button>
      <div
        id={target}
        popover="auto"
        role="dialog"
        aria-label={view}
        className="m-auto w-[min(94vw,52rem)] max-h-[96dvh] overflow-auto rounded-(--radius) border border-line bg-white p-2 shadow-lg backdrop:bg-black/75"
      >
        <div className="flex justify-end">
          <button
            type="button"
            autoFocus
            popoverTarget={target}
            popoverTargetAction="hide"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-3 font-semibold text-ink hover:bg-surface"
          >
            <span aria-hidden="true">×</span>
            {t("closeImage")}
          </button>
        </div>
        <button
          type="button"
          popoverTarget={target}
          popoverTargetAction="hide"
          aria-label={t("closeImage")}
          className="relative block aspect-square max-h-[calc(96dvh-4rem)] w-full cursor-zoom-out"
        >
          <Image src={src} alt={view} fill sizes="(max-width: 900px) 94vw, 52rem" className="object-contain" />
        </button>
      </div>
    </>
  );
}

// 产品详情页模板（页面级，不进 SECTION_COMPONENTS）：
// 图集（popover 放大）+ 规格表（签名件）+ JSON-LD Product。
export function ProductDetailPage({
  name,
  model,
  images,
  specs,
  moq,
  brandName,
  whatsapp,
  breadcrumbs,
}: ProductDetailProps) {
  const t = useTranslations("product");
  const [mainImage, ...thumbs] = images;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(model ? { mpn: model } : {}),
    ...(brandName ? { brand: { "@type": "Brand", name: brandName } } : {}),
    image: images,
    additionalProperty: specs.map(([k, v]) => ({
      "@type": "PropertyValue",
      name: k,
      value: v,
    })),
  };

  return (
    <article data-section="product_detail" className="bg-bg pt-6 pb-14 sm:pt-9 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-site">
        {breadcrumbs.length > 0 && (
          <nav aria-label={t("breadcrumb")} className="mb-7 border-b border-line pb-5 sm:mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {breadcrumbs.map((b) => (
                <li key={b.href} className="flex items-center gap-2 after:content-['/'] after:text-line">
                  <Link href={b.href} className="hover:text-primary">
                    {b.label}
                  </Link>
                </li>
              ))}
              <li aria-current="page" className="font-semibold text-ink">
                {name}
              </li>
            </ol>
          </nav>
        )}

        <div className="grid items-start gap-y-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14">
          <header className="min-w-0 lg:col-start-2 lg:row-start-1 lg:pt-4">
            <h1 className="type-display-sm text-primary">{name}</h1>
            {(model || moq) && (
              <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {model && <div className="flex gap-2"><dt className="text-muted">{t("model")}</dt><dd className="tabular font-semibold">{model}</dd></div>}
                {moq && <div className="flex gap-2"><dt className="text-muted">{t("moq")}</dt><dd className="tabular font-semibold">{moq}</dd></div>}
              </dl>
            )}
          </header>

          <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <ProductPhoto src={mainImage} name={name} index={0} />
            {thumbs.length > 0 && (
              <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
                {thumbs.map((src, index) => (
                  <li key={src}>
                    <ProductPhoto src={src} name={name} index={index + 1} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            {specs.length > 0 && (
              <table className="w-full border-y border-line text-left text-base">
                <caption className="mb-3 text-left text-lg font-semibold text-ink">{t("specs")}</caption>
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k} className="border-b border-line align-top last:border-b-0">
                      <th scope="row" className="w-1/3 py-4 pr-4 text-sm font-medium text-muted">{k}</th>
                      <td className="tabular py-4 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {whatsapp && (
              <div className="mt-9">
                <ButtonLink
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  variant="accent"
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("whatsapp")}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
