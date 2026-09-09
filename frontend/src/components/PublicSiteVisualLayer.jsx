import { createPortal } from "react-dom";
import DotFieldCanvas from "./DotFieldCanvas";

export default function PublicSiteVisualLayer() {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="public-site-visual-layer" aria-hidden="true">
      <DotFieldCanvas variant="global" />
      <div className="public-site-visual-layer__veil" />
    </div>,
    document.body
  );
}
