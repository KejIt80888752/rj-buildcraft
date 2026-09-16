/* R&J BuildCraft — site scripts (vanilla, no dependencies) */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Current year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = $('#navToggle');
  var nav = $('#nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close after tapping a link
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click / Escape
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = $('#header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var run = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = target + suffix; return; }

      var duration = 1600;
      var start = null;

      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);            // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Material category search ---------- */
  var search = $('#materialSearch');
  if (search) {
    var items = $$('#materialGrid .material');
    var countEl = $('#materialCount');
    var noResults = $('#noResults');

    var filter = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;

      items.forEach(function (item) {
        var name = (item.textContent || '').toLowerCase();
        var match = !q || name.indexOf(q) !== -1;
        item.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (countEl) {
        countEl.innerHTML = '<b>' + shown + '</b> ' +
          (shown === 1 ? 'category' : 'categories') +
          (q ? ' matched' : ' available');
      }
      if (noResults) noResults.hidden = shown !== 0;
    };

    search.addEventListener('input', filter);
    search.addEventListener('search', filter);   // fires on the native clear (×)
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(function (item) {
    var btn = $('.faq-q', item);
    var panel = $('.faq-a', item);
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // close all
      $$('.faq-item').forEach(function (other) {
        other.classList.remove('is-open');
        var op = $('.faq-a', other);
        var ob = $('.faq-q', other);
        if (op) op.style.maxHeight = null;
        if (ob) ob.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Keep an open panel correctly sized after a resize
  window.addEventListener('resize', function () {
    var open = $('.faq-item.is-open .faq-a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  /* ---------- Enquiry form ---------- */
  var form = $('#enquiryForm');
  if (form) {
    var successBox = $('#formSuccess');
    var submitBtn = $('#submitBtn');

    var setError = function (input, hasError) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('has-error', hasError);
      return !hasError;
    };

    var validate = function () {
      var ok = true;

      var name = $('#name');
      ok = setError(name, name.value.trim().length < 2) && ok;

      var phone = $('#phone');
      var digits = phone.value.replace(/\D/g, '');
      ok = setError(phone, !(digits.length === 10 || (digits.length === 12 && digits.indexOf('91') === 0))) && ok;

      var email = $('#email');
      var emailVal = email.value.trim();
      ok = setError(email, emailVal !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) && ok;

      var service = $('#service');
      ok = setError(service, service.value === '') && ok;

      var message = $('#message');
      ok = setError(message, message.value.trim().length < 10) && ok;

      return ok;
    };

    // Clear the error as soon as the user starts fixing it
    $$('input, select, textarea', form).forEach(function (input) {
      var evt = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(evt, function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) {
        var firstBad = $('.field.has-error input, .field.has-error select, .field.has-error textarea', form);
        if (firstBad) {
          firstBad.focus();
          firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Static site: no backend. Hand the details to WhatsApp, then confirm.
      // window.open must stay inside the click gesture or popup blockers kill it.
      var msg =
        'New enquiry \u2014 R&J BuildCraft\n' +
        'Name: ' + $('#name').value.trim() + '\n' +
        'Phone: ' + $('#phone').value.trim() + '\n' +
        'Email: ' + ($('#email').value.trim() || '-') + '\n' +
        'Location: ' + ($('#location').value.trim() || '-') + '\n' +
        'Service: ' + $('#service').value + '\n' +
        'Details: ' + $('#message').value.trim();

      window.open('https://wa.me/917676698471?text=' + encodeURIComponent(msg), '_blank', 'noopener');

      var original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      setTimeout(function () {
        if (successBox) {
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      }, 600);
    });
  }
})();
