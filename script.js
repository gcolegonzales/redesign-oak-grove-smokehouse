/* Oak Grove Smoke House — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  /* ---- Shrink-on-scroll header ---- */
  var lastScroll = -1;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 24) header.classList.add('shrink');
    else header.classList.remove('shrink');
    lastScroll = y;
  }
  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  function closeMenu() {
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
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
