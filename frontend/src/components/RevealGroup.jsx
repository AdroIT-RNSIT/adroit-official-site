import { useEffect, useRef } from "react";
import { observeReveal } from "../lib/revealObserver";

export default function RevealGroup({
  as: Tag = "div",
  className = "",
  immediate = false,
  children,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      el.classList.add("is-visible");
      return;
    }

    return observeReveal(el, () => el.classList.add("is-visible"));
  }, [immediate]);

  return (
    <Tag ref={ref} className={`reveal-group ${immediate ? "is-visible" : ""} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
