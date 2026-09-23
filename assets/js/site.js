'use strict';

// Mobile store links stay directly accessible; the split control adds platform choice.
const downloadToggle = document.querySelector('.download-toggle');
const downloadMenu = document.getElementById('download-menu');
function closeDownloads() {
  downloadMenu.hidden = true;
  downloadToggle.setAttribute('aria-expanded', 'false');
}
downloadToggle.addEventListener('click', () => {
  const opening = downloadMenu.hidden;
  downloadMenu.hidden = !opening;
  downloadToggle.setAttribute('aria-expanded', String(opening));
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.download-split')) closeDownloads();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !downloadMenu.hidden) {
    closeDownloads();
    downloadToggle.focus();
  }
});
document.querySelector('.download-split').addEventListener('focusout', (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) closeDownloads();
});

// Respect system motion preferences and suspend off-screen/background video.
const heroVideos = Array.from(document.querySelectorAll('.hero-video'));
let heroVideo = heroVideos[0];
const failedVideos = new Set();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroVisible = true;

function syncMotion() {
  const suspended = reducedMotion.matches || document.hidden;
  document.body.classList.toggle('motion-paused', suspended);
  if (suspended || !heroVisible) {
    heroVideos.forEach(video => video.pause());
  } else {
    // Browsers may decline autoplay. The local poster remains visible in that case.
    const requestedVideo = heroVideo;
    heroVideos.forEach(video => { if (video !== requestedVideo) video.pause(); });
    requestedVideo.play().then(() => {
      // A pending play must not restart motion after a pause or tab switch.
      if (requestedVideo !== heroVideo || reducedMotion.matches || document.hidden || !heroVisible) {
        requestedVideo.pause();
        return;
      }
      heroVideos.forEach(video => video.classList.toggle('is-active', video === requestedVideo));
    }).catch(() => {});
  }
}

// The licensed scenes play in order, then return to the hospital entrance.
function advanceScene() {
  const current = heroVideos.indexOf(heroVideo);
  const next = heroVideos.slice(current + 1).concat(heroVideos.slice(0, current + 1))
    .find(video => !failedVideos.has(video));
  if (!next) return; // Keep the local poster if every source fails.
  heroVideo = next;
  heroVideo.currentTime = 0;
  syncMotion();
}
heroVideos.forEach(video => {
  video.addEventListener('ended', () => { if (video === heroVideo) advanceScene(); });
  function skipFailedScene() {
    failedVideos.add(video);
    if (video === heroVideo) advanceScene();
  }
  video.addEventListener('error', skipFailedScene);
  video.querySelector('source').addEventListener('error', skipFailedScene);
});

reducedMotion.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', syncMotion);
new IntersectionObserver((entries) => {
  heroVisible = entries[0].isIntersecting;
  syncMotion();
}, { threshold: 0 }).observe(document.querySelector('.video-hero'));

syncMotion();

// Recreate the reference's pinned, opposing-card entrance without a library.
// When the grid cannot be pinned, cards still arrive during normal page scrolling.
// Reduced motion always keeps the ordinary, fully visible grid.
const intelligenceSection = document.querySelector('.intelligence-section');
const intelligenceEntrance = window.matchMedia('(min-width: 992px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');
const intelligenceGrid = intelligenceSection.querySelector('.intelligence-grid');
const intelligenceCards = [...intelligenceGrid.querySelectorAll('.intelligence-card')];
let intelligenceCanPin = false;
let intelligenceCanAnimate = false;
let intelligenceFrame = 0;
let intelligenceProgress = 0;
const clampProgress = value => Math.max(0, Math.min(1, value));
function renderIntelligenceEntrance() {
  intelligenceFrame = 0;
  if (!intelligenceCanAnimate) return;
  if (!intelligenceCanPin) {
    // Measure vertical positions only: horizontal transforms do not affect them.
    // Each row finishes entering before it reaches the upper part of the screen.
    intelligenceCards.forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const progress = clampProgress((window.innerHeight * 0.95 - bounds.top) / (window.innerHeight * 0.55));
      const offset = card.contains(document.activeElement) ? 0 : Math.pow(1 - progress, 3) * 110;
      card.style.setProperty('--card-offset', `${index === 1 ? offset : -offset}vw`);
    });
    return;
  }
  const bounds = intelligenceSection.getBoundingClientRect();
  const distance = Math.max(1, intelligenceSection.offsetHeight - window.innerHeight);
  const target = clampProgress(-bounds.top / distance);
  // Light smoothing keeps wheel and trackpad input flowing continuously.
  intelligenceProgress = target === 0 || target === 1 ? target : intelligenceProgress + (target - intelligenceProgress) * 0.16;
  const intro = clampProgress(intelligenceProgress / 0.34);
  const enter = (start, duration) => {
    const progress = clampProgress((intelligenceProgress - start) / duration);
    return Math.pow(1 - progress, 3) * 110;
  };
  intelligenceSection.style.setProperty('--intro-scale', 1 - intro * 0.4);
  intelligenceSection.style.setProperty('--intro-opacity', 1 - intro);
  intelligenceSection.style.setProperty('--card-left', `-${enter(0.16, 0.6)}vw`);
  intelligenceSection.style.setProperty('--card-right', `${enter(0.16, 0.6)}vw`);
  intelligenceSection.style.setProperty('--card-bottom', `-${enter(0.29, 0.61)}vw`);
  if (Math.abs(target - intelligenceProgress) > 0.001) queueIntelligenceEntrance();
}
function queueIntelligenceEntrance() {
  if (intelligenceCanAnimate && !intelligenceFrame) intelligenceFrame = requestAnimationFrame(renderIntelligenceEntrance);
}
function syncIntelligenceEntrance() {
  intelligenceSection.classList.remove('has-flow-entrance');
  intelligenceSection.classList.toggle('has-scroll-entrance', intelligenceEntrance.matches);
  // Richer agent content must fit below the navigation before pinning it.
  // Short windows animate in normal flow, keeping every card reachable.
  intelligenceCanAnimate = !reducedMotion.matches;
  intelligenceCanPin = intelligenceEntrance.matches && intelligenceGrid.offsetHeight <= window.innerHeight - 150;
  intelligenceSection.classList.toggle('has-scroll-entrance', intelligenceCanPin);
  intelligenceSection.classList.toggle('has-flow-entrance', intelligenceCanAnimate && !intelligenceCanPin);
  cancelAnimationFrame(intelligenceFrame);
  intelligenceFrame = 0;
  intelligenceProgress = 0;
  if (intelligenceCanAnimate) renderIntelligenceEntrance();
}
intelligenceEntrance.addEventListener('change', syncIntelligenceEntrance);
reducedMotion.addEventListener('change', syncIntelligenceEntrance);
intelligenceGrid.addEventListener('focusin', queueIntelligenceEntrance);
intelligenceGrid.addEventListener('focusout', queueIntelligenceEntrance);
window.addEventListener('scroll', queueIntelligenceEntrance, {passive: true});
window.addEventListener('resize', syncIntelligenceEntrance, {passive: true});
document.fonts.ready.then(syncIntelligenceEntrance);
syncIntelligenceEntrance();
