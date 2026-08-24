/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.querySelector('.btn-menu');

const navigation = document.querySelector('.navigation');

/* =========================================
   TOGGLE MENU
========================================= */

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');

    menuButton.classList.toggle('is-open', isOpen);

    menuButton.setAttribute('aria-expanded', String(isOpen));

    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  /* =======================================
     CLOSE AFTER LINK CLICK
  ======================================= */

  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('is-open');

      menuButton.classList.remove('is-open');

      menuButton.setAttribute('aria-expanded', 'false');

      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}
