const sizeClass = {
  nav: "h-8 sm:h-10 w-auto max-w-[9rem] sm:max-w-none",
  hero: "h-20 sm:h-24 md:h-28 lg:h-32 w-auto mx-auto",
};

const BrandMark = ({ size = "nav", className = "" }) => (
  <img
    src="/adroit-ctf-logo.png"
    alt="AdroIT"
    className={`block object-contain drop-shadow-[0_0_14px_rgba(2,132,199,0.22)] ${sizeClass[size] || sizeClass.nav} ${className}`.trim()}
  />
);

export default BrandMark;
