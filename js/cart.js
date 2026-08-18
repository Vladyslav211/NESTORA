const CART_KEY = 'nestora-cart';

// =========================
// GET CART
// =========================

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// =========================
// SAVE CART
// =========================

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// =========================
// ADD TO CART
// =========================

function addToCart(productId, quantity = 1) {
  const cart = getCart();

  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      quantity: quantity,
    });
  }

  saveCart(cart);
}

// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(productId) {
  const cart = getCart();

  const updatedCart = cart.filter(item => item.id !== productId);

  saveCart(updatedCart);
}

// =========================
// UPDATE QUANTITY
// =========================

function updateCartQuantity(productId, quantity) {
  const cart = getCart();

  const item = cart.find(item => item.id === productId);

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

// =========================
// CART PAGE ELEMENTS
// =========================

const cartItemsContainer = document.querySelector('#cart-items');

const cartSubtotal = document.querySelector('#cart-subtotal');

const cartTotal = document.querySelector('#cart-total');

// =========================
// RENDER CART
// =========================

function renderCart() {
  if (!cartItemsContainer) {
    return;
  }

  const cart = getCart();

  // EMPTY CART
  if (cart.length === 0) {
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

    cartSubtotal.textContent = '$0.00';
    cartTotal.textContent = '$0.00';

    return;
  }

  let subtotal = 0;

  // CREATE CART ITEMS

  cartItemsContainer.innerHTML = cart
    .map(cartItem => {
      const product = products.find(product => product.id === cartItem.id);

      // PRODUCT DOES NOT EXIST

      if (!product) {
        return '';
      }

      const itemTotal = product.price * cartItem.quantity;

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
                >
                  −
                </button>


                <span>
                  ${cartItem.quantity}
                </span>


                <button
                  type="button"
                  data-action="increase"
                  data-id="${product.id}"
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

        </article>
      `;
    })
    .join('');

  // UPDATE TOTALS

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

  cartTotal.textContent = `$${subtotal.toFixed(2)}`;
}

// =========================
// CART BUTTON EVENTS
// =========================

if (cartItemsContainer) {
  cartItemsContainer.addEventListener('click', event => {
    const button = event.target.closest('button');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const cart = getCart();

    const item = cart.find(item => item.id === productId);

    if (!item) {
      return;
    }

    // INCREASE

    if (action === 'increase') {
      item.quantity += 1;
    }

    // DECREASE

    if (action === 'decrease') {
      item.quantity -= 1;
    }

    // REMOVE

    if (action === 'remove') {
      removeFromCart(productId);

      renderCart();

      return;
    }

    saveCart(cart);

    renderCart();
  });
}

// =========================
// INITIAL RENDER
// =========================

renderCart();
