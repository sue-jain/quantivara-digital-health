'use strict';

const menuButton = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
function closeDropdowns(except) {
  dropdowns.forEach(item => {
    if (item === except) return;
    item.querySelector('.dropdown-menu').hidden = true;
    item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
}
function closeNavigation() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  closeDropdowns();
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', opening);
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  if (!opening) closeDropdowns();
});
dropdowns.forEach(item => {
  const button = item.querySelector('.dropdown-toggle');
  const panel = item.querySelector('.dropdown-menu');
  button.addEventListener('click', () => {
    const opening = panel.hidden;
    closeDropdowns(item);
    panel.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
  });
  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
  });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) closeDropdowns();
  if (!event.target.closest('.site-header')) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const open = dropdowns.find(item => !item.querySelector('.dropdown-menu').hidden);
  if (open) {
    closeDropdowns();
    open.querySelector('.dropdown-toggle').focus();
  } else if (nav.classList.contains('is-open')) {
    closeNavigation();
    menuButton.focus();
  }
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeNavigation(); });
document.querySelector('.site-header').addEventListener('focusout', event => {
  if (!event.currentTarget.contains(event.relatedTarget)) closeNavigation();
});
window.matchMedia('(max-width: 850px)').addEventListener('change', closeNavigation);
const currentPage = location.pathname.split('/').pop() || 'index.html';
nav.querySelectorAll('a').forEach(anchor => {
  if (anchor.getAttribute('href') === currentPage) anchor.setAttribute('aria-current', 'page');
});
document.getElementById('year').textContent = new Date().getFullYear();
