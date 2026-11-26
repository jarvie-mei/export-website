import { z } from "zod";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categoryNode = z.object({
  id: z.string(),
  name: z.string(),
  href: z.string(),
  image: z.string().optional(),
});

export const categoryNavSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  categories: z.array(
    categoryNode.extend({ children: z.array(categoryNode).default([]) })
  ),
});
export type CategoryNavProps = z.infer<typeof categoryNavSchema>;

// 类目导航（两级封顶）：也用于"行业应用"式导航网格（对标站常见）。
// 有图 → 图块网格；无图 → 索引行版式（工程目录页样式）。
export function CategoryNav({
  heading,
  lead,
  headingAlign,
  categories,
}: CategoryNavProps) {
  const withImages = categories.some((c) => c.image);

  return (
    <nav aria-label={heading} data-section="category_nav" className="border-b border-line bg-surface">
      <div className={`container-site py-7 sm:py-9 ${headingAlign === "center" ? "text-center" : ""}`}>
        {withImages && heading ? (
          <SectionHeading title={heading} lead={lead} align={headingAlign} />
        ) : (
          <>
            {heading && <h2 className="text-base font-semibold text-primary">{heading}</h2>}
            {lead && <p className="mt-2 text-muted">{lead}</p>}
          </>
        )}
        <ul className={withImages
          ? "mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
          : `mt-3 flex flex-wrap gap-2 ${headingAlign === "center" ? "justify-center" : ""}`
        }>
          {categories.map((c) => (
            <li key={c.id} className="min-w-0 max-w-full">
              <Link
                href={c.href}
                className={withImages
                  ? "group block text-base font-semibold text-ink hover:text-primary"
                  : "inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-bg px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
                }
              >
                {withImages && (
                  <span className="relative mb-3 block aspect-square overflow-hidden rounded-(--radius) border border-line bg-white">
                    {c.image && <Image src={c.image} alt="" fill sizes="(max-width: 640px) 50vw, 22vw" className="object-contain" />}
                  </span>
                )}
                {c.name}
              </Link>
              {c.children.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {c.children.map((ch) => (
                    <li key={ch.id}>
                      <Link href={ch.href} className="text-sm text-muted underline underline-offset-4 hover:text-primary">
                        {ch.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
