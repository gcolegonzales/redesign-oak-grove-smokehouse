/* Oak Grove Smoke House — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var scrim = document.getElementById('navScrim');

  /* ---- Shrink + reveal-on-scroll-up header ---- */
  var lastScroll = 0;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 24) header.classList.add('shrink');
    else header.classList.remove('shrink');
    // Hide on downward scroll past a small threshold; reveal the instant we scroll up.
    if (y > lastScroll && y > 90) header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastScroll = y < 0 ? 0 : y;
  }
  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---- Mobile drawer ---- */
  // Keep the off-canvas drawer out of the tab order whenever it isn't the
  // active surface (closed, or desktop width). `inert` also hides it from AT.
  function setDrawerInert(on) {
    if (!mobileNav) return;
    if (on) mobileNav.setAttribute('inert', '');
    else mobileNav.removeAttribute('inert');
  }
  // Start inert — it's closed on load.
  setDrawerInert(true);

  function focusableInDrawer() {
    return Array.prototype.slice.call(
      mobileNav.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null || el.getClientRects().length; });
  }

  function openMenu() {
    mobileNav.classList.add('open');
    scrim.hidden = false;
    // force reflow so the scrim fade transition runs
    void scrim.offsetWidth;
    scrim.classList.add('show');
    setDrawerInert(false);
    mobileNav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
    // hide the rest of the page from AT while the drawer owns the screen
    if (header) header.setAttribute('aria-hidden', 'true');
    var main = document.getElementById('main');
    if (main) main.setAttribute('aria-hidden', 'true');
    // move focus into the drawer — preventScroll so the browser doesn't scroll
    // the focused link into view and jump the page (G3)
    var first = focusableInDrawer()[0];
    if (first) {
      try { first.focus({ preventScroll: true }); }
      catch (err) { first.focus(); }
    }
  }
  function closeMenu(returnFocus) {
    var wasOpen = mobileNav.classList.contains('open');
    mobileNav.classList.remove('open');
    scrim.classList.remove('show');
    setDrawerInert(true);
    mobileNav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
    if (header) header.removeAttribute('aria-hidden');
    var main = document.getElementById('main');
    if (main) main.removeAttribute('aria-hidden');
    // return focus to the toggle so keyboard users aren't stranded
    if (wasOpen && returnFocus !== false && toggle) {
      try { toggle.focus({ preventScroll: true }); } catch (err) { toggle.focus(); }
    }
    // hide scrim after its fade-out so it never blocks taps
    window.setTimeout(function () {
      if (!mobileNav.classList.contains('open')) scrim.hidden = true;
    }, 300);
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) closeMenu();
      else openMenu();
    });
    scrim.addEventListener('click', function () { closeMenu(); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      // nav-link tap: close but don't yank focus back to the toggle (let the
      // in-page target take over)
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!mobileNav.classList.contains('open')) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {
        // trap Tab within the drawer
        var items = focusableInDrawer();
        if (!items.length) return;
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault(); lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault(); firstEl.focus();
        } else if (!mobileNav.contains(document.activeElement)) {
          e.preventDefault(); firstEl.focus();
        }
      }
    });
    // Reset state when crossing the desktop breakpoint so no stale
    // aria-expanded/open drawer lingers.
    var mq = window.matchMedia('(min-width: 961px)');
    var onBreak = function () {
      if (mq.matches && mobileNav.classList.contains('open')) closeMenu(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onBreak);
    else if (mq.addListener) mq.addListener(onBreak);
  }

  /* ---- Scroll reveal ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Stagger siblings a touch for a nicer cascade
    var groups = {};
    reveals.forEach(function (el) {
      var parent = el.parentElement;
      var key = parent ? (parent.className || 'x') : 'x';
      groups[key] = (groups[key] || 0);
      el.style.transitionDelay = Math.min(groups[key] * 70, 350) + 'ms';
      groups[key]++;
      io.observe(el);
    });

    // Failsafe: if something prevents the observer from firing (edge browsers,
    // odd viewport, etc.), never leave content stranded invisible.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }, 2500);
  }

  /* ---- Order form (non-wired demo; no fake backend) ---- */
  var form = document.getElementById('orderForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      if (!name || !phone) {
        status.textContent = 'Please add your name and a phone number so we can call you back.';
        status.classList.add('err');
        return;
      }
      status.classList.remove('err');
      status.textContent =
        'Thanks, ' + name.split(' ')[0] + '! Your request is noted — for anything time-sensitive, call us at (225) 673-6857 and we’ll get you sorted today.';
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
