/* =========================================
   CHECKOUT
========================================= */

const checkoutProducts = document.querySelector('#checkout-products');
const checkoutSubtotal = document.querySelector('#checkout-subtotal');
const checkoutTotal = document.querySelector('#checkout-total');
const checkoutForm = document.querySelector('.checkout__form');
const placeOrderButton = document.querySelector('#place-order');

/* =========================================
   REWARDS ELEMENTS
========================================= */

const checkoutPointsBalance = document.querySelector(
  '#checkout-points-balance'
);

const checkoutPointsValue = document.querySelector(
  '#checkout-points-value'
);

const usePointsButton = document.querySelector('#use-points');
const removePointsButton = document.querySelector('#remove-points');
const pointsApplied = document.querySelector('#points-applied');

/* =========================================
   REFERRAL ELEMENTS
========================================= */

const referralDiscountRow = document.querySelector(
  '#referral-discount-row'
);

const referralDiscountElement = document.querySelector(
  '#referral-discount'
);

/* =========================================
   FORM FIELDS
========================================= */

const emailInput = document.querySelector('#email');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const zipInput = document.querySelector('#zip');
const countryInput = document.querySelector('#country');

/* =========================================
   STORAGE KEYS
========================================= */

const CART_KEY = 'nestora-cart';
const POINTS_KEY = 'nestora_points';
const POINTS_HISTORY_KEY = 'nestora_points_history';
const ORDERS_KEY = 'nestora_orders';

const REFERRER_KEY = 'nestora_referrer';
const REFERRAL_USED_KEY = 'nestora_referral_used';

/* =========================================
   LOYALTY SETTINGS
========================================= */

/*
  100 points = $1

  Customer can use points
  for maximum 20% of order.

  Customer earns:
  $1 spent = 10 points
*/

const POINTS_PER_DOLLAR = 100;
const MAX_POINTS_PERCENT = 0.2;
const EARN_POINTS_PER_DOLLAR = 10;

/* =========================================
   REFERRAL SETTINGS
========================================= */

/*
  Referral discount:
  $10 off first order.

  Referral can only be used once.
*/

const REFERRAL_DISCOUNT = 10;

/* =========================================
   POINTS USED
========================================= */

let pointsUsed = 0;

/* =========================================
   GET CART
========================================= */

function getCheckoutCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    console.error('Failed to load cart:', error);

    return [];
  }
}

/* =========================================
   GET CUSTOMER POINTS
========================================= */

function getCustomerPoints() {
  const points = Number(localStorage.getItem(POINTS_KEY));

  if (!Number.isFinite(points)) {
    return 0;
  }

  return Math.max(0, Math.floor(points));
}

/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

/* =========================================
   GET SUBTOTAL
========================================= */

function getCheckoutSubtotal() {
  const cart = getCheckoutCart();

  return cart.reduce((total, cartItem) => {
    const product = products.find(
      product => String(product.id) === String(cartItem.id)
    );

    if (!product) {
      return total;
    }

    const quantity = Number(cartItem.quantity);

    return total + product.price * quantity;
  }, 0);
}

/* =========================================
   GET REFERRAL DISCOUNT
========================================= */

function getReferralDiscount() {
  const subtotal = getCheckoutSubtotal();

  const referrer = localStorage.getItem(REFERRER_KEY);

  const referralUsed =
    localStorage.getItem(REFERRAL_USED_KEY) === 'true';

  /*
    No referral.
  */

  if (!referrer) {
    return 0;
  }

  /*
    Referral was already used.
  */

  if (referralUsed) {
    return 0;
  }

  /*
    Do not allow discount
    greater than subtotal.
  */

  return Math.min(REFERRAL_DISCOUNT, subtotal);
}

/* =========================================
   GET MAX USABLE POINTS
========================================= */

function getMaximumUsablePoints() {
  const subtotal = getCheckoutSubtotal();

  const referralDiscount = getReferralDiscount();

  const amountAfterReferral = Math.max(
    0,
    subtotal - referralDiscount
  );

  const availablePoints = getCustomerPoints();

  if (amountAfterReferral <= 0 || availablePoints <= 0) {
    return 0;
  }

  /*
    Maximum points discount = 20%
    of the amount remaining
    after referral discount.
  */

  const maximumDiscount =
    amountAfterReferral * MAX_POINTS_PERCENT;

  const maximumPointsByOrder = Math.floor(
    maximumDiscount * POINTS_PER_DOLLAR
  );

  return Math.min(
    availablePoints,
    maximumPointsByOrder
  );
}

/* =========================================
   GET POINTS DISCOUNT
========================================= */

function getPointsDiscount() {
  return pointsUsed / POINTS_PER_DOLLAR;
}

/* =========================================
   GET CHECKOUT TOTAL
========================================= */

function getCheckoutTotal() {
  const subtotal = getCheckoutSubtotal();

  const referralDiscount = getReferralDiscount();

  const pointsDiscount = getPointsDiscount();

  return Math.max(
    0,
    subtotal - referralDiscount - pointsDiscount
  );
}

/* =========================================
   UPDATE TOTALS
========================================= */

function updateCheckoutTotals() {
  const subtotal = getCheckoutSubtotal();

  const referralDiscount = getReferralDiscount();

  const pointsDiscount = getPointsDiscount();

  const total = Math.max(
    0,
    subtotal - referralDiscount - pointsDiscount
  );

  /* =======================================
     SUBTOTAL
  ======================================= */

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent =
      formatMoney(subtotal);
  }

  /* =======================================
     REFERRAL DISCOUNT
  ======================================= */

  if (referralDiscountRow && referralDiscountElement) {
    if (referralDiscount > 0) {
      referralDiscountRow.hidden = false;

      referralDiscountElement.textContent =
        `-${formatMoney(referralDiscount)}`;
    } else {
      referralDiscountRow.hidden = true;

      referralDiscountElement.textContent =
        '-$0.00';
    }
  }

  /* =======================================
     TOTAL
  ======================================= */

  if (checkoutTotal) {
    checkoutTotal.textContent =
      formatMoney(total);
  }
}

/* =========================================
   UPDATE REWARDS UI
========================================= */

function updateRewardsUI() {
  const availablePoints = getCustomerPoints();

  const maximumUsablePoints =
    getMaximumUsablePoints();

  const maximumUsableDiscount =
    maximumUsablePoints / POINTS_PER_DOLLAR;

  /* =======================================
     BALANCE
  ======================================= */

  if (checkoutPointsBalance) {
    checkoutPointsBalance.textContent =
      `${availablePoints.toLocaleString()} points`;
  }

  /* =======================================
     AVAILABLE REWARD
  ======================================= */

  if (checkoutPointsValue) {
    checkoutPointsValue.textContent =
      formatMoney(maximumUsableDiscount);
  }

  /* =======================================
     USE BUTTON
  ======================================= */

  if (usePointsButton) {
    usePointsButton.hidden =
      pointsUsed > 0 ||
      maximumUsablePoints <= 0;
  }

  /* =======================================
     REMOVE BUTTON
  ======================================= */

  if (removePointsButton) {
    removePointsButton.hidden =
      pointsUsed <= 0;
  }

  /* =======================================
     APPLIED MESSAGE
  ======================================= */

  if (pointsApplied) {
    if (pointsUsed > 0) {
      const discount =
        getPointsDiscount();

      pointsApplied.hidden = false;

      pointsApplied.textContent =
        `${pointsUsed.toLocaleString()} points applied — ${formatMoney(
          discount
        )} off`;
    } else {
      pointsApplied.hidden = true;

      pointsApplied.textContent = '';
    }
  }
}

/* =========================================
   APPLY POINTS
========================================= */

function applyPoints() {
  const maximumUsablePoints =
    getMaximumUsablePoints();

  if (maximumUsablePoints <= 0) {
    return;
  }

  pointsUsed = maximumUsablePoints;

  updateCheckoutTotals();
  updateRewardsUI();
}

/* =========================================
   REMOVE POINTS
========================================= */

function removePoints() {
  pointsUsed = 0;

  updateCheckoutTotals();
  updateRewardsUI();
}

/* =========================================
   REWARDS BUTTONS
========================================= */

if (usePointsButton) {
  usePointsButton.addEventListener(
    'click',
    applyPoints
  );
}

if (removePointsButton) {
  removePointsButton.addEventListener(
    'click',
    removePoints
  );
}

/* =========================================
   RENDER CHECKOUT
========================================= */

function renderCheckout() {
  if (!checkoutProducts) {
    return;
  }

  const cart = getCheckoutCart();

  /* =======================================
     EMPTY CART
  ======================================= */

  if (cart.length === 0) {
    checkoutProducts.innerHTML = `
      <div class="checkout__empty">

        <p>
          Your cart is empty.
        </p>

        <a href="shop.html">
          Continue shopping
        </a>

      </div>
    `;

    if (checkoutSubtotal) {
      checkoutSubtotal.textContent =
        '$0.00';
    }

    if (checkoutTotal) {
      checkoutTotal.textContent =
        '$0.00';
    }

    if (referralDiscountRow) {
      referralDiscountRow.hidden = true;
    }

    if (placeOrderButton) {
      placeOrderButton.disabled = true;
    }

    updateRewardsUI();

    return;
  }

  /* =======================================
     RENDER PRODUCTS
  ======================================= */

  checkoutProducts.innerHTML = cart
    .map(cartItem => {
      const product = products.find(
        product =>
          String(product.id) ===
          String(cartItem.id)
      );

      if (!product) {
        return '';
      }

      const quantity =
        Number(cartItem.quantity);

      const itemTotal =
        product.price * quantity;

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
              Qty: ${quantity}
            </span>

          </div>

          <span class="checkout__product-price">
            ${formatMoney(itemTotal)}
          </span>

        </div>
      `;
    })
    .join('');

  /* =======================================
     UPDATE TOTALS
  ======================================= */

  updateCheckoutTotals();

  /* =======================================
     UPDATE REWARDS
  ======================================= */

  updateRewardsUI();

  /* =======================================
     ENABLE CHECKOUT
  ======================================= */

  if (placeOrderButton) {
    placeOrderButton.disabled = false;
  }
}

/* =========================================
   LOAD CUSTOMER DATA
========================================= */

function loadCustomerData() {
  const savedEmail =
    localStorage.getItem(
      'nestora_customer_email'
    );

  const savedFirstName =
    localStorage.getItem(
      'nestora_customer_first_name'
    );

  const savedLastName =
    localStorage.getItem(
      'nestora_customer_last_name'
    );

  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }

  if (savedFirstName && firstNameInput) {
    firstNameInput.value = savedFirstName;
  }

  if (savedLastName && lastNameInput) {
    lastNameInput.value = savedLastName;
  }
}

/* =========================================
   GET ORDERS
========================================= */

function getOrders() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(ORDERS_KEY)
      ) || []
    );
  } catch (error) {
    console.error(
      'Failed to load orders:',
      error
    );

    return [];
  }
}

/* =========================================
   SAVE ORDERS
========================================= */

function saveOrders(orders) {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );
}

/* =========================================
   GENERATE ORDER ID
========================================= */

function generateOrderId() {
  return `NEST-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

/* =========================================
   CREATE ORDER
========================================= */

function createOrder() {
  const cart = getCheckoutCart();

  const subtotal =
    getCheckoutSubtotal();

  const referralDiscount =
    getReferralDiscount();

  const pointsDiscount =
    getPointsDiscount();

  const total = Math.max(
    0,
    subtotal -
      referralDiscount -
      pointsDiscount
  );

  return {
    id: generateOrderId(),

    date: new Date().toISOString(),

    status: 'Processing',

    subtotal: subtotal,

    shipping: 0,

    referralDiscount:
      referralDiscount,

    pointsUsed:
      pointsUsed,

    pointsDiscount:
      pointsDiscount,

    total: total,

    customer: {
      email: emailInput
        ? emailInput.value.trim()
        : '',

      firstName: firstNameInput
        ? firstNameInput.value.trim()
        : '',

      lastName: lastNameInput
        ? lastNameInput.value.trim()
        : '',

      address: addressInput
        ? addressInput.value.trim()
        : '',

      city: cityInput
        ? cityInput.value.trim()
        : '',

      zip: zipInput
        ? zipInput.value.trim()
        : '',

      country: countryInput
        ? countryInput.value
        : '',
    },

    items: cart
      .map(cartItem => {
        const product = products.find(
          product =>
            String(product.id) ===
            String(cartItem.id)
        );

        if (!product) {
          return null;
        }

        return {
          id: product.id,

          title: product.title,

          price: product.price,

          quantity:
            Number(cartItem.quantity),

          image: product.image,
        };
      })
      .filter(Boolean),
  };
}

/* =========================================
   ADD POINTS HISTORY
========================================= */

function addPointsHistory(
  title,
  amount
) {
  let history = [];

  try {
    history =
      JSON.parse(
        localStorage.getItem(
          POINTS_HISTORY_KEY
        )
      ) || [];
  } catch (error) {
    history = [];
  }

  history.push({
    title: title,

    amount: amount,

    date: new Date().toISOString(),
  });

  localStorage.setItem(
    POINTS_HISTORY_KEY,
    JSON.stringify(history)
  );
}

/* =========================================
   SPEND POINTS
========================================= */

function spendPoints(order) {
  if (pointsUsed <= 0) {
    return;
  }

  const currentPoints =
    getCustomerPoints();

  const newBalance = Math.max(
    0,
    currentPoints - pointsUsed
  );

  localStorage.setItem(
    POINTS_KEY,
    newBalance.toString()
  );

  addPointsHistory(
    `Used on order #${order.id}`,
    -pointsUsed
  );
}

/* =========================================
   EARN PURCHASE POINTS
========================================= */

function addPurchasePoints(order) {
  /*
    $1 spent = 10 points.

    Points are calculated from
    the final amount actually paid.
  */

  const earnedPoints = Math.floor(
    order.total *
      EARN_POINTS_PER_DOLLAR
  );

  if (earnedPoints <= 0) {
    return 0;
  }

  const currentPoints =
    getCustomerPoints();

  const newBalance =
    currentPoints + earnedPoints;

  localStorage.setItem(
    POINTS_KEY,
    newBalance.toString()
  );

  addPointsHistory(
    `Purchase #${order.id}`,
    earnedPoints
  );

  return earnedPoints;
}

/* =========================================
   MARK REFERRAL AS USED
========================================= */

function markReferralAsUsed() {
  const referralDiscount =
    getReferralDiscount();

  if (referralDiscount <= 0) {
    return;
  }

  localStorage.setItem(
    REFERRAL_USED_KEY,
    'true'
  );
}

/* =========================================
   PLACE ORDER
========================================= */

if (checkoutForm) {
  checkoutForm.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      /* =====================================
         CHECK CART
      ===================================== */

      const cart =
        getCheckoutCart();

      if (cart.length === 0) {
        alert(
          'Your cart is empty.'
        );

        return;
      }

      /* =====================================
         VALIDATE FORM
      ===================================== */

      if (
        !checkoutForm.checkValidity()
      ) {
        checkoutForm.reportValidity();

        return;
      }

      /* =====================================
         VALIDATE POINTS
      ===================================== */

      const maximumUsablePoints =
        getMaximumUsablePoints();

      if (
        pointsUsed >
        maximumUsablePoints
      ) {
        pointsUsed =
          maximumUsablePoints;
      }

      /* =====================================
         CREATE ORDER
      ===================================== */

      const order =
        createOrder();

      /* =====================================
         SAVE ORDER
      ===================================== */

      const orders =
        getOrders();

      orders.push(order);

      saveOrders(orders);

      /* =====================================
         SPEND POINTS
      ===================================== */

      spendPoints(order);

      /* =====================================
         EARN PURCHASE POINTS
      ===================================== */

      const earnedPoints =
        addPurchasePoints(order);

      console.log(
        `Earned ${earnedPoints} points`
      );

      /* =====================================
         MARK REFERRAL USED
      ===================================== */

      markReferralAsUsed();

      /* =====================================
         CLEAR CART
      ===================================== */

      localStorage.removeItem(
        CART_KEY
      );

      /* =====================================
         REDIRECT
      ===================================== */

      window.location.href =
        'account.html';
    }
  );
}

/* =========================================
   INITIALIZE
========================================= */

loadCustomerData();

renderCheckout();

updateRewardsUI();