'use strict';
// Every navigation between pages should start at the top of the new page,
// not wherever the browser last left the scroll position (bfcache, tab
// restore, etc). Runs eagerly, before layout, so there's no visible jump.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
window.addEventListener('pageshow', event => {
  if (event.persisted) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
