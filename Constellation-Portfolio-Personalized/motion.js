/*
 * MOTION EDITION / JAVASCRIPT
 * Optional visual enhancements for the original portfolio.
 * Accessible by design: reduced-motion setting, a user toggle, keyboard nav,
 * touch fallback, and no animations required to access project content.
 * No dependencies, trackers, or external JS libraries.
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionToggle = document.getElementById('motion-toggle');
  const clock = document.getElementById('local-clock');
  const main = document.getElementById('main');
  let revealObserver;
  let animationCleanup = () => {};
  let previousRoute = location.hash;
  let motionOff = false;
  try { motionOff = localStorage.getItem('mh-editorial-no-motion') === 'true'; } catch (error) {}

  function motionOK() { return !reduceMotion.matches && !motionOff; }
  function updateMotionButton() {
    document.body.classList.toggle('motion-off', !motionOK());
    document.body.classList.toggle('js-motion', motionOK());
    motionToggle.disabled = reduceMotion.matches;
    motionToggle.setAttribute('aria-pressed', String(motionOK()));
    motionToggle.setAttribute('aria-label', reduceMotion.matches ? 'Animations disabled by your system preference' : (motionOK() ? 'Turn animations off' : 'Turn animations on'));
    motionToggle.title = reduceMotion.matches ? 'Reduced motion enabled in your device settings' : (motionOK() ? 'Animations on · click to pause' : 'Animations paused · click to play');
  }
  motionToggle.addEventListener('click', () => {
    motionOff = !motionOff;
    try { localStorage.setItem('mh-editorial-no-motion', String(motionOff)); } catch (error) {}
    updateMotionButton();
    initRouteMotion(false);
  });
  reduceMotion.addEventListener?.('change', () => { updateMotionButton(); initRouteMotion(false); });
  updateMotionButton();

  // A tiny personal touch: show real Amsterdam/Eindhoven local time, never a fake clock.
  function updateClock() {
    if (!clock) return;
    const time = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam'
    }).format(new Date());
    clock.textContent = time;
    clock.title = `Local time in Eindhoven: ${time}`;
  }
  updateClock();
  setInterval(updateClock, 60_000);

  // Floating project hint, only on desktop mouse/trackpad.
  const cursor = document.createElement('div');
  cursor.className = 'project-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = 'VIEW CASE ↗';
  document.body.append(cursor);
  let pointerX = -200, pointerY = -200, floatX = -200, floatY = -200;
  let cursorActive = false;
  let cursorFrame = 0;
  function moveCursor() {
    if (!cursorActive || !motionOK() || !pointerFine.matches) {
      cursorFrame = 0;
      return;
    }
    floatX += (pointerX - floatX) * .26;
    floatY += (pointerY - floatY) * .26;
    cursor.style.transform = `translate3d(${floatX - 41}px,${floatY - 41}px,0)`;
    cursorFrame = requestAnimationFrame(moveCursor);
  }
  function hideCursor() {
    cursorActive = false;
    cursor.classList.remove('is-active');
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
  }
  document.addEventListener('pointermove', e => {
    pointerX = e.clientX;
    pointerY = e.clientY;
  }, { passive: true });
  window.addEventListener('scroll', hideCursor, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); });

  // Back-to-top: direct real action on home and normal internal navigation on case studies.
  const topButton = document.createElement('a');
  topButton.className = 'back-to-top';
  topButton.href = '#/';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.textContent = '↑';
  document.body.append(topButton);
  topButton.addEventListener('click', e => {
    if (!location.hash || location.hash === '#/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: motionOK() ? 'smooth' : 'auto' });
    }
  });
  function updateTopButton() {
    topButton.classList.toggle('is-active', window.scrollY > 650);
  }
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();

  function initReveals() {
    revealObserver?.disconnect();
    const selectors = [
      '.work-section .section-intro',
      '.work-controls',
      '.project-card',
      '.about-section .section-kicker',
      '.about-photo',
      '.about-text',
      '.skills-section .section-kicker',
      '.skills-heading',
      '.skill-card',
      '.experience-section .section-kicker',
      '.experience-row',
      '.contact-section .section-kicker',
      '.contact-heading',
      '.contact-bottom',
      '.case-hero .case-breadcrumb',
      '.case-title',
      '.case-summary',
      '.case-cover',
      '.case-facts',
      '.case-overview',
      '.case-process .section-kicker',
      '.case-process > h2',
      '.process-step',
      '.case-outcome .outcome-inner',
      '.case-gallery',
      '.case-next .wrap'
    ];
    const nodes = [...main.querySelectorAll(selectors.join(','))];
    if (!motionOK() || !('IntersectionObserver' in window)) {
      nodes.forEach(el => {
        el.classList.remove('reveal-item');
        el.classList.add('is-visible');
      });
      return;
    }
    nodes.forEach(el => {
      el.classList.add('reveal-item');
      el.classList.remove('is-visible');
      if (el.classList.contains('project-card')) {
        const i = [...el.parentElement.children].indexOf(el);
        el.style.setProperty('--reveal-delay', `${(i % 2) * 115}ms`);
      }
      if (el.classList.contains('skill-card')) {
        const i = [...el.parentElement.children].indexOf(el);
        el.style.setProperty('--reveal-delay', `${(i % 4) * 75}ms`);
      }
    });
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .07, rootMargin: '0px 0px -28px 0px' });
    nodes.forEach(node => revealObserver.observe(node));
  }

  function initHero(cleanups) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const art = hero.querySelector('.hero-art');
    const processButton = document.getElementById('process-toggle');
    const phaseLabel = document.getElementById('process-phase');
    const phaseDescription = document.getElementById('process-descriptor');
    const phases = [
      ['01', 'Listen & learn', 'Start with people, not pixels.'],
      ['02', 'Make it visual', 'Sketch, test and connect ideas.'],
      ['03', 'Build the idea', 'From Figma to real interfaces.'],
      ['04', 'Improve again', 'Feedback makes things better.']
    ];
    let phase = 0;
    const changePhase = () => {
      phase = (phase + 1) % phases.length;
      const [num, title, description] = phases[phase];
      phaseLabel.textContent = `${num}   ${title}`;
      phaseDescription.textContent = description;
      art.dataset.phase = String(phase);
      processButton.classList.remove('phase-pulse');
      if (motionOK()) {
        void processButton.offsetWidth;
        processButton.classList.add('phase-pulse');
        processButton.querySelector('.process-symbol')?.animate(
          [{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }],
          { duration: 610, easing: 'cubic-bezier(.22,1,.36,1)' }
        );
      }
    };
    processButton?.addEventListener('click', changePhase);
    cleanups.push(() => processButton?.removeEventListener('click', changePhase));

    const parallax = e => {
      if (!motionOK() || !pointerFine.matches || window.innerWidth < 800) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      hero.style.setProperty('--pointer-x', `${(x+.5)*100}%`);
      hero.style.setProperty('--pointer-y', `${(y+.5)*100}%`);
      art.style.transform = `translate3d(${(x*26).toFixed(1)}px,${(y*23).toFixed(1)}px,0)`;
    };
    const resetParallax = () => {
      art.style.removeProperty('transform');
      hero.style.removeProperty('--pointer-x');
      hero.style.removeProperty('--pointer-y');
    };
    hero.addEventListener('pointermove', parallax, { passive: true });
    hero.addEventListener('pointerleave', resetParallax);
    cleanups.push(() => {
      hero.removeEventListener('pointermove', parallax);
      hero.removeEventListener('pointerleave', resetParallax);
      resetParallax();
    });

    // Reveal the hero after the page is mounted, not before custom fonts are needed.
    if (motionOK()) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (hero.isConnected) hero.classList.add('hero-entered');
      }));
    } else {
      hero.classList.add('hero-entered');
    }
  }

  function initCards(cleanups) {
    document.querySelectorAll('.project-card').forEach(card => {
      const visual = card.querySelector('.card-visual');
      if (!visual) return;
      let frame = 0;
      let savedEvent;
      const onEnter = e => {
        if (!motionOK() || !pointerFine.matches) return;
        cursorActive = true;
        cursor.classList.add('is-active');
        floatX = e.clientX;
        floatY = e.clientY;
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!cursorFrame) cursorFrame = requestAnimationFrame(moveCursor);
      };
      const onMove = e => {
        if (!motionOK() || !pointerFine.matches) return;
        savedEvent = e;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!card.isConnected) return;
          const rect = visual.getBoundingClientRect();
          const x = Math.min(1, Math.max(0, (savedEvent.clientX - rect.left)/rect.width));
          const y = Math.min(1, Math.max(0, (savedEvent.clientY - rect.top)/rect.height));
          visual.style.setProperty('--tilt-x', `${((.5-y)*7).toFixed(2)}deg`);
          visual.style.setProperty('--tilt-y', `${((x-.5)*7).toFixed(2)}deg`);
          visual.style.setProperty('--spot-x', `${(x*100).toFixed(0)}%`);
          visual.style.setProperty('--spot-y', `${(y*100).toFixed(0)}%`);
        });
      };
      const onLeave = () => {
        hideCursor();
        visual.style.removeProperty('--tilt-x');
        visual.style.removeProperty('--tilt-y');
        visual.style.removeProperty('--spot-x');
        visual.style.removeProperty('--spot-y');
      };
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove, { passive: true });
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('focusin', onLeave); // A keyboard focus never needs a mouse cursor.
      cleanups.push(() => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        card.removeEventListener('focusin', onLeave);
        if (frame) cancelAnimationFrame(frame);
      });
    });
  }

  function initMagnetic(cleanups) {
    if (!pointerFine.matches) return;
    const elements = main.querySelectorAll('.pill-button, .dark-pill, .outline-pill, .process-toggle, .filter-btn');
    elements.forEach(el => {
      el.classList.add('magnetic');
      const onMove = e => {
        if (!motionOK()) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mag-x', `${((e.clientX-r.left-r.width/2)*.10).toFixed(1)}px`);
        el.style.setProperty('--mag-y', `${((e.clientY-r.top-r.height/2)*.13).toFixed(1)}px`);
      };
      const onLeave = () => {
        el.style.removeProperty('--mag-x');
        el.style.removeProperty('--mag-y');
      };
      el.addEventListener('pointermove', onMove, { passive: true });
      el.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      });
    });
  }

  function initFilterAnimation(cleanups) {
    const filters = document.querySelector('.work-controls');
    if (!filters) return;
    const onClick = e => {
      if (!e.target.closest('[data-filter]') || !motionOK()) return;
      const visible = [...document.querySelectorAll('.project-card:not([hidden])')];
      visible.forEach((card, i) => {
        card.classList.add('is-visible');
        card.animate([
          { opacity: 0, transform: 'translateY(17px) scale(.98)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], { duration: 520, delay: i*55, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    };
    filters.addEventListener('click', onClick);
    cleanups.push(() => filters.removeEventListener('click', onClick));
  }

  function initRouteMotion(animateRoute = true) {
    animationCleanup();
    hideCursor();
    const cleanups = [];
    animationCleanup = () => cleanups.forEach(fn => fn());
    // Only mark the route as motion-enhanced when an observer is ready to reveal the content.
    if (motionOK()) document.body.classList.add('js-motion');
    initReveals();
    initHero(cleanups);
    initCards(cleanups);
    initMagnetic(cleanups);
    initFilterAnimation(cleanups);

    const isCaseTransition = previousRoute.includes('/project/') || location.hash.includes('/project/');
    if (animateRoute && motionOK() && isCaseTransition) {
      main.animate([
        { opacity: .45, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    previousRoute = location.hash;
    updateTopButton();
  }

  // Original route renderer registers its hashchange handler first.
  // Our next frame attaches motion to the freshly-created DOM.
  window.addEventListener('hashchange', () => requestAnimationFrame(() => initRouteMotion()));
  initRouteMotion(false);
})();
