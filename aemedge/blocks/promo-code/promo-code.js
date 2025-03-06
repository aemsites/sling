import { createTag, fetchPlaceholders } from '../../scripts/utils.js';
import { toClassName } from '../../scripts/aem.js';
// read the config and construct the DOM
const placeholders = await fetchPlaceholders('aemedge', 'messages');
function showErrorMessage() {
  return `
    <div type="error" class="error channel-data">
      <img src="${placeholders.erroriconurl}/error-icon.svg" id="icon" class="error-icon"/>
      <h3 class="error-heading">
      <span>
      <p>${placeholders.promocodeerror}</p>
      </span>
      </h3>
    </div>`;
}
async function validatePromoCode(block) {
  const promoCode = block.querySelector('#promocode').value;
  const promoCodeContainer = block.querySelector('.promo-code-content');

  const API_ENDPOINT = 'https://webapi.p.sling.com/ums/v5/promotions/validate?client_application=ottweb&format=json&locale=en&token=';
  try {
    const data = {
      id: promoCode,
    };
    const res = await fetch(`${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const gqlResponse = await res.json();
      console.log(gqlResponse);
    } else {
      if (res.status === 409) {
        if (!promoCodeContainer.innerHTML.includes(`${placeholders.promocodeerror}`)) {
          promoCodeContainer.insertAdjacentHTML('afterbegin', showErrorMessage());
        }
      }
      console.log('response from api call', res.status);
    }
  } catch (error) {
    console.log('exception in api call', error);
  }
}

function processBlockConfig(block) {
  const promoCodeContent = createTag('div', { class: 'promo-code-content' });
  const promoCodeDiv = createTag('div', { class: 'text-cta-container' });
  const divPromoCodeInput = createTag('div', { class: 'input-container' });
  const ctaDiv = createTag('div', { class: 'cta-container' });
  const inputTag = createTag('input', {
    type: 'text', class: 'promocodeinput', id: 'promocode', placeholder: ' ',
  });
  const labelTag = createTag('label', { for: 'promocode', class: 'input-label' });
  const buttonTag = createTag('button', { class: 'buttons-container', id: 'promoCodeBtn' });

  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        cols[0].classList.add('config-property');
        col.classList.add(name);

        if (name.trim() === 'validatebutton-text') {
          buttonTag.innerText = col.innerText;
          const elements = document.querySelectorAll('.validatebutton-text');
          elements.forEach((element) => {
            element.remove(); // Remove each div with the "remove-me" class
          });
          ctaDiv.append(buttonTag);
          promoCodeDiv.append(ctaDiv);
        } else if (name.trim() === 'placeholder-text') {
          labelTag.innerText = col.innerText;
          const elements = document.querySelectorAll('.placeholder-text');
          elements.forEach((element) => {
            element.remove(); // Remove each div with the "remove-me" class
          });
          divPromoCodeInput.append(inputTag);
          divPromoCodeInput.append(labelTag);
          ctaDiv.append(divPromoCodeInput);
          promoCodeDiv.append(ctaDiv);
        } else promoCodeDiv.append(col);
      }
    }
  });

  promoCodeContent.append(promoCodeDiv);
  block.append(promoCodeContent);
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove()); // remove config property divs from dom
}

export default function decorate(block) {
  processBlockConfig(block);
  const validateBtn = block.querySelector('#promoCodeBtn');
  if (validateBtn) {
    validateBtn.addEventListener('click', async () => {
      try {
        await validatePromoCode(block);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
  }
}
