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
    element.addEventListener('click', _e => toggleClass(element, 'highlight'));
  });
})();

function assure(element: string, cb: (element: Element) => void): void {
  const elements = document.querySelectorAll(element);

  elements.forEach(cb);
}

function toggleClass(element: Element, className: string): void {
  if (element.classList) {
    element.classList.toggle(className);

    return;
  }

  const classes = element.className.split(' ');

  element.className = (classes.some(c => c === className)
    ? classes.filter(c => c !== className)
    : [...classes, className]
  ).join(' ');
}
