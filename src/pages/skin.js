// Every other portal page (forms like Pay Online, Change Password, Faculty Evaluation):
// keep the page's own content and form, but put it inside the BetterCampus shell so
// navigation is the same everywhere. The portal's sidebar, header and footer are hidden.

BC.pages.skin = {
  match: function (path) {
    return /\/Student\/.+\.php$/i.test(path) && !/\/(Login|Main|ShowError)\.php$/i.test(path);
  },

  run: function () {
    const content = document.getElementById('MainContent');
    if (!content) return false;

    const path = location.pathname;
    const section = /Grade|ClassRecord|Sched|Enrol/i.test(path) ? 'academics'
      : /Ledger|GLNet\//i.test(path) ? 'finances'
      : 'me';
    const title = BC.app.cleanTitle(BC.text(document.querySelector('#HeaderMain .prog_title')) || document.title);

    document.documentElement.classList.add('bc-skin');
    const shell = BC.app.shell({ active: section, title: title });
    shell.lead.append(
      BC.h('a', { class: 'bc-icon-btn', href: BC.app.link('#/' + section), 'aria-label': 'Back' }, BC.icon('back'))
    );
    shell.main.classList.add('bc-main--portal');
    shell.main.append(content); // moved, not copied: the form and its handlers keep working
    document.body.appendChild(shell.root);
    document.title = title + ' · HAU Student Portal';

    BC.pages.skin.openFromHash();
    return true;
  },

  // Academics → "This term" links here with #bc-open=<class code> to jump straight to
  // that subject's breakdown, by clicking the portal's own OpenRawScore link for it.
  openFromHash: function () {
    const m = /#bc-open=([^&]+)/.exec(location.hash);
    if (!m) return;
    const code = decodeURIComponent(m[1]);
    history.replaceState(null, '', location.pathname + location.search);
    const link = Array.from(document.querySelectorAll('a[href*="OpenRawScore"]')).find(function (a) {
      const row = a.closest('tr');
      return row && Array.from(row.cells).some(function (td) { return BC.text(td) === code; });
    });
    if (link) link.click();
  },
};
