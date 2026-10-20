/* Contact form enhancements: character counter only.
 * Delivery uses the standard FormSubmit POST action for better reliability on a static portfolio. */
(() => {
  'use strict';
  document.addEventListener('input', (event) => {
    if (event.target?.id !== 'inquiry-message') return;
    const counter = document.getElementById('message-count');
    if (counter) counter.textContent = `${event.target.value.length} / 3000`;
  });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest?.('#inquiry-form');
    if (!form) return;
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }
    const status = form.querySelector('#form-status');
    const btn = form.querySelector('button[type="submit"] span');
    if (status) status.textContent = 'Opening secure delivery… please complete the send in the new tab.';
    if (btn) btn.textContent = 'Opening…';
    setTimeout(() => {
      if (btn) btn.textContent = 'Send message';
      if (status) status.textContent = 'After you click send, the form opens securely and forwards the message to my email.';
    }, 3000);
  });
})();
