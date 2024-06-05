import { createTag } from '../../scripts/utils.js';

const checkInput = (e) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const input = e.target;
  const label = document.querySelector('.form-container form label.email-placeholder');
  const errorMsg = document.querySelector('.form-container form p.error-msg');
  if (input.value) {
    label.classList.add('email-filled');
    input.classList.remove('invalid');
    if (!input.value.match(emailRegex)) {
      errorMsg.innerText = 'Please enter a valid email address';
      errorMsg.classList.add('show');
      return;
    }
    errorMsg.classList.remove('show');
  } else {
    label.classList.remove('email-filled');
    input.classList.add('invalid');
    errorMsg.innerText = 'Required';
    errorMsg.classList.add('show');
  }
};

export default function decorate(block) {
  const h1Container = createTag('div', {
    class: 'heading-container',
  });

  const headingTxt = createTag('h1', { class: 'subscr-email-heading' });
  headingTxt.innerText = 'Get the Best of Sling In Your Inbox!';
  h1Container.append(headingTxt);

  const formContainer = createTag('div', {
    class: 'form-container',
  });
  const emailForm = createTag('form', {
    method: 'post',
  });
  const emailInput = createTag('input', { class: 'email-input', type: 'email', value: '' });
  emailInput.addEventListener('blur', checkInput);

  const errorMsg = createTag('p', { class: 'error-msg' });
  errorMsg.innerText = 'Required';

  const emailPlaceholder = createTag('label', { class: 'email-placeholder' });
  emailPlaceholder.innerText = 'Your Email Address';

  const submitBtn = createTag('button', { class: 'email-submit-btn' });
  submitBtn.innerHTML = '<span class=\'subscribe-btn-txt\'>SUBSCRIBE</span>';

  const footNote = createTag('p', { class: 'email-foot-note' });
  footNote.innerText = 'By subscribing, you agree to receive emails from Sling. No spam, we promise! You may unsubscribe at any time.';

  emailForm.append(emailInput, errorMsg, emailPlaceholder, submitBtn);
  formContainer.append(emailForm);
  block.querySelector('div').replaceWith(h1Container, formContainer);
}
