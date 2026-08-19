const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-item__question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    faqItems.forEach(faqItem => {
      faqItem.classList.remove('is-open');

      const faqQuestion = faqItem.querySelector('.faq-item__question');

      faqQuestion.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});
