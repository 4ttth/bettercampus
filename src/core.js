// Shared helpers. Everything here must work in Chrome, Firefox and Safari
// (desktop + iOS), both as an extension content script and as a userscript,
// so stick to plain DOM APIs — no chrome.* / browser.* / GM_* calls.

const BC = {
  pages: {},
  OFF_KEY: 'bettercampus-off',
};

BC.isDisabled = function () {
  if (/[?&]bc=off\b/.test(location.search)) return true;
  try {
    return localStorage.getItem(BC.OFF_KEY) === '1';
  } catch (e) {
    return false;
  }
};

BC.setDisabled = function (off) {
  try {
    if (off) localStorage.setItem(BC.OFF_KEY, '1');
    else localStorage.removeItem(BC.OFF_KEY);
  } catch (e) {}
  location.reload();
};

// Runs at document_start, before <head>/<body> exist, so append to <html>.
BC.injectCSS = function (css) {
  const style = document.createElement('style');
  style.id = 'bc-styles';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
};

// Hide the old page until our layout is in place, so it doesn't flash.
// Always unhide after a timeout in case a page module throws.
BC.cloak = function () {
  document.documentElement.classList.add('bc-cloak');
  setTimeout(BC.uncloak, 2500);
};

BC.uncloak = function () {
  document.documentElement.classList.remove('bc-cloak');
};

BC.onReady = function (fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
};

// The portal has no viewport meta, so phones render it at desktop width.
BC.ensureViewport = function () {
  if (document.querySelector('meta[name="viewport"]')) return;
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  document.head.appendChild(meta);
};

// Turn off the portal's own stylesheets (linked and inline <style>) on pages we fully redesign.
BC.disablePortalStyles = function () {
  document.querySelectorAll('link[rel~="stylesheet"]').forEach(function (link) {
    if (new URL(link.href, location.href).origin === location.origin) link.disabled = true;
  });
  document.querySelectorAll('style:not(#bc-styles)').forEach(function (style) {
    style.disabled = true;
  });
};

// Flattens nested arrays of children and drops null/false, so builders can return either.
BC.flat = function (x) {
  return [].concat(x).flat(Infinity).filter(function (c) { return c != null && c !== false; });
};

// Tiny element builder: BC.h('div', { class: 'x' }, child, 'text', [more, children], ...)
BC.h = function (tag, attrs) {
  const el = document.createElement(tag);
  Object.entries(attrs || {}).forEach(function ([k, v]) {
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  });
  el.append(...BC.flat(Array.prototype.slice.call(arguments, 2)));
  return el;
};

// Inline SVG icons (24×24, stroked). Kept as paths so nothing loads from outside the portal.
BC.ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  academics: 'M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5 M22 9v6',
  finances: 'M20 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15v12H5a2 2 0 0 1-2-2V6 M16 14h.01',
  me: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6 8-6s8 2 8 6',
  chevron: 'M9 6l6 6-6 6',
  back: 'M19 12H5 M11 18l-6-6 6-6',
  external: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z M10 21h4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  pay: 'M3 6h18v12H3z M3 10h18 M7 15h4',
  key: 'M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  person: 'M4 5h16v14H4z M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M6 16c.5-2 1.6-3 3-3s2.5 1 3 3 M14 9h3 M14 13h3',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2 M8 7h8',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  swap: 'M7 7h13l-3-3 M17 17H4l3 3',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4 M10 17l-5-5 5-5 M5 12h11',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6',
  list: 'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01',
};

BC.icon = function (name) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'bc-icon');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', BC.ICONS[name] || '');
  svg.appendChild(path);
  return svg;
};

// Text helpers for portal data.
BC.text = function (el) {
  return (el ? el.textContent : '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
};

BC.num = function (s) {
  const n = parseFloat(String(s == null ? '' : s).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

BC.today = function () {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// The portal stores names and subjects in ALL CAPS; title case reads faster.
BC.titleCase = function (s) {
  return (s || '')
    .toLowerCase()
    .replace(/[a-z][a-z']*/g, function (w, offset) {
      if (offset > 0 && /^(and|or|of|the|in|on|for|to|a|an|with|at|by|vs)$/.test(w)) return w;
      return w[0].toUpperCase() + w.slice(1);
    })
    .replace(/\b(i{1,3}|iv|vi{0,3}|ix|x)\b/gi, function (m) { return m.toUpperCase(); });
};

// Small floating pill shown on the classic portal so the redesign can be turned back on.
BC.showReenableButton = function () {
  BC.onReady(function () {
    document.body.appendChild(
      BC.h('button', {
        type: 'button',
        class: 'bc-reenable',
        onclick: function () { BC.setDisabled(false); },
      }, 'Use BetterCampus')
    );
  });
};
