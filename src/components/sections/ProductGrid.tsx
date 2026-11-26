import { z } from "zod";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const productGridSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  // line = 白底细框（自有语言默认）；panel = 浅灰面板卡（对标站常见版式）
  cardStyle: z.enum(["line", "panel"]).default("line"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  groupedByCategory: z.boolean().default(false),
  categories: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .default([]),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      model: z.string().optional(),
      image: z.string(),
      href: z.string(),
      category: z.string().optional(),
    })
  ),
});
export type ProductGridProps = z.infer<typeof productGridSchema>;

type Product = ProductGridProps["products"][number];

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function ProductCard({
  p,
  cardStyle,
  columns,
  grouped,
}: {
  p: Product;
  cardStyle: ProductGridProps["cardStyle"];
  columns: ProductGridProps["columns"];
  grouped: boolean;
}) {
  const Title = grouped ? "h4" : "h3";
  const sizes = columns === 2
    ? "(max-width: 639px) 92vw, 50vw"
    : `(max-width: 1023px) 50vw, ${Math.ceil(100 / columns)}vw`;

  return (
    <Link href={p.href} className="group flex h-full min-w-0 flex-col">
      <div
        className={`relative aspect-square w-full rounded-(--radius) border border-line bg-white transition-colors group-hover:border-primary/50 ${cardStyle === "panel" ? "p-2 sm:p-3" : ""}`}
      >
        <div className="relative size-full">
          <Image src={p.image} alt="" fill sizes={sizes} className="object-contain" />
        </div>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-3 sm:py-4">
        <Title className="text-base font-semibold leading-snug tracking-tight text-ink group-hover:text-primary group-hover:underline group-hover:underline-offset-4 sm:text-lg">
          {p.name}
        </Title>
        {p.model && <span className="tabular text-sm text-muted">{p.model}</span>}
      </div>
    </Link>
  );
}

// 产品网格：2/3/4 列，按类目分组可选（组标题 = 两级类目的 L1）。
export function ProductGrid({
  heading,
  lead,
  headingAlign,
  cardStyle,
  columns,
  groupedByCategory,
  categories,
  products,
}: ProductGridProps) {
  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const groups = groupedByCategory
    ? [...new Set(products.map((p) => p.category ?? ""))].map((cat) => ({
        cat,
        items: products.filter((p) => (p.category ?? "") === cat),
      }))
    : [{ cat: "", items: products }];

  return (
    <section data-section="product_grid" className="section-pad bg-bg">
      <div className="container-site">
        {heading && (
          groupedByCategory ? (
            <header className={lead ? "mb-8" : "sr-only"}>
              <h2 className="type-display-sm">{heading}</h2>
              {lead && <p className="mt-3 text-muted">{lead}</p>}
            </header>
          ) : (
            <SectionHeading title={heading} lead={lead} align={headingAlign} />
          )
        )}
        <div className="space-y-14 sm:space-y-20">
          {groups.map(({ cat, items }) => (
            <div
              key={cat || "all"}
              id={groupedByCategory && cat ? `cat-${cat}` : undefined}
              className="scroll-mt-24"
            >
              {groupedByCategory && cat && (
                <div className="mb-5 flex items-baseline gap-3 border-t border-primary/40 pt-5 sm:mb-8">
                  <h3 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{catName(cat)}</h3>
                  <span className="tabular text-sm text-muted">
                    ({items.length})
                  </span>
                </div>
              )}
              <ul className={`grid gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 ${columns === 2 ? "grid-cols-1" : "grid-cols-2"} ${COLS[columns]}`}>
                {items.map((p) => (
                  <li key={p.id} className="min-w-0">
                    <ProductCard p={p} cardStyle={cardStyle} columns={columns} grouped={groupedByCategory && Boolean(cat)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
