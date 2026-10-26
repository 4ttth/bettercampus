// Login page (/Student/Login.php).
//
// The portal uses invisible reCAPTCHA bound to the #cmdSubmit button, whose
// callback submits #Form1 to Main.php. We never recreate those controls; we
// MOVE the original nodes into a new layout inside the same <form>, so the
// reCAPTCHA binding, field names and POST target all stay exactly as they are.

BC.pages.login = {
  match: function (path) {
    return /\/login\.php$/i.test(path);
  },

  run: function () {
    const form = document.getElementById('Form1');
    const user = document.getElementById('txtUserName');
    const pass = document.getElementById('txtPassword');
    const submit = document.getElementById('cmdSubmit');
    if (!form || !user || !pass || !submit) return false; // page changed; leave it alone

    const error = document.getElementById('loginError');
    const forgot = form.querySelector('.frgtPW');
    const logo = form.querySelector('#logoCont img');
    const captcha = submit.previousElementSibling; // reCAPTCHA container sits right before the button
    const schoolName =
      (form.querySelector('#descCont h1') || {}).textContent || 'Holy Angel University';

    BC.disablePortalStyles();
    document.documentElement.classList.add('bc-page-login');

    // Better mobile keyboards / password managers. Values are never touched.
    user.setAttribute('autocomplete', 'username');
    user.setAttribute('autocapitalize', 'none');
    user.setAttribute('spellcheck', 'false');
    pass.setAttribute('autocomplete', 'current-password');
    user.placeholder = 'Student number';
    pass.placeholder = 'Password';

    const toggle = BC.h('button', {
      type: 'button',
      class: 'bc-pw-toggle',
      'aria-label': 'Show password',
      'aria-pressed': 'false',
      onclick: function () {
        const show = pass.type === 'password';
        pass.type = show ? 'text' : 'password';
        toggle.textContent = show ? 'Hide' : 'Show';
        toggle.setAttribute('aria-pressed', String(show));
        toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        pass.focus();
      },
    }, 'Show');

    submit.classList.add('bc-btn', 'bc-btn--primary');
    submit.textContent = 'Sign in';
    submit.addEventListener('click', function () {
      if (!user.value || !pass.value) return;
      submit.classList.add('is-loading');
    });
    // The portal's onRecaptchaError un-hides #loginError; stop the spinner when that happens.
    if (error) {
      new MutationObserver(function () {
        if (!error.hidden) submit.classList.remove('is-loading');
      }).observe(error, { attributes: true, attributeFilter: ['hidden'] });
      error.classList.add('bc-alert');
    }
    if (forgot) forgot.classList.add('bc-link');

    const root = BC.h('div', { id: 'bc-root', class: 'bc-login' },
      BC.h('section', { class: 'bc-login__brand' },
        logo ? BC.h('div', { class: 'bc-login__logo' }, logo) : null,
        BC.h('h1', { class: 'bc-login__school' }, schoolName.trim()),
        BC.h('p', { class: 'bc-login__tagline' }, 'Student Portal')
      ),
      BC.h('section', { class: 'bc-login__panel' },
        BC.h('div', { class: 'bc-login__card' },
          BC.h('h2', { class: 'bc-login__title' }, 'Sign in'),
          BC.h('p', { class: 'bc-muted' }, 'Use your Campus++ account.'),
          BC.h('label', { class: 'bc-field', for: 'txtUserName' },
            BC.h('span', { class: 'bc-field__label' }, 'Username')
          ),
          user,
          BC.h('label', { class: 'bc-field', for: 'txtPassword' },
            BC.h('span', { class: 'bc-field__label' }, 'Password')
          ),
          BC.h('div', { class: 'bc-pw' }, pass, toggle),
          error,
          captcha,
          submit,
          BC.h('div', { class: 'bc-login__footer' },
            forgot,
            BC.h('button', {
              type: 'button',
              class: 'bc-link bc-link--quiet',
              onclick: function () { BC.setDisabled(true); },
            }, 'Classic view')
          ),
          BC.h('p', { class: 'bc-login__note' },
            'Redesigned by ',
            BC.h('a', { href: BC_HOMEPAGE, target: '_blank', rel: 'noopener' }, 'BetterCampus'),
            ' — unofficial, not affiliated with HAU. You sign in to the real portal.'
          )
        )
      )
    );

    // Keep everything inside the original <form> so the POST still includes the fields.
    form.prepend(root);
    const old = document.getElementById('fullSz');
    if (old) old.remove();
    return true;
  },
};
