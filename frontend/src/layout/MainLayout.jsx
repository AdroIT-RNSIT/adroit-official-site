import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandIntro from "../components/BrandIntro";
import PublicSiteVisualLayer from "../components/PublicSiteVisualLayer";
import NetworkCursor from "../components/NetworkCursor";
import useLenis from "../hooks/useLenis";
import { isPublicSitePath } from "../lib/publicSite";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showMap = location.pathname === "/";
  const isPublicSite = isPublicSitePath(location.pathname);

  useEffect(() => {
    const root = document.documentElement;
    if (isPublicSite) {
      root.classList.add("site-public-network");
    } else {
      root.classList.remove("site-public-network");
    }
    return () => root.classList.remove("site-public-network");
  }, [isPublicSite]);

  useLenis();

  return (
    <div
      className={`min-h-dvh text-text-primary font-sans ${
        isPublicSite ? "site-layout--network" : "bg-bg-base"
      }`}
    >
      {showMap && <BrandIntro />}
      {isPublicSite && <PublicSiteVisualLayer />}
      <div className={`site-chrome ${showMap ? "home-page-reveal" : ""}`.trim()}>
        <Navbar />
        <main className="main-with-nav">{children}</main>
        <Footer showMap={showMap} />
      </div>
      {isPublicSite && <NetworkCursor />}
    </div>
  );
}
