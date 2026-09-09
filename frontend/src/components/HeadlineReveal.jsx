import Reveal from "./Reveal";
import LineReveal from "./LineReveal";

/**
 * Dramatic section headline — single block or line-by-line masked reveal.
 */
export default function HeadlineReveal({
  className = "",
  lines,
  children,
  immediate = false,
  ...props
}) {
  if (lines?.length) {
    return (
      <LineReveal
        lines={lines}
        lineClassName={`headline-line ${className}`.trim()}
        immediate={immediate}
        {...props}
      />
    );
  }

  return (
    <Reveal
      className={`headline-reveal reveal-mask ${className}`.trim()}
      immediate={immediate}
      {...props}
    >
      {children}
    </Reveal>
  );
}
