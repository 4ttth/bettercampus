// Me: profile and everything account-related, in one place (the portal had it in
// three: Student Information, Utilities and the Account dropdown).

BC.views.me = {
  title: 'Me',

  render: function (el) {
    const v = BC.views.me;
    const ledger = BC.store.load('ledger').catch(function () { return null; });
    const help = Array.from(document.querySelectorAll('a[href^="javascript:OpenHelp"]')).find(function (a) {
      return a.getAttribute('href').indexOf("'help/'") !== -1;
    });
    const privacy = document.querySelector('#privacyModal .modal-card');

    el.append(
      BC.ui.async(Promise.all([BC.store.load('main'), ledger]), v.profile, { lines: 2 }),
      v.group('Account', [
        BC.ui.row({ icon: 'key', title: 'Change password', href: BC.portal.url('Changepass.php') }),
        BC.ui.row({ icon: 'person', title: 'Full profile', subtitle: 'Personal data, family, documents submitted', href: BC.portal.url('CampusNet/ViewOwnStudProfile.php') }),
      ]),
      v.group('School', [
        BC.ui.row({ icon: 'star', title: 'Faculty evaluation', subtitle: 'Rate your instructors when evaluation is open', href: BC.portal.url('CampusNet/FacultyEvaluation.php') }),
        BC.ui.row({ icon: 'book', title: 'Library catalog', subtitle: 'Search books and materials', href: BC.portal.url('CampusNet/CatInquiry6.php') }),
      ]),
      v.group('Help', [
        help ? BC.ui.row({ icon: 'help', title: 'Portal help', onclick: function () { help.click(); } }) : null,
        privacy ? BC.ui.row({
          icon: 'shield',
          title: 'Privacy notice',
          onclick: function () {
            const copy = privacy.cloneNode(true);
            copy.querySelectorAll('button, [onclick]').forEach(function (b) { b.remove(); });
            BC.ui.dialog('Privacy notice', copy);
          },
        }) : null,
        BC.ui.row({ icon: 'swap', title: 'Switch to classic portal', subtitle: 'Turn BetterCampus off on this browser', onclick: function () { BC.setDisabled(true); } }),
      ].filter(Boolean)),
      BC.h('div', { class: 'bc-card bc-card--flush' },
        BC.ui.list([BC.ui.row({ icon: 'logout', title: 'Log out', tone: 'danger', href: BC.portal.url('Login.php'), chevron: false })])
      ),
      BC.h('p', { class: 'bc-footnote bc-about' },
        'BetterCampus ' + BC_VERSION + ' is unofficial and not affiliated with Holy Angel University. ' +
        'It only changes how the portal looks on this device; nothing is sent anywhere. ',
        BC.h('a', { href: BC_HOMEPAGE, target: '_blank', rel: 'noopener' }, 'About & updates')
      )
    );
  },

  profile: function (both) {
    const m = both[0];
    const info = (both[1] && both[1].info) || {};
    const first = BC.titleCase(m.givenNames);
    const last = BC.titleCase(m.lastName);
    const initials = ((first[0] || '') + (last[0] || '')).toUpperCase();
    return BC.h('div', { class: 'bc-card bc-profile' },
      BC.h('div', { class: 'bc-avatar', 'aria-hidden': 'true' }, initials),
      BC.h('div', null,
        BC.h('p', { class: 'bc-profile__name' }, [first, last].filter(Boolean).join(' ')),
        BC.h('p', { class: 'bc-muted' }, [m.info.studentNumber, info.courseProgram, info.yearLevel].filter(Boolean).join(' · '))
      )
    );
  },

  group: function (title, rows) {
    const id = BC.ui.uid();
    return BC.h('section', { class: 'bc-card bc-card--flush', 'aria-labelledby': id },
      BC.h('h2', { class: 'bc-group__title', id: id }, title),
      BC.ui.list(rows)
    );
  },
};
