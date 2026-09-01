/* =========================================
   ACCOUNT AUTH
========================================= */

const isLoggedIn =
  localStorage.getItem('nestora_logged_in');

if (!isLoggedIn) {
  window.location.href = 'login.html';
}

/* =========================================
   ELEMENTS
========================================= */

const pointsValue =
  document.querySelector('#points-value');

const rewardValue =
  document.querySelector('#reward-value');

const customerName =
  document.querySelector('#customer-name');

const profileName =
  document.querySelector('#profile-name');

const customerEmail =
  document.querySelector('#customer-email');

const customerReferrer =
  document.querySelector('#customer-referrer');

const referrerInfo =
  document.querySelector('#referrer-info');

const rewardButtons =
  document.querySelectorAll('[data-reward]');

const pointsHistoryContainer =
  document.querySelector('#points-history');

const orderHistory =
  document.querySelector('#order-history');

const logoutButton =
  document.querySelector('#logout-button');

const copyReferralButton =
  document.querySelector('#copy-referral');

const referralLink =
  document.querySelector('#referral-link');

/* =========================================
   EDIT PROFILE ELEMENTS
========================================= */

const editProfileButton =
  document.querySelector('#edit-profile-button');

const profileEdit =
  document.querySelector('#profile-edit');

const profileForm =
  document.querySelector('#profile-form');

const cancelProfileEdit =
  document.querySelector('#cancel-profile-edit');

const profileFirstName =
  document.querySelector('#profile-first-name');

const profileLastName =
  document.querySelector('#profile-last-name');

const profileEmail =
  document.querySelector('#profile-email');

/* =========================================
   CUSTOMER DATA
========================================= */

const savedFirstName =
  localStorage.getItem(
    'nestora_customer_first_name'
  );

const savedEmail =
  localStorage.getItem(
    'nestora_customer_email'
  );

const savedReferralCode =
  localStorage.getItem(
    'nestora_referral_code'
  );

const savedReferrer =
  localStorage.getItem(
    'nestora_customer_referrer'
  );

/* =========================================
   CUSTOMER NAME
========================================= */

if (savedFirstName) {
  if (customerName) {
    customerName.textContent =
      savedFirstName;
  }

  if (profileName) {
    profileName.textContent =
      savedFirstName;
  }
}

/* =========================================
   CUSTOMER EMAIL
========================================= */

if (savedEmail && customerEmail) {
  customerEmail.textContent =
    savedEmail;
}

/* =========================================
   REFERRAL CODE
========================================= */

if (savedReferralCode && referralLink) {
  referralLink.textContent =
    `nestora.com/?ref=${savedReferralCode}`;
}

/* =========================================
   REFERRED BY
========================================= */

if (
  savedReferrer &&
  customerReferrer &&
  referrerInfo
) {
  customerReferrer.textContent =
    savedReferrer;

  referrerInfo.hidden = false;
}

/* =========================================
   EDIT PROFILE
========================================= */

if (
  editProfileButton &&
  profileEdit
) {
  editProfileButton.addEventListener(
    'click',
    () => {
      if (profileFirstName) {
        profileFirstName.value =
          localStorage.getItem(
            'nestora_customer_first_name'
          ) || '';
      }

      if (profileLastName) {
        profileLastName.value =
          localStorage.getItem(
            'nestora_customer_last_name'
          ) || '';
      }

      if (profileEmail) {
        profileEmail.value =
          localStorage.getItem(
            'nestora_customer_email'
          ) || '';
      }

      profileEdit.classList.add(
        'is-open'
      );
    }
  );
}

/* =========================================
   CANCEL PROFILE EDIT
========================================= */

if (
  cancelProfileEdit &&
  profileEdit
) {
  cancelProfileEdit.addEventListener(
    'click',
    () => {
      profileEdit.classList.remove(
        'is-open'
      );
    }
  );
}

/* =========================================
   SAVE PROFILE
========================================= */

if (
  profileForm &&
  profileEdit
) {
  profileForm.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      const firstName =
        profileFirstName
          ? profileFirstName.value.trim()
          : '';

      const lastName =
        profileLastName
          ? profileLastName.value.trim()
          : '';

      const email =
        profileEmail
          ? profileEmail.value
              .trim()
              .toLowerCase()
          : '';

      if (
        !firstName ||
        !lastName ||
        !email
      ) {
        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            'Please fill in all fields',
            'error'
          );
        }

        return;
      }

      /* SAVE */

      localStorage.setItem(
        'nestora_customer_first_name',
        firstName
      );

      localStorage.setItem(
        'nestora_customer_last_name',
        lastName
      );

      localStorage.setItem(
        'nestora_customer_email',
        email
      );

      /* UPDATE ACCOUNT */

      if (customerName) {
        customerName.textContent =
          firstName;
      }

      if (profileName) {
        profileName.textContent =
          firstName;
      }

      if (customerEmail) {
        customerEmail.textContent =
          email;
      }

      profileEdit.classList.remove(
        'is-open'
      );

      if (
        typeof showToast ===
        'function'
      ) {
        showToast(
          'Profile updated'
        );
      }
    }
  );
}

/* =========================================
   POINTS
========================================= */

let points =
  Number(
    localStorage.getItem(
      'nestora_points'
    )
  );

if (!Number.isFinite(points)) {
  points = 4820;
}

/* =========================================
   POINTS HISTORY DATA
========================================= */

let pointsHistoryData = [];

try {
  pointsHistoryData =
    JSON.parse(
      localStorage.getItem(
        'nestora_points_history'
      )
    ) || [];
} catch (error) {
  console.error(
    'Failed to load points history:',
    error
  );

  pointsHistoryData = [];
}

/* =========================================
   ORDER DATA
========================================= */

let orders = [];

try {
  orders =
    JSON.parse(
      localStorage.getItem(
        'nestora_orders'
      )
    ) || [];
} catch (error) {
  console.error(
    'Failed to load orders:',
    error
  );

  orders = [];
}

/* =========================================
   UPDATE ACCOUNT
========================================= */

function updateAccount() {
  if (pointsValue) {
    pointsValue.textContent =
      points.toLocaleString();
  }

  if (rewardValue) {
    const rewardDollars =
      points / 100;

    rewardValue.textContent =
      `$${rewardDollars.toFixed(2)}`;
  }

  localStorage.setItem(
    'nestora_points',
    points.toString()
  );
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {
  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return '';
  }

  return parsedDate.toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

/* =========================================
   POINTS HISTORY
========================================= */

function renderPointsHistory() {
  if (!pointsHistoryContainer) {
    return;
  }

  pointsHistoryContainer.innerHTML =
    '';

  if (
    pointsHistoryData.length === 0
  ) {
    pointsHistoryContainer.innerHTML = `
      <p class="points-history__empty">
        No points activity yet.
      </p>
    `;

    return;
  }

  pointsHistoryData
    .slice()
    .reverse()
    .forEach(item => {
      const historyItem =
        document.createElement(
          'div'
        );

      historyItem.className =
        'points-history__item';

      const amount =
        Number(item.amount);

      if (amount < 0) {
        historyItem.classList.add(
          'points-history__item--spent'
        );
      }

      const formattedAmount =
        amount > 0
          ? `+${amount.toLocaleString()}`
          : amount.toLocaleString();

      historyItem.innerHTML = `
        <div>
          <strong>
            ${item.title}
          </strong>

          <span>
            ${formatDate(item.date)}
          </span>
        </div>

        <b>
          ${formattedAmount}
        </b>
      `;

      pointsHistoryContainer.appendChild(
        historyItem
      );
    });
}

/* =========================================
   ADD POINT HISTORY
========================================= */

function addHistoryItem(
  title,
  amount
) {
  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    )
  ) {
    return;
  }

  pointsHistoryData.push({
    title: title,
    amount: numericAmount,
    date: new Date().toISOString(),
  });

  localStorage.setItem(
    'nestora_points_history',
    JSON.stringify(
      pointsHistoryData
    )
  );

  renderPointsHistory();
}

/* =========================================
   ORDER HISTORY
========================================= */

function renderOrders() {
  if (!orderHistory) {
    return;
  }

  orderHistory.innerHTML = '';

  if (orders.length === 0) {
    orderHistory.innerHTML = `
      <div class="order-history__empty">

        <p>No orders yet.</p>

        <a href="shop.html">
          Start shopping →
        </a>

      </div>
    `;

    return;
  }

  orders
    .slice()
    .reverse()
    .slice(0, 3)
    .forEach(order => {
      const orderItem =
        document.createElement(
          'div'
        );

      orderItem.className =
        'order-history__item';

      const total =
        Number(order.total);

      orderItem.innerHTML = `
        <div class="order-history__info">

          <strong>
            #${order.id}
          </strong>

          <span>
            ${formatDate(order.date)}
          </span>

        </div>

        <div class="order-history__meta">

          <strong>
            $${total.toFixed(2)}
          </strong>

          <span>
            ${order.status}
          </span>

        </div>
      `;

      orderHistory.appendChild(
        orderItem
      );
    });
}

/* =========================================
   ADD ORDER
========================================= */

function addOrder(
  total,
  status = 'Processing'
) {
  const numericTotal =
    Number(total);

  if (
    !Number.isFinite(
      numericTotal
    )
  ) {
    return;
  }

  const order = {
    id: `NEST-${Math.floor(
      1000 +
      Math.random() * 9000
    )}`,

    date:
      new Date().toISOString(),

    total: numericTotal,

    status: status,
  };

  orders.push(order);

  localStorage.setItem(
    'nestora_orders',
    JSON.stringify(orders)
  );

  renderOrders();
}

/* =========================================
   REDEEM REWARD
========================================= */

rewardButtons.forEach(
  button => {
    button.addEventListener(
      'click',
      () => {
        const requiredPoints =
          Number(
            button.dataset.reward
          );

        if (
          !Number.isFinite(
            requiredPoints
          )
        ) {
          return;
        }

        const rewardAmount =
          requiredPoints / 100;

        if (
          points < requiredPoints
        ) {
          const missingPoints =
            requiredPoints -
            points;

          if (
            typeof showToast ===
            'function'
          ) {
            showToast(
              `You need ${missingPoints.toLocaleString()} more points.`,
              'error'
            );
          }

          return;
        }

        const confirmed =
          confirm(
            `Redeem $${rewardAmount} for ${requiredPoints.toLocaleString()} points?`
          );

        if (!confirmed) {
          return;
        }

        points -=
          requiredPoints;

        updateAccount();

        addHistoryItem(
          `$${rewardAmount} reward`,
          -requiredPoints
        );

        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            `$${rewardAmount} reward redeemed`
          );
        }
      }
    );
  }
);

/* =========================================
   COPY REFERRAL LINK
========================================= */

if (
  copyReferralButton &&
  referralLink
) {
  copyReferralButton.addEventListener(
    'click',
    async () => {
      const link =
        referralLink.textContent.trim();

      if (!link) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          link
        );

        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            'Referral link copied'
          );
        }
      } catch (error) {
        console.error(
          'Failed to copy referral link:',
          error
        );

        if (
          typeof showToast ===
          'function'
        ) {
          showToast(
            'Failed to copy referral link',
            'error'
          );
        }
      }
    }
  );
}

/* =========================================
   LOGOUT
========================================= */

if (logoutButton) {
  logoutButton.addEventListener(
    'click',
    () => {
      localStorage.removeItem(
        'nestora_logged_in'
      );

      window.location.href =
        'login.html';
    }
  );
}

/* =========================================
   INITIALIZE
========================================= */

updateAccount();

renderPointsHistory();

renderOrders();