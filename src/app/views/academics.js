// Academics: Schedule · Grades · Enrollment (merges six portal pages).

BC.views.academics = {
  title: 'Academics',
  TABS: [
    { id: 'schedule', label: 'Schedule', href: '#/academics/schedule' },
    { id: 'grades', label: 'Grades', href: '#/academics/grades' },
    { id: 'enrollment', label: 'Enrollment', href: '#/academics/enrollment' },
  ],

  render: function (el, sub) {
    const v = BC.views.academics;
    const tab = v.TABS.some(function (t) { return t.id === sub; }) ? sub : 'schedule';
    el.append(BC.ui.tabs('Academics sections', v.TABS, tab), v[tab]());
  },

  schedule: function () {
    return BC.ui.async(BC.store.load('main'), function (m) {
      if (!m.schedule.length) return BC.ui.empty('No classes on your schedule this term.');
      const today = new Date().getDay();
      const days = [1, 2, 3, 4, 5, 6, 0]
        .map(function (d) { return { d: d, list: BC.sched.on(m.schedule, d) }; })
        .filter(function (x) { return x.list.length; });
      return [
        m.term ? BC.h('p', { class: 'bc-lead' }, m.term + ' · ' + m.schedule.length + ' classes') : null,
        BC.h('div', { class: 'bc-week' }, days.map(function (x) {
          return BC.h('section', { class: 'bc-day' + (x.d === today ? ' is-today' : ''), 'aria-label': BC.sched.DAY_NAMES[x.d] },
            BC.h('h2', { class: 'bc-day__name' },
              BC.sched.DAY_NAMES[x.d],
              x.d === today ? BC.h('span', { class: 'bc-chip' }, 'Today') : null
            ),
            x.list.map(function (c) {
              return BC.h('article', { class: 'bc-class' },
                BC.h('p', { class: 'bc-class__time' }, BC.sched.range(c)),
                BC.h('h3', { class: 'bc-class__title' }, BC.titleCase(c.title)),
                BC.h('p', { class: 'bc-class__meta' }, [c.room, c.code, c.block].filter(Boolean).join(' · '))
              );
            })
          );
        })),
        BC.h('p', { class: 'bc-footnote' },
          'Need the registrar’s copy? ',
          BC.h('a', { href: BC.portal.url('CampusNet/ViewStudScheduleHAU.php') }, 'Open the official schedule')
        ),
      ];
    }, { lines: 6 });
  },

  grades: function () {
    const grades = BC.store.load('grades');
    const fallback = BC.portal.url('CampusNet/StudentGradeInquiry.php');
    const recordsPage = BC.portal.url('CampusNet/ViewStudClassRecord.php');
    return BC.h('div', { class: 'bc-stack' },
      BC.ui.async(grades, function (g) {
        const s = g.summary;
        return BC.h('div', { class: 'bc-card bc-stats' },
          BC.ui.stat('GWA (unofficial)', g.gwa != null ? g.gwa.toFixed(2) : '—'),
          BC.ui.stat('Passed', s.pass != null ? s.pass : '—'),
          BC.ui.stat('Failed', s.fail != null ? s.fail : '—'),
          BC.ui.stat('Dropped', s.drop != null ? s.drop : '—')
        );
      }, { lines: 2, fallback: fallback }),

      BC.ui.card({ title: 'This term', icon: 'list', action: { label: 'Class records', href: recordsPage } },
        BC.h('p', { class: 'bc-muted' }, 'Tap a subject to see its prelim, midterm and final breakdown.'),
        BC.ui.async(BC.store.load('records'), function (rs) {
          if (!rs.length) return BC.ui.empty('No class records this term.');
          return BC.ui.list(rs.map(function (r) {
            return BC.ui.row({
              title: BC.titleCase(r.title),
              subtitle: [r.code, BC.app.person(r.instructor)].filter(Boolean).join(' · '),
              href: recordsPage + '#bc-open=' + encodeURIComponent(r.classCode),
            });
          }));
        }, { lines: 4, fallback: recordsPage })
      ),

      BC.ui.async(grades, function (g) {
        return BC.h('section', { class: 'bc-terms', 'aria-labelledby': 'bc-all-terms' },
          BC.h('h2', { class: 'bc-section-title', id: 'bc-all-terms' }, 'All terms'),
          g.terms.slice().reverse().map(function (t, i) {
            const meta = !t.subjects.length ? 'No grades' : t.gwa != null ? 'GWA ' + t.gwa.toFixed(2) : t.subjects.length + ' subjects';
            return BC.h('details', { class: 'bc-term', open: i === 0 },
              BC.h('summary', null,
                BC.h('span', { class: 'bc-term__name' }, BC.sched.termLabel(t.label)),
                BC.h('span', { class: 'bc-term__meta' }, meta)
              ),
              t.subjects.length
                ? BC.ui.list(t.subjects.map(function (s) {
                    return BC.ui.row({
                      title: BC.titleCase(s.title),
                      subtitle: s.code + (s.units ? ' · ' + s.units + ' units' : ''),
                      trailing: BC.ui.grade(s.grade),
                    });
                  }))
                : BC.ui.empty('No grades recorded for this term.')
            );
          })
        );
      }, { lines: 6, fallback: fallback })
    );
  },

  enrollment: function () {
    return BC.ui.card({ title: 'Enrollment', icon: 'calendar' },
      BC.ui.async(BC.store.load('main'), function (m) {
        const win = m.openNow.find(function (e) { return /enrol/i.test(e.name); });
        return BC.h('p', { class: 'bc-banner' + (win ? ' bc-banner--ok' : '') },
          win ? 'Enrollment is open until ' + BC.ui.date(win.end) + '.' : 'Enrollment is closed right now. Self-enrollment opens during the enrollment period.'
        );
      }, { lines: 1 }),
      BC.ui.list([
        BC.ui.row({ icon: 'academics', title: 'Self-enrollment', subtitle: 'Choose your subjects for the next term', href: BC.portal.url('CampusNet/SelfEnrollment.101.php') }),
        BC.ui.row({ icon: 'search', title: 'Find open classes', subtitle: 'Search schedules by department, block or subject', href: BC.portal.url('CampusNet/SubjSchedInqCur.101.php') }),
      ])
    );
  },
};
