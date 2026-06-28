(function () {
  'use strict';

  /* ===== Спільні віджети (кнопки, AI-чат, форма заявки) — вставляються на кожній сторінці ===== */
  var WIDGETS_HTML =
    '<a href="tel:+380736661836" class="fab" aria-label="Зателефонувати">' +
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg>' +
      '<span class="fab__pulse"></span></a>' +
    '<button class="chat-fab" id="chatFab" aria-label="Чат з AI-консультантом">' +
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 4h16a1 1 0 011 1v12a1 1 0 01-1 1H9l-4 3v-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="9" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/></svg>' +
      '<span class="chat-fab__badge">AI</span><span class="chat-fab__pulse"></span></button>' +
    '<div class="chat" id="chatPanel" aria-hidden="true">' +
      '<div class="chat__head"><div class="chat__who"><span class="chat__avatar">О</span>' +
      '<span class="chat__meta"><b>Олександра</b><i><span class="chat__dot"></span> AI-консультант · онлайн</i></span></div>' +
      '<button class="chat__close" id="chatClose" aria-label="Закрити чат">×</button></div>' +
      '<div class="chat__body" id="chatBody"><div class="chat__msg chat__msg--bot">' +
      'Вітаю! 👋 Я Олександра, консультант MobiDoctor. Що сталося з вашим телефоном? Підкажу ціну, строки та оформлю безкоштовний виїзд кур\'єра по Харкову.' +
      '</div></div>' +
      '<div class="chat__quick" id="chatQuick">' +
        '<button type="button">Розбитий екран iPhone</button>' +
        '<button type="button">Ремонт Samsung</button>' +
        '<button type="button">Не тримає зарядку</button>' +
        '<button type="button">Скільки коштує діагностика?</button>' +
      '</div>' +
      '<form class="chat__form" id="chatForm"><input type="text" id="chatInput" placeholder="Напишіть повідомлення…" autocomplete="off" maxlength="500" />' +
      '<button type="submit" aria-label="Надіслати"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 11l18-8-8 18-2-7-8-3z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg></button></form>' +
    '</div>' +
    '<div class="modal" id="modal" aria-hidden="true">' +
      '<div class="modal__overlay" data-close-modal></div>' +
      '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
      '<button class="modal__close" data-close-modal aria-label="Закрити">×</button>' +
      '<h3 id="modalTitle">Викликати кур\'єра</h3>' +
      '<p class="modal__sub">Залиште номер — передзвонимо за кілька хвилин та узгодимо час виїзду.</p>' +
      '<form id="leadForm" class="lead-form" novalidate>' +
        '<label>Ваше ім\'я<input type="text" name="name" placeholder="Ім\'я" autocomplete="name" required /></label>' +
        '<label>Телефон<input type="tel" name="phone" placeholder="+38 0__ ___ __ __" autocomplete="tel" required /></label>' +
        '<label>Що сталося з телефоном? <span class="opt">(необов\'язково)</span><textarea name="problem" rows="3" placeholder="Напр.: iPhone 13, розбитий екран"></textarea></label>' +
        '<button type="submit" class="btn btn--accent btn--lg btn--block">Залишити заявку</button>' +
        '<p class="lead-form__note">Натискаючи кнопку, ви погоджуєтесь на обробку даних згідно з <a href="/polityka-konfidentsiynosti">політикою конфіденційності</a>.</p>' +
      '</form>' +
      '<div class="lead-success" id="leadSuccess" hidden>' +
        '<div class="lead-success__ic">✓</div><h3>Дякуємо!</h3>' +
        '<p>Ваша заявка прийнята. Ми передзвонимо вам найближчим часом.</p>' +
        '<button class="btn btn--ghost" data-close-modal>Закрити</button>' +
      '</div></div></div>';

  if (!document.getElementById('modal')) {
    var wrap = document.createElement('div');
    wrap.innerHTML = WIDGETS_HTML;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

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
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  /* Поява елементів при прокрутці */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Анімовані лічильники (якщо є) */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = val.toLocaleString('uk-UA') + (target >= 1000 ? '+' : '');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('uk-UA') + (target >= 1000 ? '+' : '');
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); co.unobserve(entry.target); }
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
  document.querySelectorAll('[data-open-modal]').forEach(function (btn) { btn.addEventListener('click', openModal); });
  document.querySelectorAll('[data-close-modal]').forEach(function (btn) { btn.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
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
    var history = [];
    var busy = false;
    var DEBUG = /[?&]debug=1/.test(location.search);

    function failMsg(data) {
      var base = 'Вибачте, стався збій звʼязку. Зателефонуйте, будь ласка: 073 666 18 36 — ми на звʼязку щодня 09:00–21:00.';
      if (DEBUG && data) {
        var d = data.error || '';
        if (data.detail) d += ' / ' + (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
        if (d) base += '\n\n[debug: ' + d + ']';
      }
      return base;
    }

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
        return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, data: d }; });
      }).then(function (res) {
        typing.remove();
        if (res.ok && res.data && res.data.reply) {
          addMessage('assistant', res.data.reply);
          history.push({ role: 'assistant', content: res.data.reply });
          if (res.data.leadSaved && typeof gtag === 'function') {
            gtag('event', 'generate_lead', { event_category: 'chat', event_label: 'ai_assistant' });
          }
          return;
        }
        addMessage('assistant', failMsg(res.data));
      }).catch(function () {
        typing.remove();
        addMessage('assistant', failMsg(null));
      }).then(function () {
        busy = false;
        if (sendBtn) sendBtn.disabled = false;
        inputEl.focus();
      });
    }

    formEl.addEventListener('submit', function (e) { e.preventDefault(); send(inputEl.value); });
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

  /* Відправка форми → /api/lead → Telegram */
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var note = form.querySelector('.lead-form__note');
    var noteDefault = note ? note.innerHTML : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = form.querySelector('input[name="name"]');
      var phoneEl = form.querySelector('input[name="phone"]');
      var problemEl = form.querySelector('textarea[name="problem"]');
      var valid = true;
      [nameEl, phoneEl].forEach(function (f) {
        if (!f.value.trim() || (f === phoneEl && f.value.replace(/\D/g, '').length < 11)) {
          f.classList.add('invalid'); valid = false;
        } else { f.classList.remove('invalid'); }
      });
      if (!valid) return;

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Надсилаємо…'; }
      if (note) { note.innerHTML = noteDefault; note.style.color = ''; }

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameEl.value.trim(),
          phone: phoneEl.value.trim(),
          problem: problemEl ? problemEl.value.trim() : ''
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { return r.ok && d.ok !== false; });
      }).then(function (ok) {
        if (!ok) throw new Error('send failed');
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'form', event_label: 'courier_request' });
        }
        form.hidden = true;
        if (success) success.hidden = false;
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Залишити заявку'; }
        if (note) { note.textContent = 'Не вдалося надіслати. Зателефонуйте: 073 666 18 36'; note.style.color = '#fb7185'; }
      });
    });
  }
})();
