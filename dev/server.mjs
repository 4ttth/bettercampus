// Offline harness: serves pages saved from the portal (samples/, gitignored) at their
// real /Student/... paths and injects the built bundle, so the redesign can be tested
// without a live session. The portal's own scripts are stripped from served pages.
//
// Usage: npm run build && node dev/server.mjs  →  http://localhost:5174/Student/Main.php

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const samples = path.join(root, 'samples');
const bundle = path.join(root, 'dist', 'extension', 'content.js');
const PORT = +(process.env.PORT || 5174);

// Portal path (under /Student/) → saved file in samples/
const PAGES = {
  'Main.php': 'Main Menu.html',
  'Login.php': 'Campus++ Portal Login.html',
  'Changepass.php': 'Change Own Password.html',
  'CampusNet/StudentGradeInquiry.php': 'Display Own Grades (Add_Edit_Delete).html',
  'CampusNet/ViewStudClassRecord.php': 'Display Own Class Records (Add_Edit_Delete).html',
  'CampusNet/ViewStudScheduleHAU.php': 'Display Own Class Schedule (Add_Edit_Delete).html',
  'CampusNet/SubjSchedInqCur.101.php': 'Subject Schedule Inquiry . Current Enrollment (Add_Edit_Delete).html',
  'CampusNet/ViewStudentLedgerHAU.php': 'View Student Ledger of Accounts (Add_Edit_Delete).html',
  'CampusNet/ViewOwnStudProfile.php': 'Student Profile (Add_Edit_Delete).html',
  'CampusNet/FacultyEvaluation.php': 'Faculty Performance Evaluation.html',
  'CampusNet/CatInquiry6.php': 'Online Public Access Catalog.html',
  'GLNet/RptARPayment.php': 'Payment Report.html',
  'GLNet/PaymentCenter.php': 'Online Payment Center ( Enrollment Fee Details).html',
};

const ERROR_PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>CampusNet Error Page</title></head>
<body><div id="MainContent">Active session not found or was lost (time out) due to long period of inactivity.</div></body></html>`;

const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };

function servePage(res, html) {
  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style id="bc-styles"[\s\S]*?<\/style>/gi, '')
    .replace(/<head([^>]*)>/i, '<head$1><script src="/__bc/content.js"></script>');
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  res.end(html);
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(url.pathname);

  if (p === '/__bc/content.js') {
    res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' });
    return fs.createReadStream(bundle).pipe(res);
  }
  if (p === '/' ) {
    res.writeHead(302, { location: '/Student/Main.php' });
    return res.end();
  }

  // The public install page, as GitHub Pages will serve it.
  if (p.startsWith('/docs/')) {
    const file = path.join(root, 'docs', p.slice(6) || 'index.html');
    if (file.startsWith(path.join(root, 'docs')) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      const type = file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8';
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
      return fs.createReadStream(file).pipe(res);
    }
  }

  const rel = p.replace(/^\/Student\//i, '');
  if (/ShowError\.php$/i.test(rel)) return servePage(res, ERROR_PAGE);
  if (PAGES[rel]) return servePage(res, fs.readFileSync(path.join(samples, PAGES[rel]), 'utf8'));

  // Saved-page assets: "<page>_files/..." referenced relative to /Student/, /Student/CampusNet/ or /Student/GLNet/
  const asset = path.join(samples, rel.replace(/^(CampusNet|GLNet)\//i, ''));
  if (asset.startsWith(samples) && fs.existsSync(asset) && fs.statSync(asset).isFile()) {
    res.writeHead(200, { 'content-type': TYPES[path.extname(asset).toLowerCase()] || 'application/octet-stream' });
    return fs.createReadStream(asset).pipe(res);
  }

  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('Not in samples: ' + p);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`BetterCampus harness → http://localhost:${PORT}/Student/Main.php`);
});
