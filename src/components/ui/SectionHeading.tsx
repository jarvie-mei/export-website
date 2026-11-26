type Props = {
  title: string;
  lead?: string;
  /** 工程索引号，仅真实序列/编号语义时使用（如 sheet no.），默认无 */
  index?: string;
  align?: "start" | "center";
};

export function SectionHeading({ title, lead, index, align = "start" }: Props) {
  const centered = align === "center";
  return (
    <header
      className={`mb-7 max-w-2xl md:mb-10 ${centered ? "mx-auto text-center" : ""}`}
    >
      <h2 className="type-display-sm text-ink">
        {index && (
          <span className="type-figure mr-3 align-baseline text-[0.6em] text-primary">
            {index}
          </span>
        )}
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
    </header>
  );
}
