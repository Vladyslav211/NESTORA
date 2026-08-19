const checkoutProducts = document.querySelector('#checkout-products');
const checkoutSubtotal = document.querySelector('#checkout-subtotal');
const checkoutTotal = document.querySelector('#checkout-total');

function renderCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    checkoutProducts.innerHTML = `
      <p>
        Your cart is empty.
      </p>

      <a href="shop.html">
        Continue shopping
      </a>
    `;

    checkoutSubtotal.textContent = '$0.00';
    checkoutTotal.textContent = '$0.00';

    return;
  }

  let subtotal = 0;

  checkoutProducts.innerHTML = cart
    .map(cartItem => {
      const product = products.find(product => product.id === cartItem.id);

      if (!product) {
        return '';
      }

      const itemTotal = product.price * cartItem.quantity;

      subtotal += itemTotal;

      return `
        <div class="checkout__product">

          <div class="checkout__product-image">
            <img
              src="${product.image}"
              alt="${product.title}"
            >
          </div>

          <div>
            <p class="checkout__product-name">
              ${product.title}
            </p>

            <span class="checkout__product-quantity">
              Qty: ${cartItem.quantity}
            </span>
          </div>

          <span class="checkout__product-price">
            $${itemTotal.toFixed(2)}
          </span>

        </div>
      `;
    })
    .join('');

  checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;

  checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
}

renderCheckout();
