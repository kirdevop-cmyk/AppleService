(function () {
  'use strict';

  /* Рік у підвалі */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Шапка: тінь при прокрутці + прогрес-бар */
  var header = document.getElementById('header');
  var progress = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (y / h) * 100 + '%' : '0';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Мобільне меню */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  /* Поява елементів при прокрутці */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Анімовані лічильники */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString('uk-UA') + (p === 1 && target >= 1000 ? '+' : (target >= 1000 ? '+' : ''));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('uk-UA') + (target >= 1000 ? '+' : '');
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* Модальне вікно */
  var modal = document.getElementById('modal');
  var form = document.getElementById('leadForm');
  var success = document.getElementById('leadSuccess');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 100);
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* AI-консультант (Claude) */
  (function () {
    var fab = document.getElementById('chatFab');
    var panel = document.getElementById('chatPanel');
    var closeBtn = document.getElementById('chatClose');
    var bodyEl = document.getElementById('chatBody');
    var formEl = document.getElementById('chatForm');
    var inputEl = document.getElementById('chatInput');
    var quickEl = document.getElementById('chatQuick');
    if (!fab || !panel || !formEl) return;

    var sendBtn = formEl.querySelector('button[type="submit"]');
    var history = []; // {role, content} — лише текст
    var busy = false;

    function openChat() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      fab.classList.add('hide');
      setTimeout(function () { inputEl.focus(); }, 100);
    }
    function closeChat() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      fab.classList.remove('hide');
    }
    fab.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    function scrollDown() { bodyEl.scrollTop = bodyEl.scrollHeight; }

    function addMessage(role, text) {
      var el = document.createElement('div');
      el.className = 'chat__msg chat__msg--' + (role === 'user' ? 'user' : 'bot');
      el.textContent = text;
      bodyEl.appendChild(el);
      scrollDown();
      return el;
    }

    function showTyping() {
      var el = document.createElement('div');
      el.className = 'chat__msg chat__msg--bot chat__msg--typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      bodyEl.appendChild(el);
      scrollDown();
      return el;
    }

    function send(text) {
      if (busy || !text.trim()) return;
      busy = true;
      if (sendBtn) sendBtn.disabled = true;
      if (quickEl) quickEl.classList.add('hide');

      addMessage('user', text);
      history.push({ role: 'user', content: text });
      inputEl.value = '';
      var typing = showTyping();

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          return { ok: r.ok, data: d };
        });
      }).then(function (res) {
        typing.remove();
        if (!res.ok || !res.data || !res.data.reply) throw new Error('chat failed');
        addMessage('assistant', res.data.reply);
        history.push({ role: 'assistant', content: res.data.reply });
        if (res.data.leadSaved && typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'chat', event_label: 'ai_assistant' });
        }
      }).catch(function () {
        typing.remove();
        addMessage('assistant', 'Вибачте, стався збій звʼязку. Зателефонуйте, будь ласка: 073 666 18 36 — ми на звʼязку щодня 09:00–21:00.');
      }).then(function () {
        busy = false;
        if (sendBtn) sendBtn.disabled = false;
        inputEl.focus();
      });
    }

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      send(inputEl.value);
    });

    if (quickEl) {
      quickEl.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') send(e.target.textContent);
      });
    }
  })();

  /* Маска телефону */
  var phoneInput = form ? form.querySelector('input[name="phone"]') : null;
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '');
      if (d.indexOf('380') === 0) d = d.slice(3);
      d = d.slice(0, 9);
      var out = '+38 0';
      if (d.length > 0) out += d.slice(0, 2);
      if (d.length >= 3) out += ' ' + d.slice(2, 5);
      if (d.length >= 6) out += ' ' + d.slice(5, 7);
      if (d.length >= 8) out += ' ' + d.slice(7, 9);
      this.value = out;
    });
  }

  /* Відправка форми → серверлес-функція /api/lead → Telegram */
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var note = form.querySelector('.lead-form__note');
    var noteDefault = note ? note.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = form.querySelector('input[name="name"]');
      var phoneEl = form.querySelector('input[name="phone"]');
      var problemEl = form.querySelector('textarea[name="problem"]');
      var valid = true;
      [nameEl, phoneEl].forEach(function (f) {
        if (!f.value.trim() || (f === phoneEl && f.value.replace(/\D/g, '').length < 11)) {
          f.classList.add('invalid');
          valid = false;
        } else {
          f.classList.remove('invalid');
        }
      });
      if (!valid) return;

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Надсилаємо…'; }
      if (note) { note.textContent = noteDefault; note.style.color = ''; }

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameEl.value.trim(),
          phone: phoneEl.value.trim(),
          problem: problemEl ? problemEl.value.trim() : ''
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          return r.ok && d.ok !== false;
        });
      }).then(function (ok) {
        if (!ok) throw new Error('send failed');
        // Точка конверсії для Google Ads
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'form', event_label: 'courier_request' });
        }
        form.hidden = true;
        if (success) success.hidden = false;
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Залишити заявку'; }
        if (note) {
          note.textContent = 'Не вдалося надіслати. Зателефонуйте: 073 666 18 36';
          note.style.color = '#fb7185';
        }
      });
    });
  }
})();
