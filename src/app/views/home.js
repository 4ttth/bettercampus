// Home: what a student checks most — next class, balance, latest grades, notices.

BC.views.home = {
  title: 'Home',

  render: function (el) {
    const main = BC.store.load('main');
    const v = BC.views.home;
    el.append(
      BC.ui.async(main, v.greeting, { lines: 2 }),
      BC.h('div', { class: 'bc-grid' },
        BC.ui.card({ title: 'Next class', icon: 'clock', action: { label: 'Full schedule', href: '#/academics/schedule' } },
          BC.ui.async(main, function (m) { return v.nextClass(m.schedule); })
        ),
        BC.ui.card({ title: 'Balance', icon: 'finances', action: { label: 'Details', href: '#/finances' } },
          BC.ui.async(BC.store.load('ledger'), v.balance, { fallback: BC.portal.url('CampusNet/ViewStudentLedgerHAU.php') })
        ),
        BC.ui.card({ title: 'Latest grades', icon: 'academics', action: { label: 'All grades', href: '#/academics/grades' } },
          BC.ui.async(BC.store.load('grades'), v.grades, { lines: 5, fallback: BC.portal.url('CampusNet/StudentGradeInquiry.php') })
        ),
        BC.ui.card({ title: 'Notices', icon: 'bell' },
          BC.ui.async(main, v.notices)
        )
      )
    );
  },

  greeting: function (m) {
    const h = new Date().getHours();
    const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
    const first = BC.titleCase((m.givenNames || '').split(' ')[0]);
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return BC.h('div', { class: 'bc-hello' },
      BC.h('p', { class: 'bc-hello__title' }, 'Good ' + part + (first ? ', ' + first : '')),
      BC.h('p', { class: 'bc-hello__sub' }, date + (m.term ? ' · ' + m.term : ''))
    );
  },

  nextClass: function (schedule) {
    if (!schedule.length) return BC.ui.empty('No classes on your schedule this term.');
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const next = BC.sched.next(schedule, now);
    const later = BC.sched.on(schedule, now.getDay()).filter(function (c) {
      return c !== (next && next.cls) && BC.sched.time(c.from) > nowMin;
    });
    return [
      next ? BC.h('div', { class: 'bc-next' },
        BC.h('p', { class: 'bc-next__when' + (next.live ? ' is-live' : '') }, next.label),
        BC.h('p', { class: 'bc-next__title' }, BC.titleCase(next.cls.title)),
        BC.h('p', { class: 'bc-next__meta' }, [BC.sched.range(next.cls), next.cls.room, next.cls.code].filter(Boolean).join(' · '))
      ) : BC.ui.empty('No upcoming classes this week.'),
      later.length ? [
        BC.h('h3', { class: 'bc-subhead' }, 'Later today'),
        BC.ui.list(later.map(function (c) {
          return BC.ui.row({ title: BC.titleCase(c.title), subtitle: c.room, trailing: BC.sched.fmt(BC.sched.time(c.from)) });
        })),
      ] : null,
    ];
  },

  balance: function (l) {
    if (l.balance == null) return BC.ui.empty('No current assessment found.');
    const due = l.balance > 0;
    return [
      BC.h('p', { class: 'bc-figure' }, BC.ui.money(l.balance)),
      BC.h('p', { class: 'bc-muted' }, due ? 'Remaining on your current assessment' : 'You’re fully paid for this assessment.'),
      due ? BC.h('div', { class: 'bc-actions' },
        BC.h('a', { class: 'bc-btn bc-btn--primary', href: BC.portal.url('GLNet/PaymentCenter.php') }, 'Pay online')
      ) : null,
    ];
  },

  grades: function (g) {
    const term = g.terms.slice().reverse().find(function (t) {
      return t.subjects.some(function (s) { return !isNaN(parseFloat(s.grade)); });
    });
    if (!term) return BC.ui.empty('No grades posted yet.');
    return [
      BC.h('div', { class: 'bc-stats' },
        BC.ui.stat('Term GWA', term.gwa != null ? term.gwa.toFixed(2) : '—'),
        BC.ui.stat('Overall GWA', g.gwa != null ? g.gwa.toFixed(2) : '—')
      ),
      BC.h('h3', { class: 'bc-subhead' }, BC.sched.termLabel(term.label)),
      BC.ui.list(term.subjects.slice(0, 6).map(function (s) {
        return BC.ui.row({ title: BC.titleCase(s.title), subtitle: s.code, trailing: BC.ui.grade(s.grade) });
      })),
      BC.h('p', { class: 'bc-footnote' }, 'GWA is computed by BetterCampus from units and grades. It is unofficial.'),
    ];
  },

  notices: function (m) {
    const pageFor = function (name) {
      if (/class record/i.test(name)) return BC.portal.url('CampusNet/ViewStudClassRecord.php');
      if (/faculty eval/i.test(name)) return BC.portal.url('CampusNet/FacultyEvaluation.php');
      if (/enrol/i.test(name)) return '#/academics/enrollment';
      return null;
    };
    const open = m.openNow.map(function (e) {
      return BC.ui.row({ icon: 'calendar', title: e.name + ' is open', subtitle: 'Until ' + BC.ui.date(e.end), href: pageFor(e.name) });
    });
    const notes = m.notices.map(function (n) {
      return BC.ui.row({ icon: 'bell', title: n.text, subtitle: [n.from, n.date && BC.ui.date(n.date)].filter(Boolean).join(' · ') });
    });
    if (!open.length && !notes.length) return BC.ui.empty('Nothing new right now.');
    const more = document.querySelector('[onclick*="GoMoreNotification"]');
    return [
      BC.ui.list(open.concat(notes)),
      more ? BC.h('div', { class: 'bc-actions' },
        BC.h('button', { type: 'button', class: 'bc-btn bc-btn--text', onclick: function () { more.click(); } }, 'All notifications')
      ) : null,
    ];
  },
};
