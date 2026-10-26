// ShowError.php: the portal's bare error page. ec=1204 means the session is gone
// (timed out, or the account signed in somewhere else).

BC.pages.error = {
  match: function (path) {
    return /\/ShowError\.php$/i.test(path);
  },

  run: function () {
    const ec = new URLSearchParams(location.search).get('ec');
    const content = document.getElementById('MainContent');
    const message = BC.text(content).slice(0, 400);
    const sessionLost = ec === '1204' || /session not found|session was lost|time ?out/i.test(message);

    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-status-page');
    document.body.appendChild(BC.h('div', { id: 'bc-root' },
      sessionLost
        ? BC.ui.status({
            icon: 'clock',
            title: 'Your session ended',
            body: 'You were signed out after a period of inactivity, or because your account signed in somewhere else — the portal allows one session at a time.',
            action: { label: 'Sign in again', href: BC.portal.url('Login.php') },
          })
        : BC.ui.status({
            icon: 'help',
            title: 'Something went wrong',
            body: message || 'The portal couldn’t open this page.',
            action: { label: 'Back to Home', href: BC.portal.url('Main.php') },
          })
    ));
    return true;
  },
};
