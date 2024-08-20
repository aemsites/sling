import { createTag } from '../../scripts/utils.js';

const ZIPCODE_ENDPOINT = 'https://p-geo.movetv.com/geo';
const DEFAULT_ZIPCODE = '90020';
const ZIPCODE_KEY = 'user_zip';

export async function getZipcode() {
  let zipcode = localStorage.getItem(ZIPCODE_KEY);
  if (!zipcode) {
    const response = await fetch(ZIPCODE_ENDPOINT);
    const data = await response.json();
    zipcode = data?.zip_code || DEFAULT_ZIPCODE;
    localStorage.setItem(ZIPCODE_KEY, zipcode);
  }
  return zipcode;
}

const closeForm = (e, block) => {
  e.preventDefault();
  block.querySelector('.geo-form-container').remove();
};

const updateZip = (e, block) => {
  e.preventDefault();
  const zipinput = block.querySelector(':scope  .zip-input').value;
  localStorage.setItem(ZIPCODE_KEY, zipinput);
  block.querySelector('.geo-form-container').remove();
  // create custom event and dispatch it
  const options = { bubbles: true, detail: { zipcode: zipinput } };
  const zipUpdateEvent = new CustomEvent('zipupdate', options);
  document.dispatchEvent(zipUpdateEvent);
};

const toggleGeoSelector = (e, zipCode, block) => {
  let form = block.querySelector(':scope .geo-selector-form');
  const arrowimg = block.querySelector(':scope .geo-selector > img');
  if (form) {
    block.querySelector('.geo-form-container').remove();
    arrowimg.src = '/aemedge/icons/geo-down-arrow.svg';
  } else {
    form = createTag('div', { class: 'geo-selector-form' });
    form.innerHTML = `<div class="geo-form-wrapper"><div class="form-close"><button aria-label="close" class="form-close-btn"><img src="/aemedge/icons/close.svg" /></button></div><div class="form-header"><span>Update ZIP Code</span></div><div class="form-info-text"><span>Channel availability is dependent on your location. Please enter your billing ZIP code to check your area's lineup.</span></div><form class="geo-form"><div class="geo-form-input"><input data-reference-id="billing-form-zip-field" name="zip-input-field" id="zip-input-field" type="text" class="zip-input" value="${zipCode}" /><label for="zip-input-field" value="${zipCode}" class="zip-input-label">Billing ZIP Code</label></div><div class="zip-update"><button class="zip-update-btn" data-test-id="locals-zip-form-modal-button-button" id="zip-modal-button"> <span class="zip-update-btn-txt">UPDATE</span></button></div></form></div>`;
    const formcontainer = createTag('div', { class: 'geo-form-container' });
    const whitearrow = createTag('div', { class: 'white-arrow-background' });
    formcontainer.append(whitearrow, form);
    block.append(formcontainer);
    arrowimg.src = '/aemedge/icons/geo-up-arrow.svg';
    const updateBtn = block.querySelector(':scope .zip-update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', (event) => updateZip(event, block));
    }

    const closeBtn = block.querySelector('.form-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (clickevent) => closeForm(clickevent, block));
    }
  }
};

export default async function decorate(block) {
  const zipCode = await getZipcode();
  setTimeout(() => {
    const zipcodewrapper = document.querySelectorAll('.zipcode-wrapper');
    if (!zipcodewrapper[1]) {
      block.innerHTML = `
      <div class="geo-container">
            <div class="geo-pin">
                <img src ="/aemedge/icons/geo-pin.svg" alt="Current Zipcode" /> 
            </div>
            <div class="geo-text">
                <span>${zipCode}</span> 
            </div>
            <div class="geo-selector">
                <img src ="/aemedge/icons/geo-down-arrow.svg" alt="Change Zipcode"/>
            </div>
        </div>
     `;
      document.addEventListener('zipupdate', () => {
        decorate(block);
      });
      const container = block.querySelector(':scope .geo-container');
      if (container) {
        for (let i = 0; i < container.children.length; i += 1) {
          container.children[i].addEventListener('click', (e) => toggleGeoSelector(e, zipCode, block));
        }
      }
    } else {
      block.innerHTML = `
      <div class="zipcodemodal">
        <label> ZIP Code </label>
        <input 
            type="text" 
            id="zipcodeinput"
        </>
      </div>
     `;
    }
  }, 100);
}
