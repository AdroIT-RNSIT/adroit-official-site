import Reveal from "./Reveal";

/**
 * Dramatic one-shot headline entrance (scale + translate on desktop, lighter on mobile).
 */
export default function HeadlineReveal({
  className = "",
  mobileStatic = false,
  ...props
}) {
  return (
    <Reveal
      className={`headline-reveal ${className}`.trim()}
      mobileStatic={mobileStatic}
      {...props}
    />
  );
}
