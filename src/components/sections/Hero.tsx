import { z } from "zod";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export const heroSchema = z.object({
  // 版式变体：editorial = 左对齐钢印（自有语言默认）；centered = 居中大图白字（对标站常见版式）
  variant: z.enum(["editorial", "centered", "split"]).default("editorial"),
  companyName: z.string().optional(),
  caption: z.string().optional(),
  headline: z.string(),
  subline: z.string().optional(),
  ctas: z.array(z.object({ label: z.string(), href: z.string() })).max(2),
  image: z.string(),
  imageAlt: z.string().default(""),
  // 图纸标题栏徽章：ISO 编号 / Since 年份 / 认证名，数据化的信任元素（editorial 版式专属）
  badges: z.array(z.string()).max(4).default([]),
});
export type HeroProps = z.infer<typeof heroSchema>;

// 首屏。LCP 元素：背景图 priority preload；深底子树语义色自动翻转。
export function Hero({ variant, companyName, caption, headline, subline, ctas, image, imageAlt, badges }: HeroProps) {
  if (variant === "split") {
    return (
      <section data-section="hero" className="border-b border-line bg-surface">
        <div className="container-site grid items-center gap-7 pt-10 pb-6 sm:gap-10 sm:pt-14 sm:pb-9 lg:grid-cols-[minmax(0,0.87fr)_minmax(0,1.13fr)] lg:gap-[clamp(2rem,4vw,5rem)] lg:py-[clamp(3rem,5vw,5rem)]">
          <div className="anim-rise">
            {companyName && (
              <p className="mb-5 flex items-center gap-3 text-sm font-semibold tracking-wide text-primary">
                <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent" />
                {companyName}
              </p>
            )}
            <h1
              className="whitespace-pre-line text-[clamp(2.55rem,5.1vw,5rem)] leading-[1.12] font-medium tracking-[-0.045em] text-primary"
              style={{ fontFamily: "var(--display-family)" }}
            >
              {headline}
            </h1>
            {subline && <p className="mt-5 max-w-[36ch] text-base leading-[1.8] text-muted sm:mt-7 sm:text-lg">{subline}</p>}
            {ctas.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
                {ctas.map((cta, i) => (
                  <ButtonLink key={cta.href} href={cta.href} variant={i === 0 ? "primary" : "outline"}>
                    {cta.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>
          <figure className="anim-rise-late min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-(--radius) bg-surface-2">
              <Image src={image} alt={imageAlt} fill preload sizes="(min-width: 1280px) 44rem, (min-width: 1024px) 56vw, 96vw" className="object-cover" />
            </div>
            {caption && (
              <figcaption className="mt-3 flex items-center gap-3 text-sm leading-relaxed text-muted">
                <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent" />
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      </section>
    );
  }
  if (variant === "centered") {
    return (
      <section data-section="hero" className="tone-dark relative isolate flex min-h-[min(72svh,44rem)] flex-col items-center justify-center overflow-hidden bg-bg">
        <Image src={image} alt={imageAlt} fill priority quality={50} sizes="100vw" className="object-cover" />
        {/* 遮罩带品牌色相（--hero-scrim 由 theme 生成）：贴近目标站"品牌色调蒙版大图"的常见处理 */}
        <div aria-hidden="true" className="absolute inset-0 bg-(--hero-scrim,black)/65" />
        <div className="container-site relative w-full py-24 text-center">
          <h1 className="type-display anim-rise mx-auto max-w-4xl text-[clamp(2.4rem,1.8rem+2.8vw,4rem)] text-white">
            {headline}
          </h1>
          {subline && (
            <p className="anim-rise-late mx-auto mt-6 max-w-2xl text-lg text-white/90">{subline}</p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-9 flex flex-wrap justify-center gap-4">
              {ctas.map((cta, i) => (
                <ButtonLink key={cta.href} href={cta.href} variant={i === 0 ? "primary" : "inverse"}>
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section data-section="hero" className="tone-dark relative isolate flex min-h-[min(82svh,52rem)] flex-col justify-end overflow-hidden bg-bg">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        quality={50}
        sizes="100vw"
        className="object-cover"
      />
      {/* 左向 scrim 保证标题对比度（≥4.5:1 由深底渐变承担） */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black/78 via-black/55 to-black/15"
      />

      <div className="container-site relative w-full pt-40 pb-14">
        <div className="max-w-3xl">
          <h1 className="type-display anim-rise text-white">{headline}</h1>
          {subline && (
            <p className="anim-rise-late mt-6 max-w-xl text-lg text-white/85">
              {subline}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-9 flex flex-wrap gap-4">
              {ctas.map((cta, i) => (
                <ButtonLink
                  key={cta.href}
                  href={cta.href}
                  variant={i === 0 ? "primary" : "inverse"}
                >
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>

        {/* 图纸标题栏：唯一的角部签名件 */}
        {badges.length > 0 && (
          <div className="mt-14 border-t border-white/25">
            <ul className="grid grid-cols-2 gap-x-8 md:flex md:flex-wrap md:gap-x-0">
              {badges.map((b, i) => (
                <li
                  key={b}
                  className={`py-3 pr-8 md:border-white/25 md:pl-8 ${i > 0 ? "md:border-l" : "md:pl-0"}`}
                >
                  <span className="type-label text-white/75">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
