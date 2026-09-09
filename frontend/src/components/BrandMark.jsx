const sizeClass = {
  nav: "h-8 sm:h-10 w-auto max-w-[9rem] sm:max-w-none",
  hero: "h-14 sm:h-16 md:h-20 w-auto mx-auto",
  home: "h-[5.25rem] sm:h-24 md:h-[7.5rem] w-auto mx-auto",
};

const BrandMark = ({ size = "nav", className = "" }) => (
  <img
    src="/adroit-ctf-logo.png"
    alt="AdroIT"
    className={`block object-contain drop-shadow-[0_0_18px_rgba(34,211,236,0.35)] ${sizeClass[size] || sizeClass.nav} ${className}`.trim()}
  />
);

export default BrandMark;
