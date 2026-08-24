const loginForm = document.querySelector('#login-form');

const loginMessage = document.querySelector('#login-message');

loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const email = document.querySelector('#login-email').value.trim();

  const password = document.querySelector('#login-password').value.trim();

  if (!email || !password) {
    loginMessage.textContent = 'Please enter your email and password.';

    loginMessage.hidden = false;

    return;
  }

  /* ================================
     FRONTEND DEMO LOGIN
  ================================= */

  localStorage.setItem('nestora_logged_in', 'true');

  localStorage.setItem('nestora_customer_email', email);

  /*
    We DO NOT overwrite
    customer_first_name here.

    It was saved during registration.
  */

  window.location.href = 'account.html';
});
