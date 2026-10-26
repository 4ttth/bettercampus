// Class-time helpers. Portal formats: days "M", "MTH", "TTH", "W", "S"; times "01:30p" / "07:00a".

BC.sched = {
  DAY_NAMES: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

// "MTH" → [1, 4]. TH and SU are matched before single letters.
BC.sched.days = function (s) {
  const out = [];
  const str = (s || '').toUpperCase().replace(/[^A-Z]/g, '');
  for (let i = 0; i < str.length; ) {
    if (str.startsWith('TH', i)) { out.push(4); i += 2; continue; }
    if (str.startsWith('SU', i)) { out.push(0); i += 2; continue; }
    const d = { M: 1, T: 2, W: 3, F: 5, S: 6 }[str[i]];
    if (d != null) out.push(d);
    i += 1;
  }
  return out;
};

// "01:30p" → minutes after midnight.
BC.sched.time = function (s) {
  const m = /(\d{1,2}):(\d{2})\s*([ap])?/i.exec(s || '');
  if (!m) return null;
  let h = +m[1] % 12;
  if ((m[3] || '').toLowerCase() === 'p') h += 12;
  return h * 60 + +m[2];
};

BC.sched.fmt = function (min) {
  if (min == null) return '';
  const h = Math.floor(min / 60);
  const m = String(min % 60).padStart(2, '0');
  return ((h % 12) || 12) + ':' + m + (h < 12 ? ' AM' : ' PM');
};

BC.sched.range = function (c) {
  return BC.sched.fmt(BC.sched.time(c.from)) + ' – ' + BC.sched.fmt(BC.sched.time(c.to));
};

BC.sched.on = function (schedule, day) {
  return schedule
    .filter(function (c) { return BC.sched.days(c.days).includes(day); })
    .sort(function (a, b) { return BC.sched.time(a.from) - BC.sched.time(b.from); });
};

// The class happening now, or the next one within a week.
BC.sched.next = function (schedule, now) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let d = 0; d < 7; d++) {
    const day = (now.getDay() + d) % 7;
    const list = BC.sched.on(schedule, day).filter(function (c) {
      return d > 0 || BC.sched.time(c.to) > nowMin;
    });
    if (!list.length) continue;
    const c = list[0];
    const start = BC.sched.time(c.from);
    if (d === 0 && start <= nowMin) return { cls: c, live: true, label: 'Now · until ' + BC.sched.fmt(BC.sched.time(c.to)) };
    if (d === 0) {
      const mins = start - nowMin;
      return { cls: c, label: mins <= 90 ? 'Starts in ' + mins + ' min' : 'Today at ' + BC.sched.fmt(start) };
    }
    return { cls: c, label: (d === 1 ? 'Tomorrow' : BC.sched.DAY_NAMES[day]) + ' at ' + BC.sched.fmt(start) };
  }
  return null;
};

// "2023 - 2024 1st Semester" → "1st Semester · 2023–2024"; "2023-2024 1S" → "1st Semester · 2023–2024"
BC.sched.termLabel = function (s) {
  let m = /(\d{4})\s*-\s*(\d{4})\s*(.+)/.exec(s || '');
  if (!m) return s || '';
  const sem = m[3].trim().replace(/^1S$/i, '1st Semester').replace(/^2S$/i, '2nd Semester').replace(/^(SS|S|3S)$/i, 'Summer');
  return sem + ' · ' + m[1] + '–' + m[2];
};
