import RevealGroup from "./RevealGroup";

/**
 * Line-by-line masked upward reveal. Each line is clipped by overflow-hidden on the row.
 */
export default function LineReveal({
  lines,
  className = "",
  lineClassName = "",
  as: Tag = "div",
  immediate = false,
}) {
  const isHeading = /^h[1-6]$/.test(Tag);
  const RowTag = isHeading ? "span" : "div";

  return (
    <RevealGroup
      as={Tag}
      className={`line-reveal-group ${className}`.trim()}
      immediate={immediate}
    >
      {lines.map((line, index) => (
        <RowTag key={`${line}-${index}`} className="line-reveal-row">
          <span
            className={`reveal-item line-reveal-inner ${lineClassName}`.trim()}
            style={{ "--index": index }}
          >
            {line}
          </span>
        </RowTag>
      ))}
    </RevealGroup>
  );
}
