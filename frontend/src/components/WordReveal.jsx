import RevealGroup from "./RevealGroup";

/**
 * One-shot word stagger on IO (desktop). Static on mobile via RevealGroup mobileStatic.
 */
export default function WordReveal({ text, className = "", wordClassName = "" }) {
  const words = text.trim().split(/\s+/);

  return (
    <RevealGroup
      as="span"
      className={`word-reveal ${className}`.trim()}
      mobileStatic
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={`reveal-item word-reveal-word ${wordClassName}`.trim()}
          style={{ "--index": index }}
        >
          {word}
        </span>
      ))}
    </RevealGroup>
  );
}
