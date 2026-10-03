((): void => {
  const details = document.querySelectorAll<HTMLDetailsElement>('[data-details]');

  // Sections are rendered open so they stay readable without JavaScript. Collapse them at the tablet breakpoint
  // (see $width in _variables.scss), where the toggle icons are shown.
  if (window.matchMedia('screen and (min-width: 48rem)').matches) {
    details.forEach(element => {
      element.open = false;
    });
  }

  window.addEventListener('beforeprint', () => {
    details.forEach(element => {
      element.open = true;
    });
  });

  assure('[data-skills] span', (element: Element) => {
    element.addEventListener('click', _e => element.classList.toggle('highlight'));
  });
})();

function assure(element: string, cb: (element: Element) => void): void {
  const elements = document.querySelectorAll(element);

  elements.forEach(cb);
}
