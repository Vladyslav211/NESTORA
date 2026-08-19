const contactForm = document.querySelector('#contact-form');
const contactSuccess = document.querySelector('#contact-success');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    contactSuccess.hidden = false;

    contactForm.reset();
  });
}
