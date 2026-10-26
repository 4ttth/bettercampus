// Background access to other portal pages, plus helpers for reading their tables.
//
// Only read-only view pages are ever requested, with plain GETs, the same as
// clicking the portal's own menu. Never request Login.php: loading it ends the session.

BC.portal = {
  base: /\/Student\//i.test(location.pathname) ? location.pathname.replace(/\/Student\/.*$/i, '/Student/') : '/Student/',
};

BC.portal.url = function (path) {
  return BC.portal.base + path;
};

BC.SessionError = class SessionError extends Error {};

// The portal may not send a charset header; honour <meta charset> so names with Ñ survive.
BC.portal.decode = function (buf, contentType) {
  let charset = (/charset=([\w-]+)/i.exec(contentType || '') || [])[1];
  if (!charset) {
    const head = new TextDecoder('latin1').decode(buf.slice(0, 2048));
    charset = (/<meta[^>]+charset=["']?([\w-]+)/i.exec(head) || [])[1] || 'utf-8';
  }
  try {
    return new TextDecoder(charset).decode(buf);
  } catch (e) {
    return new TextDecoder('utf-8').decode(buf);
  }
};

BC.portal.fetchDoc = async function (path) {
  const res = await fetch(BC.portal.url(path), { credentials: 'same-origin' });
  if (/ShowError\.php|\/Login\.php/i.test(res.url)) throw new BC.SessionError('Session ended');
  if (!res.ok) throw new Error('Portal returned HTTP ' + res.status + ' for ' + path);
  const html = BC.portal.decode(await res.arrayBuffer(), res.headers.get('content-type'));
  return new DOMParser().parseFromString(html, 'text/html');
};

// A table's own rows as arrays of cell text (nested tables are not mixed in).
BC.portal.rows = function (table) {
  return Array.from(table.rows, function (r) { return Array.from(r.cells, BC.text); });
};

// The innermost table whose header row contains every given header text.
// Long cells are ignored so layout tables wrapping the real one don't match.
BC.portal.findTable = function (doc, headers) {
  const want = headers.map(function (h) { return h.toUpperCase(); });
  return Array.from(doc.querySelectorAll('table')).find(function (t) {
    const first = BC.portal.rows(t).find(function (r) { return r.some(Boolean); });
    if (!first) return false;
    const cells = first.filter(function (c) { return c.length < 60; }).map(function (c) { return c.toUpperCase(); });
    return want.every(function (h) { return cells.some(function (c) { return c.includes(h); }); });
  }) || null;
};

// "DUE DATE" → "dueDate", "O.R. REMARKS" → "oRRemarks"
BC.portal.key = function (s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/ (\w)/g, function (_, c) { return c.toUpperCase(); });
};

// Table rows as objects keyed by the header row.
BC.portal.objects = function (table) {
  if (!table) return [];
  const rows = BC.portal.rows(table).filter(function (r) { return r.some(Boolean); });
  if (!rows.length) return [];
  const keys = rows[0].map(BC.portal.key);
  return rows.slice(1).map(function (r) {
    const o = {};
    keys.forEach(function (k, i) { if (k) o[k] = r[i] == null ? '' : r[i]; });
    return o;
  });
};

// "Label:" / value pairs from the portal's two-column info tables.
BC.portal.labels = function (doc) {
  const out = {};
  doc.querySelectorAll('tr').forEach(function (tr) {
    const cells = Array.from(tr.cells, BC.text);
    cells.forEach(function (c, i) {
      if (!/:$/.test(c) || c.length > 40) return;
      const v = cells.slice(i + 1).find(Boolean);
      const k = BC.portal.key(c);
      if (v && !/:$/.test(v) && !(k in out)) out[k] = v;
    });
  });
  return out;
};
