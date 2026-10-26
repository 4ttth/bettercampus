// Entry point. Runs at document_start.

(function () {
  if (BC.isDisabled()) {
    BC.showReenableButton();
    BC.injectCSS(BC_CSS);
    return;
  }

  const page = BC.route();
  BC.injectCSS(BC_CSS);
  if (!page) return; // unknown page: leave it as the portal draws it

  BC.cloak();
  BC.onReady(function () {
    try {
      BC.ensureViewport();
      page.run();
    } catch (e) {
      console.error('[BetterCampus]', e);
    } finally {
      BC.uncloak();
    }
  });
})();
