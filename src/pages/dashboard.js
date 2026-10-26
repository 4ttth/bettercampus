// Main.php becomes the app. The portal's own DOM stays in the page (hidden) so its
// scripts — keep-alive timer, notifications, help popups — keep working.

BC.pages.dashboard = {
  match: function (path) {
    return /\/Main\.php$/i.test(path);
  },

  run: function () {
    if (!document.getElementById('Form1')) return false;
    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-app');
    const shell = BC.app.shell({ onMain: true });
    document.body.appendChild(shell.root);
    BC.app.start(shell);
    return true;
  },
};
