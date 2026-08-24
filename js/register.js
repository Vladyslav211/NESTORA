/* =========================================
   REGISTER FORM
========================================= */

const registerForm = document.querySelector('#register-form');

const registerMessage = document.querySelector('#register-message');

/* =========================================
   SUBMIT
========================================= */

if (registerForm) {
  registerForm.addEventListener('submit', event => {
    event.preventDefault();

    /* =====================================
         GET FORM VALUES
      ===================================== */

    const firstName = document
      .querySelector('#register-first-name')
      .value.trim();

    const lastName = document.querySelector('#register-last-name').value.trim();

    const email = document
      .querySelector('#register-email')
      .value.trim()
      .toLowerCase();

    const password = document.querySelector('#register-password').value.trim();

    const terms = document.querySelector('#register-terms').checked;

    /* =====================================
         VALIDATION
      ===================================== */

    if (!firstName || !lastName || !email || !password) {
      registerMessage.textContent = 'Please complete all fields.';

      registerMessage.hidden = false;

      return;
    }

    if (password.length < 6) {
      registerMessage.textContent =
        'Password must contain at least 6 characters.';

      registerMessage.hidden = false;

      return;
    }

    if (!terms) {
      registerMessage.textContent =
        'Please accept the Terms of Service and Privacy Policy.';

      registerMessage.hidden = false;

      return;
    }

    /* =====================================
         GET REFERRER
      ===================================== */

    const referrer = localStorage.getItem('nestora_referrer');

    /* =====================================
         CREATE CUSTOMER REFERRAL CODE
      ===================================== */

    const referralCode = `${firstName
      .replace(/\s+/g, '')
      .toUpperCase()
      .slice(0, 6)}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    /* =====================================
         NORMALIZE REFERRAL DATA
      ===================================== */

    const normalizedReferrer = referrer ? referrer.trim().toUpperCase() : null;

    const normalizedReferralCode = referralCode.trim().toUpperCase();

    /* =====================================
         PREVENT SELF REFERRAL
      ===================================== */

    const validReferrer =
      normalizedReferrer && normalizedReferrer !== normalizedReferralCode
        ? normalizedReferrer
        : null;

    /* =====================================
         SAVE LOGIN STATE
      ===================================== */

    localStorage.setItem('nestora_logged_in', 'true');

    /* =====================================
         SAVE CUSTOMER DATA
      ===================================== */

    localStorage.setItem('nestora_customer_email', email);

    localStorage.setItem('nestora_customer_first_name', firstName);

    localStorage.setItem('nestora_customer_last_name', lastName);

    /* =====================================
         SAVE CUSTOMER REFERRAL CODE
      ===================================== */

    localStorage.setItem('nestora_referral_code', referralCode);

    /* =====================================
         SAVE REFERRER
      ===================================== */

    if (validReferrer) {
      localStorage.setItem('nestora_customer_referrer', validReferrer);
    } else {
      localStorage.removeItem('nestora_customer_referrer');
    }

    /* =====================================
         WELCOME BONUS
      ===================================== */

    localStorage.setItem('nestora_points', '500');

    /* =====================================
         POINTS HISTORY
      ===================================== */

    localStorage.setItem(
      'nestora_points_history',
      JSON.stringify([
        {
          title: 'Account created',
          amount: 500,
          date: new Date().toISOString(),
        },
      ])
    );

    /* =====================================
         REDIRECT
      ===================================== */

    window.location.href = 'account.html';
  });
}
