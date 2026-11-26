import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icons";
import { content, navPages, pick, type Locale } from "@/lib/site-data";

// 站点导航。移动端菜单 = 原生 Popover（零 JS）；语言切换 = 当前路径互换 locale。
// variant: bar = 单栏（默认）；topbar = 电话/邮箱顶栏 + 主导航栏（对标站常见版式）
export function SiteHeader({
  locale,
  path,
  variant = "bar",
}: {
  locale: Locale;
  path: string;
  variant?: "bar" | "topbar";
}) {
  const t = useTranslations("nav");
  const pages = navPages(locale);
  const companyName =
    pick(content.company, "short_name", locale) ||
    pick(content.company, "name", locale);
  const otherLocale = locale === "en" ? "zh" : "en";
  const { phone, email } = content.company;
  const showTopbar = variant === "topbar" && Boolean(phone || email);

  return (
    <header className="sticky top-0 z-(--z-nav) border-b border-line bg-bg/95 backdrop-blur-md">
      {showTopbar && (
        <div className="tone-dark bg-bg">
          <div className="container-site flex h-9 items-center justify-between gap-6 text-xs">
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-ink/85 hover:text-ink">
                {phone}
              </a>
            ) : (
              <span />
            )}
            {email && <a href={`mailto:${email}`} className="truncate text-ink/85 hover:text-ink">
              {email}
            </a>}
          </div>
        </div>
      )}
      <div className="container-site flex h-16 items-center gap-3 sm:h-20 sm:gap-6">
        <Link href="/" className="group mr-auto inline-flex min-w-0 items-center gap-2.5 text-primary sm:gap-3" aria-current={path === "/" ? "page" : undefined}>
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-tl-xl rounded-br-xl bg-primary text-on-primary sm:size-11">
            <Icon name="package" className="size-6" />
          </span>
          <span className="min-w-0 text-[clamp(0.95rem,2.5vw,1.33rem)] leading-tight font-semibold tracking-[0.045em] sm:truncate">
            {companyName}
          </span>
        </Link>

        <nav aria-label={locale === "zh" ? "主导航" : "Primary navigation"} className="hidden items-center gap-6 lg:flex xl:gap-8">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              aria-current={path === p.href ? "page" : undefined}
              className="border-b border-transparent py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:border-primary/35 hover:text-primary aria-[current=page]:border-primary aria-[current=page]:text-primary"
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3 lg:border-l lg:border-line lg:pl-6">
          <Link
            href={path}
            locale={otherLocale}
            lang={otherLocale}
            aria-label={otherLocale === "zh" ? "中文" : "English"}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-primary transition-colors hover:bg-surface sm:px-3"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            <Icon name="export" className="size-4" />
            {otherLocale === "zh" ? "中文" : "EN"}
          </Link>

          <button
            type="button"
            popoverTarget="mobile-nav"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-primary hover:bg-surface lg:hidden"
            aria-label={t("menu")}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" stroke="currentColor" strokeWidth="1.7" fill="none" aria-hidden="true">
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        popover="auto"
        className={`m-0 w-full max-w-none border-x-0 border-t-0 border-b border-line bg-bg text-ink backdrop:bg-black/40 ${showTopbar ? "mt-25 sm:mt-29" : "mt-16 sm:mt-20"}`}
      >
        <nav aria-label={t("menu")} className="container-site py-4">
          <ul>
            {pages.map((p) => (
              <li key={p.href} className="border-b border-line last:border-b-0">
                <Link href={p.href} aria-current={path === p.href ? "page" : undefined} className="block py-3 font-medium hover:text-primary aria-[current=page]:text-primary">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" popoverTarget="mobile-nav" popoverTargetAction="hide" className="mt-2 min-h-11 px-1 text-sm font-semibold text-primary">
            {t("close")}
          </button>
        </nav>
      </div>
    </header>
  );
}
