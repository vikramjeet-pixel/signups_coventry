(function () {
  /**
   * ==========================================================================
   * PASTE YOUR GOOGLE SHEET WEB APP URL BELOW
   * Follow the steps in `google-apps-script.js` to get your Web App URL:
   * Example: "https://script.google.com/macros/s/AKfycbx.../exec"
   * ==========================================================================
   */
  const GOOGLE_SHEET_WEB_APP_URL = 'PASTE_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';

  const form = document.getElementById('opening-signup-form');
  const formHeader = document.getElementById('form-header');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const postcodeInput = document.getElementById('postcode');
  const smsOptIn = document.getElementById('smsOptIn');
  const submitBtn = document.getElementById('submitBtn');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');

  const successBox = document.getElementById('signup-success');
  const confirmedName = document.getElementById('confirmedName');
  const confirmedEmail = document.getElementById('confirmedEmail');
  const passNumber = document.getElementById('passNumber');
  const rsvpCounter = document.getElementById('rsvpCounter');
  const resetBtn = document.getElementById('resetBtn');

  const defaultBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    fullNameInput.classList.remove('input-invalid');
    emailInput.classList.remove('input-invalid');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function generatePassCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return '#CV-' + randomNum;
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    if (isSubmitting) {
      submitBtn.innerHTML = '<span>Saving to Guestlist...</span>';
      submitBtn.style.opacity = '0.8';
    } else {
      submitBtn.innerHTML = defaultBtnHTML;
      submitBtn.style.opacity = '1';
    }
  }

  // Sync live counter with any stored signups
  try {
    const existing = JSON.parse(localStorage.getItem('star_supermarket_coventry_signups') || '[]');
    if (rsvpCounter && existing.length > 0) {
      rsvpCounter.textContent = String(148 + existing.length);
    }
  } catch (e) {
    // Ignore storage read errors
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearErrors();

    const nameVal = fullNameInput.value.trim();
    const emailVal = emailInput.value.trim();
    let valid = true;

    if (!nameVal) {
      nameError.textContent = 'Please enter your full name.';
      fullNameInput.classList.add('input-invalid');
      valid = false;
    }

    if (!emailVal || !isValidEmail(emailVal)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('input-invalid');
      valid = false;
    }

    if (!valid) {
      return;
    }

    const firstName = nameVal.split(' ')[0];
    const passCode = generatePassCode();

    const payload = {
      fullName: nameVal,
      email: emailVal,
      phone: phoneInput.value.trim(),
      postcode: postcodeInput.value.trim().toUpperCase(),
      voucherOptIn: smsOptIn.checked ? 'Yes' : 'No',
      passCode: passCode,
      timestamp: new Date().toISOString()
    };

    setSubmitting(true);

    // Send to Google Drive Sheet via Google Apps Script Web App
    if (
      GOOGLE_SHEET_WEB_APP_URL &&
      GOOGLE_SHEET_WEB_APP_URL !== 'PASTE_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'
    ) {
      try {
        await fetch(GOOGLE_SHEET_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      } catch (networkErr) {
        console.warn('Could not reach Google Sheet endpoint:', networkErr);
      }
    }

    // Also store locally as backup
    try {
      const existing = JSON.parse(localStorage.getItem('star_supermarket_coventry_signups') || '[]');
      existing.push(payload);
      localStorage.setItem('star_supermarket_coventry_signups', JSON.stringify(existing));
      if (rsvpCounter) {
        rsvpCounter.textContent = String(148 + existing.length);
      }
    } catch (e) {
      if (rsvpCounter) {
        rsvpCounter.textContent = String(parseInt(rsvpCounter.textContent, 10) + 1);
      }
    }

    setSubmitting(false);

    confirmedName.textContent = firstName;
    confirmedEmail.textContent = emailVal;
    passNumber.textContent = passCode;

    if (formHeader) formHeader.hidden = true;
    form.hidden = true;
    successBox.hidden = false;
  });

  fullNameInput.addEventListener('input', function () {
    if (fullNameInput.classList.contains('input-invalid')) {
      nameError.textContent = '';
      fullNameInput.classList.remove('input-invalid');
    }
  });

  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('input-invalid')) {
      emailError.textContent = '';
      emailInput.classList.remove('input-invalid');
    }
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    clearErrors();
    successBox.hidden = true;
    if (formHeader) formHeader.hidden = false;
    form.hidden = false;
    fullNameInput.focus();
  });
})();
