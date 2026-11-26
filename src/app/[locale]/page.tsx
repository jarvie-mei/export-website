import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SitePage } from "@/components/SitePage";
import { content, pick, type Locale } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = content.hero ? pick(content.hero, "headline", l).replace(/\n/g, " ") : pick(content.company, "name", l);
  return buildMetadata({
    locale: l,
    path: "/",
    title,
    description: pick(content.company, "tagline", l) || undefined,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SitePage pageId="home" locale={locale as Locale} />;
}
