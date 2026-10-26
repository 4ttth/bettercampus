// Shared building blocks for views: cards, rows, tabs, async slots, status screens.

BC.ui = { _n: 0 };

BC.ui.uid = function () {
  BC.ui._n += 1;
  return 'bc-id-' + BC.ui._n;
};

BC.ui.money = function (n) {
  if (n == null) return '—';
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// "2026-10-26" → "Oct 26, 2026" (parsed as a local date, not UTC).
BC.ui.date = function (s, opts) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
  if (!m) return s || '';
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric', year: 'numeric' });
};

BC.ui.card = function (opts) {
  const id = BC.ui.uid();
  return BC.h('section', { class: 'bc-card' + (opts.className ? ' ' + opts.className : ''), 'aria-labelledby': id },
    BC.h('div', { class: 'bc-card__head' },
      BC.h('h2', { class: 'bc-card__title', id: id }, opts.icon ? BC.icon(opts.icon) : null, opts.title),
      opts.action ? BC.h('a', { class: 'bc-card__action', href: opts.action.href }, opts.action.label) : null
    ),
    Array.prototype.slice.call(arguments, 1)
  );
};

BC.ui.skeleton = function (lines) {
  const widths = ['70%', '92%', '55%', '84%', '63%', '76%'];
  return BC.h('div', { class: 'bc-skel', 'aria-hidden': 'true' },
    Array.from({ length: lines }, function (_, i) {
      return BC.h('span', { class: 'bc-skel__line', style: 'width:' + widths[i % widths.length] });
    })
  );
};

BC.ui.empty = function (text) {
  return BC.h('p', { class: 'bc-empty' }, text);
};

BC.ui.error = function (err, fallback) {
  const ended = err instanceof BC.SessionError;
  return BC.h('div', { class: 'bc-inline-error', role: 'status' },
    BC.h('span', null, ended ? 'Your session ended.' : "Couldn't load this from the portal."),
    !ended && fallback ? BC.h('a', { href: fallback }, 'Open the original page') : null
  );
};

// Shows a skeleton until the promise settles, then whatever render() returns.
BC.ui.async = function (promise, render, opts) {
  opts = opts || {};
  const slot = BC.h('div', { class: 'bc-async', 'aria-busy': 'true' }, BC.ui.skeleton(opts.lines || 3));
  promise
    .then(function (data) {
      const out = BC.flat(render(data));
      slot.replaceChildren();
      slot.append.apply(slot, out);
    })
    .catch(function (err) {
      console.error('[BetterCampus]', err);
      slot.replaceChildren(BC.ui.error(err, opts.fallback));
    })
    .finally(function () {
      slot.removeAttribute('aria-busy');
    });
  return slot;
};

// A list row: link (href), button (onclick) or plain.
BC.ui.row = function (o) {
  const tag = o.href ? 'a' : o.onclick ? 'button' : 'div';
  const interactive = tag !== 'div';
  return BC.h(tag, {
      class: 'bc-row' + (interactive ? ' bc-row--link' : '') + (o.tone ? ' bc-row--' + o.tone : ''),
      href: o.href || null,
      type: tag === 'button' ? 'button' : null,
      onclick: o.onclick || null,
    },
    o.icon ? BC.h('span', { class: 'bc-row__icon' }, BC.icon(o.icon)) : null,
    BC.h('span', { class: 'bc-row__text' },
      BC.h('span', { class: 'bc-row__title' }, o.title),
      o.subtitle ? BC.h('span', { class: 'bc-row__sub' }, o.subtitle) : null
    ),
    o.trailing != null ? BC.h('span', { class: 'bc-row__trail' }, o.trailing) : null,
    interactive && o.chevron !== false ? BC.h('span', { class: 'bc-row__chev' }, BC.icon(o.external ? 'external' : 'chevron')) : null
  );
};

BC.ui.list = function (rows) {
  return BC.h('ul', { class: 'bc-list', role: 'list' }, rows.map(function (r) { return BC.h('li', null, r); }));
};

// Section tabs are links (they change the URL hash), marked with aria-current.
BC.ui.tabs = function (label, tabs, active) {
  return BC.h('nav', { class: 'bc-tabs', 'aria-label': label },
    tabs.map(function (t) {
      return BC.h('a', { class: 'bc-tab', href: t.href, 'aria-current': t.id === active ? 'page' : false }, t.label);
    })
  );
};

BC.ui.stat = function (label, value) {
  return BC.h('div', { class: 'bc-stat' },
    BC.h('span', { class: 'bc-stat__value' }, value),
    BC.h('span', { class: 'bc-stat__label' }, label)
  );
};

// HAU scale: 1.00 best … 3.00 lowest pass, 5.00 failed; NF/INC/DRP are text.
BC.ui.grade = function (g) {
  const n = parseFloat(g);
  const tone = isNaN(n) ? 'pending' : n >= 5 ? 'bad' : n <= 1.75 ? 'good' : 'ok';
  return BC.h('span', { class: 'bc-grade bc-grade--' + tone },
    g || '—',
    tone === 'bad' ? BC.h('span', { class: 'bc-sr' }, ' (failed)') : null
  );
};

BC.ui.status = function (o) {
  return BC.h('div', { class: 'bc-status', id: o.id || null, role: o.role || null },
    BC.h('div', { class: 'bc-status__card' },
      BC.h('div', { class: 'bc-status__icon' }, BC.icon(o.icon || 'clock')),
      BC.h('h1', { class: 'bc-status__title' }, o.title),
      BC.h('p', { class: 'bc-status__body' }, o.body),
      o.action ? BC.h('a', { class: 'bc-btn bc-btn--primary', href: o.action.href }, o.action.label) : null
    )
  );
};

// Modal dialog (native <dialog>: focus trap, Esc to close, inert background).
BC.ui.dialog = function (title, content) {
  const id = BC.ui.uid();
  const dlg = BC.h('dialog', { class: 'bc-dialog', 'aria-labelledby': id },
    BC.h('div', { class: 'bc-dialog__head' },
      BC.h('h2', { id: id }, title),
      BC.h('button', { type: 'button', class: 'bc-btn bc-btn--text', onclick: function () { dlg.close(); } }, 'Close')
    ),
    BC.h('div', { class: 'bc-dialog__body' }, content)
  );
  dlg.addEventListener('close', function () { dlg.remove(); });
  document.getElementById('bc-root').appendChild(dlg);
  dlg.showModal();
  return dlg;
};
