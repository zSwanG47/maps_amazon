export function isMobileView() {
  return window.matchMedia("(max-width: 767px)").matches;
}
