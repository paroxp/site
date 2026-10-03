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

  document.querySelectorAll('[data-skills] span').forEach(element => {
    element.addEventListener('click', () => element.classList.toggle('highlight'));
  });
})();
