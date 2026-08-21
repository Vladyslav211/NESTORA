const searchButton = document.querySelector('.header__action');

const searchOverlay = document.querySelector('#search-overlay');

const searchInput = document.querySelector('#search-input');

const searchResults = document.querySelector('#search-results');

const searchCloseButtons = document.querySelectorAll('[data-search-close]');

// ========================================
// OPEN SEARCH
// ========================================

function openSearch() {
  searchOverlay.classList.add('is-open');

  searchOverlay.setAttribute('aria-hidden', 'false');

  document.body.classList.add('search-open');

  setTimeout(() => {
    searchInput.focus();
  }, 100);
}

// ========================================
// CLOSE SEARCH
// ========================================

function closeSearch() {
  searchOverlay.classList.remove('is-open');

  searchOverlay.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('search-open');

  searchInput.value = '';

  renderSearchResults('');
}

// ========================================
// SEARCH RESULTS
// ========================================

function renderSearchResults(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    searchResults.innerHTML = `
      <p class="search-results__placeholder">
        Start typing to search.
      </p>
    `;

    return;
  }

  const filteredProducts = products.filter(product => {
    return (
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery)
    );
  });

  if (filteredProducts.length === 0) {
    searchResults.innerHTML = `
      <p class="search-results__empty">
        No products found.
      </p>
    `;

    return;
  }

  searchResults.innerHTML = filteredProducts
    .map(product => {
      return `
        <a
          class="search-result"
          href="product.html?id=${product.id}"
        >

          <div class="search-result__image">

            <img
              src="${product.image}"
              alt="${product.title}"
            >

          </div>

          <p class="search-result__category">
            ${product.category}
          </p>

          <h2 class="search-result__title">
            ${product.title}
          </h2>

          <span class="search-result__price">
            $${product.price.toFixed(2)}
          </span>

        </a>
      `;
    })
    .join('');
}

// ========================================
// EVENTS
// ========================================

if (searchButton) {
  searchButton.addEventListener('click', openSearch);
}

searchCloseButtons.forEach(button => {
  button.addEventListener('click', closeSearch);
});

if (searchInput) {
  searchInput.addEventListener('input', event => {
    renderSearchResults(event.target.value);
  });
}

// ========================================
// ESC KEY
// ========================================

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
    closeSearch();
  }
});
