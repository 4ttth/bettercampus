// Picks the page module for the current URL. Add new pages to src/pages/
// and they register themselves on BC.pages.

BC.route = function () {
  const path = location.pathname;
  const page = Object.values(BC.pages).find(function (p) { return p.match(path); });
  return page || null;
};
