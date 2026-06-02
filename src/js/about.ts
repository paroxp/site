((): void => {
  assure('[data-details] summary', (element: Element) => {
    element.addEventListener('click', e => {
      if ((e.target as Element).tagName.toLowerCase() !== 'a') {
        e.preventDefault();

        toggleClass(element.parentNode as Element, 'active');
      }
    });
  });

  assure('[data-skills] li', (element: Element) => {
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
