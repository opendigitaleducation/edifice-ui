export const refScrollTo = () => {
  const refToTop = document.querySelector("html");

  const scrollToTop = () => {
    refToTop && refToTop.scrollIntoView();
  };
  return scrollToTop;
};
