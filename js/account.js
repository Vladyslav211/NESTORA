/* =========================================
   ACCOUNT AUTH
========================================= */

const isLoggedIn = localStorage.getItem('nestora_logged_in');

if (!isLoggedIn) {
  window.location.href = 'login.html';
}

/* =========================================
   ELEMENTS
========================================= */

const pointsValue = document.querySelector('#points-value');
const rewardValue = document.querySelector('#reward-value');

const rewardButtons = document.querySelectorAll('[data-reward]');

const pointsHistory = document.querySelector('.points-history');

const logoutButton = document.querySelector('#logout-button');

const copyReferralButton = document.querySelector('#copy-referral');

const referralLink = document.querySelector('#referral-link');

const referralCopied = document.querySelector('#referral-copied');

/* =========================================
   POINTS
========================================= */

let points = 4820;

/* =========================================
   UPDATE ACCOUNT
========================================= */

function updateAccount() {
  if (pointsValue) {
    pointsValue.textContent = points.toLocaleString();
  }

  if (rewardValue) {
    const dollars = points / 100;

    rewardValue.textContent = `$${dollars.toFixed(2)}`;
  }
}

/* =========================================
   REDEEM REWARD
========================================= */

rewardButtons.forEach(button => {
  button.addEventListener('click', () => {
    const requiredPoints = Number(button.dataset.reward);

    const rewardAmount = requiredPoints / 100;

    /* Not enough points */

    if (points < requiredPoints) {
      const missingPoints = requiredPoints - points;

      alert(`You need ${missingPoints.toLocaleString()} more points.`);

      return;
    }

    /* Confirm reward */

    const confirmRedeem = confirm(
      `Redeem $${rewardAmount} for ${requiredPoints.toLocaleString()} points?`
    );

    if (!confirmRedeem) {
      return;
    }

    /* Remove points */

    points -= requiredPoints;

    /* Update UI */

    updateAccount();

    /* Add history */

    addHistoryItem(
      `$${rewardAmount} reward`,
      `-${requiredPoints.toLocaleString()}`
    );
  });
});

/* =========================================
   ADD POINT HISTORY
========================================= */

function addHistoryItem(title, amount) {
  if (!pointsHistory) {
    return;
  }

  const item = document.createElement('div');

  item.className = 'points-history__item points-history__item--spent';

  item.innerHTML = `
    <div>
      <strong>${title}</strong>
      <span>Just now</span>
    </div>

    <b>${amount}</b>
  `;

  pointsHistory.prepend(item);
}

/* =========================================
   COPY REFERRAL LINK
========================================= */

if (copyReferralButton && referralLink && referralCopied) {
  copyReferralButton.addEventListener('click', async () => {
    const link = referralLink.textContent.trim();

    try {
      await navigator.clipboard.writeText(link);

      referralCopied.hidden = false;

      copyReferralButton.textContent = 'Copied';

      setTimeout(() => {
        referralCopied.hidden = true;

        copyReferralButton.textContent = 'Copy';
      }, 2000);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  });
}

/* =========================================
   LOGOUT
========================================= */

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('nestora_logged_in');

    localStorage.removeItem('nestora_customer_email');

    window.location.href = 'login.html';
  });
}

/* =========================================
   INITIAL ACCOUNT STATE
========================================= */

updateAccount();
