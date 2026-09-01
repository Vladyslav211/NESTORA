/* =========================================
   WISHLIST
========================================= */

const WISHLIST_KEY = 'nestora_wishlist';

/* =========================================
   GET WISHLIST
========================================= */

function getWishlist() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(WISHLIST_KEY)
      ) || []
    );
  } catch (error) {
    console.error(
      'Failed to load wishlist:',
      error
    );

    return [];
  }
}

/* =========================================
   SAVE WISHLIST
========================================= */

function saveWishlist(wishlist) {
  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(wishlist)
  );
}

/* =========================================
   CHECK PRODUCT
========================================= */

function isInWishlist(productId) {
  const wishlist = getWishlist();

  return wishlist.some(
    id => String(id) === String(productId)
  );
}

/* =========================================
   UPDATE WISHLIST COUNT
========================================= */

function updateWishlistCount() {
  const wishlistCount =
    document.querySelector('#wishlist-count');

  if (!wishlistCount) {
    return;
  }

  const wishlist = getWishlist();

  wishlistCount.textContent =
    wishlist.length;
}

/* =========================================
   ADD
========================================= */

function addToWishlist(productId) {
  const wishlist = getWishlist();

  const normalizedId =
    String(productId);

  if (
    wishlist.some(
      id => String(id) === normalizedId
    )
  ) {
    return;
  }

  wishlist.push(normalizedId);

 saveWishlist(wishlist);

updateWishlistButtons();
updateWishlistCount();
renderWishlist();

if (typeof showToast === 'function') {
  showToast('Added to wishlist');
}
}

/* =========================================
   REMOVE
========================================= */

function removeFromWishlist(productId) {
  const normalizedId =
    String(productId);

  const wishlist = getWishlist();

  const updatedWishlist =
    wishlist.filter(
      id => String(id) !== normalizedId
    );

  saveWishlist(updatedWishlist);

updateWishlistButtons();
updateWishlistCount();
renderWishlist();

if (typeof showToast === 'function') {
  showToast('Removed from wishlist');
}
}

/* =========================================
   TOGGLE
========================================= */

function toggleWishlist(productId) {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }
}

/* =========================================
   UPDATE BUTTONS
========================================= */

function updateWishlistButtons() {
  const buttons =
    document.querySelectorAll(
      '[data-wishlist]'
    );

  buttons.forEach(button => {
    const productId =
      button.dataset.wishlist;

    const active =
      isInWishlist(productId);

    button.classList.toggle(
      'is-active',
      active
    );

    button.textContent =
      active ? '♥' : '♡';

    button.setAttribute(
      'aria-pressed',
      String(active)
    );

    button.setAttribute(
      'aria-label',
      active
        ? 'Remove from wishlist'
        : 'Add to wishlist'
    );
  });
}

/* =========================================
   CREATE WISHLIST CARD
========================================= */

function createWishlistCard(product) {
  return `
    <article class="wishlist-card">

      <div class="wishlist-card__image">

        <a href="product.html?id=${product.id}">
          <img
            src="${product.image}"
            alt="${product.title}"
          />
        </a>

        <button
          class="wishlist-card__remove"
          type="button"
          data-remove-wishlist="${product.id}"
          aria-label="Remove ${product.title} from wishlist"
        >
          ♥
        </button>

      </div>

      <div class="wishlist-card__content">

        <span class="wishlist-card__category">
          ${product.category}
        </span>

        <a href="product.html?id=${product.id}">
          <h2 class="wishlist-card__title">
            ${product.title}
          </h2>
        </a>

        <div class="wishlist-card__rating">

          <span>
            ★★★★★
          </span>

          <span>
            (${product.reviews})
          </span>

        </div>

        <div class="wishlist-card__price">

          <span>
            $${product.price.toFixed(2)}
          </span>

          ${
            product.oldPrice
              ? `
                <del>
                  $${product.oldPrice.toFixed(2)}
                </del>
              `
              : ''
          }

        </div>

        <button
          class="wishlist-card__cart"
          type="button"
          data-add-cart="${product.id}"
        >
          Add to cart
        </button>

      </div>

    </article>
  `;
}

/* =========================================
   RENDER WISHLIST
========================================= */

function renderWishlist() {
  const container =
    document.querySelector(
      '#wishlist-products'
    );

  if (!container) {
    return;
  }

  const wishlist =
    getWishlist();

  /* =======================================
     EMPTY
  ======================================= */

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="wishlist-empty">

        <h2>
          Your wishlist is empty
        </h2>

        <p>
          Save pieces you love and come back to them later.
        </p>

        <a
          class="button button--primary"
          href="shop.html"
        >
          Discover products
        </a>

      </div>
    `;

    return;
  }

  /* =======================================
     PRODUCTS
  ======================================= */

  const wishlistProducts =
    wishlist
      .map(id =>
        products.find(
          product =>
            String(product.id) ===
            String(id)
        )
      )
      .filter(Boolean);

  container.innerHTML =
    wishlistProducts
      .map(createWishlistCard)
      .join('');
}

/* =========================================
   REMOVE BUTTON
========================================= */

document.addEventListener(
  'click',
  event => {
    const button =
      event.target.closest(
        '[data-remove-wishlist]'
      );

    if (!button) {
      return;
    }

    const productId =
      button.dataset.removeWishlist;

    removeFromWishlist(productId);
  }
);

/* =========================================
   ADD TO CART
========================================= */

document.addEventListener(
  'click',
  event => {
    const button =
      event.target.closest(
        '[data-add-cart]'
      );

    if (!button) {
      return;
    }

    const productId =
      button.dataset.addCart;

    if (
      typeof addToCart ===
      'function'
    ) {
      addToCart(productId, 1);

      button.textContent =
        'Added';

      setTimeout(() => {
        button.textContent =
          'Add to cart';
      }, 1500);
    }
  }
);

/* =========================================
   WISHLIST BUTTONS
========================================= */

document.addEventListener(
  'click',
  event => {
    const button =
      event.target.closest(
        '[data-wishlist]'
      );

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const productId =
      button.dataset.wishlist;

    if (!productId) {
      return;
    }

    toggleWishlist(productId);
  }
);

/* =========================================
   INITIALIZE
========================================= */

renderWishlist();

updateWishlistButtons();

updateWishlistCount();