/* =========================================
   REFERRAL SYSTEM
========================================= */

const REFERRER_KEY = 'nestora_referrer';
const REFERRAL_CODE_KEY = 'nestora_referral_code';

/* =========================================
   GENERATE REFERRAL CODE
========================================= */

function generateReferralCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = '';

  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(
      Math.random() * characters.length
    );

    code += characters[randomIndex];
  }

  return `VLAD-${code}`;
}

/* =========================================
   GET CURRENT USER REFERRAL CODE
========================================= */

function getReferralCode() {
  let code =
    localStorage.getItem(REFERRAL_CODE_KEY);

  if (!code) {
    code = generateReferralCode();

    localStorage.setItem(
      REFERRAL_CODE_KEY,
      code
    );
  }

  return code;
}

/* =========================================
   SAVE REFERRER FROM URL
========================================= */

function saveReferrerFromUrl() {
  const urlParams =
    new URLSearchParams(window.location.search);

  const referralCode =
    urlParams.get('ref');

  if (!referralCode) {
    return;
  }

  /*
    Do not overwrite an existing referrer.
    The first referral gets the credit.
  */

  const existingReferrer =
    localStorage.getItem(REFERRER_KEY);

  if (!existingReferrer) {
    localStorage.setItem(
      REFERRER_KEY,
      referralCode
    );
  }
}

/* =========================================
   CREATE REFERRAL LINK
========================================= */

function getReferralLink() {
  const referralCode =
    getReferralCode();

  const referralUrl =
    new URL(
      'index.html',
      window.location.href
    );

  referralUrl.searchParams.set(
    'ref',
    referralCode
  );

  return referralUrl.toString();
}

/* =========================================
   RENDER REFERRAL LINK
========================================= */

function renderReferralLink() {
  const referralLinkElement =
    document.querySelector(
      '#referral-link'
    );

  if (!referralLinkElement) {
    return;
  }

  referralLinkElement.textContent =
    getReferralLink();
}

/* =========================================
   COPY REFERRAL LINK
========================================= */

function setupReferralCopy() {
  const copyButton =
    document.querySelector(
      '#copy-referral'
    );

  if (!copyButton) {
    return;
  }

  copyButton.addEventListener(
    'click',
    async () => {
      const referralLink =
        getReferralLink();

      try {
        await navigator.clipboard.writeText(
          referralLink
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
   INIT
========================================= */

saveReferrerFromUrl();
renderReferralLink();
setupReferralCopy();