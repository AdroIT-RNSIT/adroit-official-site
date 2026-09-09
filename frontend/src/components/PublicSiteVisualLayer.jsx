import DotFieldCanvas from "./DotFieldCanvas";

export default function PublicSiteVisualLayer() {
  return (
    <div className="public-site-visual-layer" aria-hidden="true">
      <DotFieldCanvas variant="global" />
      <div className="public-site-visual-layer__veil" />
    </div>
  );
}
