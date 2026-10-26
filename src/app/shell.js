// App shell: the same four destinations on every screen size (Material 3 adaptive navigation).
//   < 600px   bottom navigation bar
//   600–1199  navigation rail
//   ≥ 1200    navigation drawer with labels
// On Main.php the destinations are hash routes; on other portal pages they link back to Main.php.

BC.app = {
  NAV: [
    { id: 'home', label: 'Home', icon: 'home', hash: '#/' },
    { id: 'academics', label: 'Academics', icon: 'academics', hash: '#/academics' },
    { id: 'finances', label: 'Finances', icon: 'finances', hash: '#/finances' },
    { id: 'me', label: 'Me', icon: 'me', hash: '#/me' },
  ],
  onMain: false,
};

BC.views = {};

BC.app.link = function (hash) {
  return BC.app.onMain ? hash : BC.portal.url('Main.php') + hash;
};

// "DELA CRUZ , JUAN P." → "Juan P. Dela Cruz"
BC.app.person = function (s) {
  const parts = (s || '').split(',');
  if (parts.length < 2) return BC.titleCase(s);
  return BC.titleCase(parts.slice(1).join(' ').trim() + ' ' + parts[0].trim());
};

// "Display Own Grades (Add/Edit/Delete)" → "Grades", "Change Own Password" → "Change Password"
BC.app.cleanTitle = function (s) {
  return (s || '')
    .replace(/\((Add\/Edit\/Delete|Update)\)/gi, '')
    .replace(/^(Display|View)\s+/i, '')
    .replace(/\bOwn\s+/i, '')
    .trim();
};

BC.app.shell = function (opts) {
  BC.app.onMain = !!opts.onMain;
  const links = {};
  const main = BC.h('main', { id: 'bc-main', class: 'bc-main', tabindex: '-1' });
  const title = BC.h('h1', { class: 'bc-topbar__title', tabindex: '-1' }, opts.title || '');
  const lead = BC.h('div', { class: 'bc-topbar__lead' });
  const actions = BC.h('div', { class: 'bc-topbar__actions' });

  const root = BC.h('div', { id: 'bc-root', class: 'bc-shell' },
    BC.h('a', {
      class: 'bc-skip',
      href: '#bc-main',
      onclick: function (e) { e.preventDefault(); main.focus(); },
    }, 'Skip to content'),
    BC.h('nav', { class: 'bc-nav', 'aria-label': 'Main' },
      BC.h('div', { class: 'bc-nav__brand' },
        BC.h('span', { class: 'bc-nav__mark', 'aria-hidden': 'true' }, 'HAU'),
        BC.h('span', { class: 'bc-nav__name' }, 'Student Portal')
      ),
      BC.h('ul', { class: 'bc-nav__list', role: 'list' },
        BC.app.NAV.map(function (n) {
          links[n.id] = BC.h('a', { class: 'bc-nav__item', href: BC.app.link(n.hash) },
            BC.h('span', { class: 'bc-nav__icon' }, BC.icon(n.icon)),
            BC.h('span', { class: 'bc-nav__label' }, n.label)
          );
          return BC.h('li', null, links[n.id]);
        })
      )
    ),
    BC.h('div', { class: 'bc-body' },
      BC.h('header', { class: 'bc-topbar' }, lead, title, actions),
      main
    )
  );

  function setActive(id) {
    Object.keys(links).forEach(function (k) {
      if (k === id) links[k].setAttribute('aria-current', 'page');
      else links[k].removeAttribute('aria-current');
    });
  }
  setActive(opts.active);

  return { root: root, main: main, title: title, lead: lead, actions: actions, setActive: setActive };
};

// Hash router for Main.php: #/section/tab
BC.app.start = function (shell) {
  let lastSection = null;
  function render() {
    const hash = location.hash;
    if (hash && !hash.startsWith('#/') && lastSection) return; // ordinary in-page anchor
    const parts = hash.replace(/^#\/?/, '').split('/');
    const id = BC.views[parts[0]] ? parts[0] : 'home';
    const view = BC.views[id];
    shell.setActive(id);
    shell.title.textContent = view.title;
    document.title = view.title + ' · HAU Student Portal';
    shell.main.replaceChildren();
    view.render(shell.main, parts[1]);
    if (lastSection !== null && lastSection !== id) {
      window.scrollTo(0, 0);
      shell.title.focus({ preventScroll: true }); // announce the new page to screen readers
    }
    lastSection = id;
  }
  window.addEventListener('hashchange', render);
  render();
};

BC.app.sessionEnded = function () {
  const root = document.getElementById('bc-root');
  if (!root || document.getElementById('bc-session')) return;
  root.appendChild(BC.ui.status({
    id: 'bc-session',
    role: 'alertdialog',
    icon: 'clock',
    title: 'Your session ended',
    body: 'You were signed out after a period of inactivity, or because your account signed in somewhere else — the portal allows one session at a time.',
    action: { label: 'Sign in again', href: BC.portal.url('Login.php') },
  }));
};
