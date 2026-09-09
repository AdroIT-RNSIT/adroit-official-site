import { useEffect, useRef } from "react";
import { observeReveal } from "../lib/revealObserver";

export default function RevealGroup({
  as: Tag = "div",
  className = "",
  immediate = false,
  mobileStatic = false,
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

    if (mobileStatic && window.matchMedia("(max-width: 767px)").matches) {
      el.classList.add("is-visible");
      return;
    }

    return observeReveal(el, () => el.classList.add("is-visible"));
  }, [immediate, mobileStatic]);

  const classes = [
    "reveal-group",
    immediate ? "is-visible" : "",
    mobileStatic ? "reveal-mobile-static" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} {...props}>
      {children}
    </Tag>
  );
}
