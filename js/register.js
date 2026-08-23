const registerForm = document.querySelector('#register-form');

const registerMessage = document.querySelector('#register-message');

registerForm.addEventListener('submit', event => {
  event.preventDefault();

  const firstName = document.querySelector('#register-first-name').value.trim();

  const lastName = document.querySelector('#register-last-name').value.trim();

  const email = document.querySelector('#register-email').value.trim();

  const password = document.querySelector('#register-password').value.trim();

  const terms = document.querySelector('#register-terms').checked;

  /* ================================
     VALIDATION
  ================================= */

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

  /* ================================
     FRONTEND DEMO
  ================================= */

  localStorage.setItem('nestora_logged_in', 'true');

  localStorage.setItem('nestora_customer_email', email);

  localStorage.setItem('nestora_customer_first_name', firstName);

  localStorage.setItem('nestora_customer_last_name', lastName);

  /* New customer bonus */

  localStorage.setItem('nestora_points', '500');

  /* ================================
     REDIRECT
  ================================= */

  window.location.href = 'account.html';
});
