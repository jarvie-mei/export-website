import { blueprint, content, pageHref, productHref, site } from "@/lib/site-data";

export const dynamic = "force-static";

/**
 * Dynamic /llms.txt for GEO & AI search engines (ChatGPT, Claude, Perplexity, Google AI Mode).
 * Automatically generated from site/site.json and site/content-pack.json.
 */
export function GET() {
  const base = site.base_url.replace(/\/$/, "");
  const c = content.company;

  const lines: string[] = [
    `# ${c.name_en} (${c.name_zh})`,
    "",
    `> ${c.tagline_en}`,
    "",
    "## Company Overview",
    "",
    c.about_en,
    "",
    ...Object.entries({
      Founded: c.founded,
      "Team size": c.employees,
      Address: c.address_en,
      Email: c.email,
      Phone: c.phone,
      WhatsApp: c.whatsapp,
    }).filter(([, value]) => value).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Key Pages",
    "",
    ...blueprint.pages.map((page) => `- [${page.label_en}](${base}/en${pageHref(page.id)})`),
    `- [中文首页](${base}/zh)`,
    "",
    "## Featured Products",
    "",
    ...content.products.map((p) => {
      const url = `${base}/en${productHref(p.id)}`;
      const moq = p.moq ? ` | MOQ: ${p.moq}` : "";
      const model = p.model ? ` (${p.model})` : "";
      return `- [${p.name_en}${model}](${url})${moq}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
