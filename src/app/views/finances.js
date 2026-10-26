// Finances: Overview · Transactions · Receipts. Built from the ledger page alone,
// which already contains the assessment, every charge/payment and all official receipts.

BC.views.finances = {
  title: 'Finances',
  TABS: [
    { id: 'overview', label: 'Overview', href: '#/finances/overview' },
    { id: 'transactions', label: 'Transactions', href: '#/finances/transactions' },
    { id: 'receipts', label: 'Receipts', href: '#/finances/receipts' },
  ],
  LEDGER: 'CampusNet/ViewStudentLedgerHAU.php',
  PAY: 'GLNet/PaymentCenter.php',

  render: function (el, sub) {
    const v = BC.views.finances;
    const tab = v.TABS.some(function (t) { return t.id === sub; }) ? sub : 'overview';
    el.append(
      BC.ui.tabs('Finances sections', v.TABS, tab),
      BC.ui.async(BC.store.load('ledger'), v[tab], { lines: 6, fallback: BC.portal.url(v.LEDGER) })
    );
  },

  overview: function (l) {
    const v = BC.views.finances;
    let less = false;
    const lines = l.assessment.map(function (a) {
      if (/^less payments?$/i.test(a.label)) {
        less = true;
        return BC.h('div', { class: 'bc-line bc-line--section' }, 'Payments');
      }
      const strong = /sub ?total|^total|^balance$/i.test(a.label);
      if (/^total payment/i.test(a.label)) less = false;
      const value = a.amount != null ? a.amount : a.subtotal;
      return BC.h('div', { class: 'bc-line' + (strong ? ' bc-line--strong' : '') },
        BC.h('span', null, BC.titleCase(a.label)),
        BC.h('span', { class: 'bc-num' }, (less && !strong ? '− ' : '') + BC.ui.money(value))
      );
    });
    return BC.h('div', { class: 'bc-grid' },
      BC.ui.card({ title: 'Balance', icon: 'finances' },
        BC.h('p', { class: 'bc-figure' }, BC.ui.money(l.balance)),
        BC.h('p', { class: 'bc-muted' }, l.balance > 0 ? 'Remaining on your current assessment' : 'You’re fully paid for this assessment.'),
        BC.h('div', { class: 'bc-actions' },
          BC.h('a', { class: 'bc-btn bc-btn--primary', href: BC.portal.url(v.PAY) }, 'Pay online'),
          BC.h('a', { class: 'bc-btn bc-btn--tonal', href: BC.portal.url(v.PAY) }, 'Payment schedule')
        )
      ),
      BC.ui.card({ title: 'Assessment', icon: 'list' },
        lines.length ? BC.h('div', { class: 'bc-breakdown' }, lines) : BC.ui.empty('No assessment on record.')
      )
    );
  },

  transactions: function (l) {
    if (!l.transactions.length) return BC.ui.empty('No transactions yet.');
    const rows = l.transactions.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return BC.h('div', { class: 'bc-card' },
      BC.h('p', { class: 'bc-muted' }, 'Charges (orders of payment) and the payments made against them, newest first.'),
      BC.ui.list(rows.map(function (t) {
        const charge = (t.debit || 0) > 0;
        return BC.ui.row({
          title: t.remarks || t.type,
          subtitle: [charge ? 'Charge' : 'Payment', BC.ui.date(t.date), t.ref].filter(Boolean).join(' · '),
          trailing: BC.h('span', { class: 'bc-num ' + (charge ? 'bc-debit' : 'bc-credit') },
            (charge ? '+ ' : '− ') + BC.ui.money(charge ? t.debit : t.credit)
          ),
        });
      }))
    );
  },

  receipts: function (l) {
    if (!l.receipts.length) return BC.ui.empty('No official receipts yet.');
    const groups = [];
    l.receipts.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).forEach(function (r) {
      let g = groups.find(function (x) { return x.term === r.term; });
      if (!g) groups.push((g = { term: r.term, items: [] }));
      g.items.push(r);
    });
    return BC.h('div', { class: 'bc-stack' }, groups.map(function (g) {
      const total = g.items.reduce(function (s, r) { return s + (r.amount || 0); }, 0);
      return BC.ui.card({ title: BC.sched.termLabel(g.term), icon: 'receipt' },
        BC.ui.list(g.items.map(function (r) {
          return BC.ui.row({
            title: r.remarks,
            subtitle: ['OR ' + r.or, BC.ui.date(r.date), r.method ? BC.titleCase(r.method) : ''].filter(Boolean).join(' · '),
            trailing: BC.h('span', { class: 'bc-num' }, BC.ui.money(r.amount)),
          });
        })),
        BC.h('div', { class: 'bc-line bc-line--strong' }, BC.h('span', null, 'Total paid'), BC.h('span', { class: 'bc-num' }, BC.ui.money(total)))
      );
    }));
  },
};
