// One request per portal page per visit; views share the same promise.
// Data stays in memory only — nothing personal is written to storage.

BC.store = {
  cache: {},
  sources: {
    main: function () {
      if (/\/Main\.php$/i.test(location.pathname)) return Promise.resolve(document).then(BC.parse.main);
      return BC.portal.fetchDoc('Main.php').then(BC.parse.main);
    },
    grades: function () { return BC.portal.fetchDoc('CampusNet/StudentGradeInquiry.php').then(BC.parse.grades); },
    ledger: function () { return BC.portal.fetchDoc('CampusNet/ViewStudentLedgerHAU.php').then(BC.parse.ledger); },
    records: function () { return BC.portal.fetchDoc('CampusNet/ViewStudClassRecord.php').then(BC.parse.records); },
  },
};

BC.store.load = function (key) {
  if (!BC.store.cache[key]) {
    BC.store.cache[key] = BC.store.sources[key]().catch(function (err) {
      delete BC.store.cache[key]; // allow a retry on the next view
      if (err instanceof BC.SessionError) BC.app.sessionEnded();
      throw err;
    });
  }
  return BC.store.cache[key];
};
