'use strict';
// Each tab group owns its selection and moving highlight.
document.querySelectorAll('[role="tablist"]').forEach(list => {
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  const indicator = document.createElement('span');
  indicator.className = 'tab-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  list.prepend(indicator);
  function position() {
    const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    if (!selected) return;
    indicator.style.width = `${selected.offsetWidth}px`;
    indicator.style.height = `${selected.offsetHeight}px`;
    indicator.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`;
  }
  function select(next, focus = false) {
    tabs.forEach(tab => {
      const active = tab === next;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    position();
    if (focus) next.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  });
  position();
  new ResizeObserver(position).observe(list);
  document.fonts.ready.then(position);
  requestAnimationFrame(() => list.classList.add('has-sliding-indicator'));
});
// Keep older product bookmarks useful after the page reorganisation.
const previousProduct = new URLSearchParams(location.search).get('product');
const legacyTargets = {voice: 'voice-scribe', records: 'patient-context', capture: 'intelligence'};
if (legacyTargets[previousProduct]) {
  window.addEventListener('load', () => document.getElementById(legacyTargets[previousProduct])?.scrollIntoView());
}
