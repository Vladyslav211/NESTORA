/* =========================================
   CART
========================================= */

const CART_KEY = 'nestora-cart';

/* =========================================
   GET CART
========================================= */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    console.error('Failed to load cart:', error);

    return [];
  }
}

/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  updateCartCount();
}

/* =========================================
   CART COUNT
========================================= */

function getCartCount() {
  const cart = getCart();

  return cart.reduce((total, item) => {
    return total + Number(item.quantity);
  }, 0);
}

function updateCartCount() {
  const cartCount = document.querySelector('#cart-count');

  if (!cartCount) {
    return;
  }

  const count = getCartCount();

  cartCount.textContent = count;
}

/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId, quantity = 1) {
  const cart = getCart();

  const normalizedId = String(productId);

  const existingProduct = cart.find(
    item => String(item.id) === normalizedId
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: normalizedId,
      quantity: quantity,
    });
  }

  saveCart(cart);
}

/* =========================================
   REMOVE FROM CART
========================================= */

function removeFromCart(productId) {
  const normalizedId = String(productId);

  const cart = getCart();

  const updatedCart = cart.filter(
    item => String(item.id) !== normalizedId
  );

  saveCart(updatedCart);
}

/* =========================================
   UPDATE QUANTITY
========================================= */

function updateCartQuantity(productId, quantity) {
  const normalizedId = String(productId);

  const cart = getCart();

  const item = cart.find(
    item => String(item.id) === normalizedId
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId);

    return;
  }

  item.quantity = quantity;

  saveCart(cart);
}

/* =========================================
   GET CART SUBTOTAL
========================================= */

function getCartSubtotal() {
  const cart = getCart();

  return cart.reduce((total, cartItem) => {
    const product = products.find(
      product => String(product.id) === String(cartItem.id)
    );

    if (!product) {
      return total;
    }

    return total + product.price * Number(cartItem.quantity);
  }, 0);
}

/* =========================================
   CART PAGE ELEMENTS
========================================= */

const cartItemsContainer =
  document.querySelector('#cart-items');

const cartSubtotal =
  document.querySelector('#cart-subtotal');

const cartTotal =
  document.querySelector('#cart-total');

const checkoutButton =
  document.querySelector('#checkout-button');

/* =========================================
   RENDER EMPTY CART
========================================= */

function renderEmptyCart() {
  if (!cartItemsContainer) {
    return;
  }

  cartItemsContainer.innerHTML = `
    <div class="cart-empty">

      <h2>
        Your cart is empty
      </h2>

      <p>
        Discover something beautiful for your space.
      </p>

      <a
        class="button button--primary"
        href="shop.html"
      >
        Continue shopping
      </a>

    </div>
  `;

  if (cartSubtotal) {
    cartSubtotal.textContent = '$0.00';
  }

  if (cartTotal) {
    cartTotal.textContent = '$0.00';
  }

  if (checkoutButton) {
    checkoutButton.disabled = true;
  }

  updateCartCount();
}

/* =========================================
   RENDER CART
========================================= */

function renderCart() {
  if (!cartItemsContainer) {
    updateCartCount();

    return;
  }

  const cart = getCart();

  /* EMPTY */

  if (cart.length === 0) {
    renderEmptyCart();

    return;
  }

  let subtotal = 0;

  cartItemsContainer.innerHTML = cart
    .map(cartItem => {
      const product = products.find(
        product =>
          String(product.id) === String(cartItem.id)
      );

      if (!product) {
        return '';
      }

      const quantity = Number(cartItem.quantity);

      const itemTotal = product.price * quantity;

      subtotal += itemTotal;

      return `
        <article class="cart-item">

          <div class="cart-item__image">

            <img
              src="${product.image}"
              alt="${product.title}"
            >

          </div>

          <div class="cart-item__content">

            <span class="cart-item__category">
              ${product.category}
            </span>

            <h2 class="cart-item__title">
              ${product.title}
            </h2>

            <span class="cart-item__price">
              $${product.price.toFixed(2)}
            </span>

            <div class="cart-item__controls">

              <div class="cart-item__quantity">

                <button
                  type="button"
                  data-action="decrease"
                  data-id="${product.id}"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>
                  ${quantity}
                </span>

                <button
                  type="button"
                  data-action="increase"
                  data-id="${product.id}"
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

              <button
                class="cart-item__remove"
                type="button"
                data-action="remove"
                data-id="${product.id}"
              >
                Remove
              </button>

            </div>

          </div>

          <strong class="cart-item__total">
            $${itemTotal.toFixed(2)}
          </strong>

        </article>
      `;
    })
    .join('');

  /* TOTALS */

  if (cartSubtotal) {
    cartSubtotal.textContent =
      `$${subtotal.toFixed(2)}`;
  }

  if (cartTotal) {
    cartTotal.textContent =
      `$${subtotal.toFixed(2)}`;
  }

  /* CHECKOUT */

  if (checkoutButton) {
    checkoutButton.disabled = subtotal <= 0;
  }

  /* COUNTER */

  updateCartCount();
}

/* =========================================
   CART BUTTON EVENTS
========================================= */

if (cartItemsContainer) {
  cartItemsContainer.addEventListener(
    'click',
    event => {
      const button =
        event.target.closest('button[data-action]');

      if (!button) {
        return;
      }

      const productId = button.dataset.id;

      const action = button.dataset.action;

      if (!productId) {
        return;
      }

      const cart = getCart();

      const item = cart.find(
        item =>
          String(item.id) === String(productId)
      );

      if (!item) {
        return;
      }

      /* INCREASE */

      if (action === 'increase') {
        item.quantity += 1;

        saveCart(cart);

        renderCart();

        return;
      }

      /* DECREASE */

      if (action === 'decrease') {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          removeFromCart(productId);
        } else {
          saveCart(cart);
        }

        renderCart();

        return;
      }

      /* REMOVE */

      if (action === 'remove') {
        removeFromCart(productId);

        renderCart();
      }
    }
  );
}

/* =========================================
   CHECKOUT
========================================= */

if (checkoutButton) {
  checkoutButton.addEventListener(
    'click',
    () => {
      const cart = getCart();

      if (cart.length === 0) {
        return;
      }

      window.location.href = 'checkout.html';
    }
  );
}

/* =========================================
   INITIALIZE
========================================= */

renderCart();

updateCartCount();