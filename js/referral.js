/* =========================================
   REFERRAL TRACKING
========================================= */

const urlParams = new URLSearchParams(window.location.search);

const referralCode = urlParams.get('ref');

/* =========================================
   SAVE REFERRER
========================================= */

if (referralCode) {
  localStorage.setItem('nestora_referrer', referralCode);
}
