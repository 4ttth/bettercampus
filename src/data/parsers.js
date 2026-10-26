// Turn portal pages (live document or fetched) into plain data.
// Each parser works off header text, not positions, so small layout changes don't break it.

BC.parse = {};

// Main.php: student info, current schedule, notifications, open calendar windows.
BC.parse.main = function (doc) {
  const names = Array.from(doc.querySelectorAll('#boxStudInfo .w4 p'), BC.text);
  const info = {};
  doc.querySelectorAll('#boxStudInfo .row, #boxClassSched .row').forEach(function (r) {
    const q = BC.text(r.querySelector('.box_Q'));
    if (q) info[BC.portal.key(q)] = BC.text(r.querySelector('.box_A'));
  });

  // Columns: class code, block, "CODE - TITLE", time from, time to, days, room.
  const schedule = [];
  const sched = doc.querySelector('#boxClassSched table');
  if (sched) {
    BC.portal.rows(sched).forEach(function (c) {
      if (c.length < 7 || !/^\d+$/.test(c[0])) return;
      const dash = c[2].indexOf(' - ');
      schedule.push({
        classCode: c[0],
        block: c[1],
        code: dash > 0 ? c[2].slice(0, dash).trim() : c[2],
        title: dash > 0 ? c[2].slice(dash + 3).trim() : c[2],
        from: c[3],
        to: c[4],
        days: c[5],
        room: c[6],
      });
    });
  }

  // Notification rows look like "Message... - sender (2026-10-15 13:28:36)".
  const notices = [];
  let notifCount = 0;
  doc.querySelectorAll('table').forEach(function (t) {
    if (t.id !== 'events_table' || !/Notifications/i.test(BC.text(t.tHead))) return;
    notifCount = BC.num(BC.text(t.querySelector('.notif_badge'))) || 0;
    Array.from(t.tBodies[0] ? t.tBodies[0].rows : [], BC.text).forEach(function (s) {
      if (!s || /^no (new )?notification/i.test(s)) return;
      const m = /^(.*?)\s+-\s+([\w.]+)\s+\((\d{4}-\d{2}-\d{2})[^)]*\)$/.exec(s);
      notices.push(m ? { text: m[1], from: m[2], date: m[3] } : { text: s });
    });
  });

  // txtSCalDays: "start|end|department|window~…" — school-wide windows like Faculty Evaluation.
  const raw = (doc.getElementById('txtSCalDays') || {}).value || '';
  const today = BC.today();
  const seen = new Set();
  const openNow = [];
  raw.split('~').forEach(function (entry) {
    const [start, end, dept, name] = entry.split('|');
    if (!name || !(start <= today && today <= end)) return;
    if (/PhD|Graduate|High School|Basic|Elementary|Grade School|Kinder|Pre-?school/i.test(dept)) return;
    if (/Online Application|^Editing|Encoding|Submission of Grades/i.test(name)) return; // applicant / faculty windows
    if (seen.has(name)) return;
    seen.add(name);
    openNow.push({ name: name, start: start, end: end });
  });

  return {
    lastName: (names[0] || '').replace(/,\s*$/, ''),
    givenNames: names[1] || '',
    info: info,
    term: info.classScheduleFor || '',
    schedule: schedule,
    notices: notices,
    notifCount: notifCount,
    openNow: openNow,
  };
};

// Units-weighted average of numeric grades (1.00 best, 5.00 failed). Unofficial.
BC.gwa = function (subjects) {
  let sum = 0;
  let units = 0;
  subjects.forEach(function (s) {
    const g = parseFloat(s.grade);
    if (s.units > 0 && g >= 1 && g <= 5) {
      sum += g * s.units;
      units += s.units;
    }
  });
  return units ? sum / units : null;
};

// StudentGradeInquiry.php: one table, term header rows followed by subject rows.
BC.parse.grades = function (doc) {
  const table = BC.portal.findTable(doc, ['SUBJECT CODE', 'GRADES']);
  if (!table) throw new Error('Grades table not found');
  const terms = [];
  let cur = null;
  BC.portal.rows(table).forEach(function (r) {
    const filled = r.filter(Boolean);
    if (filled.length === 1 && /\d{4}\s*-\s*\d{4}/.test(filled[0])) {
      cur = { label: filled[0], subjects: [] };
      terms.push(cur);
    } else if (cur && r.length >= 4 && r[0]) {
      cur.subjects.push({ code: r[0], grade: r[1], units: BC.num(r[2]), title: r[3] });
    }
  });
  terms.forEach(function (t) { t.gwa = BC.gwa(t.subjects); });

  const summary = {};
  doc.querySelectorAll('tr').forEach(function (tr) {
    const c = Array.from(tr.cells, BC.text);
    if (/^(Pass|Fail|Drop)$/i.test(c[0])) summary[c[0].toLowerCase()] = BC.num(c[1]);
  });

  const all = terms.flatMap(function (t) { return t.subjects; });
  return { terms: terms, summary: summary, gwa: BC.gwa(all) };
};

// ViewStudentLedgerHAU.php: student data, assessment, ledger, official receipts.
BC.parse.ledger = function (doc) {
  const find = BC.portal.findTable.bind(null, doc);
  const assessment = BC.portal.objects(find(['Particulars', 'Amount']))
    .map(function (o) { return { label: o.particulars, subtotal: BC.num(o.subtotal), amount: BC.num(o.amount) }; })
    .filter(function (o) { return o.label; });
  const balance = assessment.find(function (o) { return /^balance$/i.test(o.label); });

  const transactions = BC.portal.objects(find(['TYPE', 'DUE DATE']))
    .map(function (o) {
      return { type: o.type, date: o.dueDate, ref: o.refNo, remarks: o.remarks, debit: BC.num(o.debit), credit: BC.num(o.credit), balance: BC.num(o.balance) };
    })
    .filter(function (o) { return o.type; });

  const receipts = BC.portal.objects(find(['OR NO', 'TELLER']))
    .map(function (o) { return { term: o.sYSem, or: o.orNo, date: o.date, remarks: o.remarks, method: o.oRRemarks, amount: BC.num(o.amount) }; })
    .filter(function (o) { return /\d/.test(o.or || ''); });

  return {
    info: BC.portal.labels(doc),
    assessment: assessment,
    balance: balance ? balance.amount : null,
    transactions: transactions,
    receipts: receipts,
  };
};

// ViewStudClassRecord.php: this term's subjects and instructors.
BC.parse.records = function (doc) {
  return BC.portal.objects(BC.portal.findTable(doc, ['CLASS CODE', 'INSTRUCTOR']))
    .filter(function (o) { return /^\d+$/.test(o.classCode || ''); })
    .map(function (o) {
      return { classCode: o.classCode, code: o.code, title: o.subjects, units: BC.num(o.units), instructor: o.instructor };
    });
};
