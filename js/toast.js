/* =========================================
   TOAST NOTIFICATIONS
========================================= */

function showToast(message, type = 'success') {
  let toastContainer =
    document.querySelector('#toast-container');

  /* =======================================
     CREATE CONTAINER
  ======================================= */

  if (!toastContainer) {
    toastContainer = document.createElement('div');

    toastContainer.id = 'toast-container';

    toastContainer.className =
      'toast-container';

    document.body.appendChild(
      toastContainer
    );
  }

  /* =======================================
     CREATE TOAST
  ======================================= */

  const toast =
    document.createElement('div');

  toast.className =
    `toast toast--${type}`;

  toast.innerHTML = `
    <span class="toast__icon">
      ${type === 'success' ? '✓' : '×'}
    </span>

    <span class="toast__message">
      ${message}
    </span>
  `;

  toastContainer.appendChild(toast);

  /* =======================================
     SHOW
  ======================================= */

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  /* =======================================
     REMOVE
  ======================================= */

  setTimeout(() => {
    toast.classList.remove(
      'is-visible'
    );

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 2500);
}