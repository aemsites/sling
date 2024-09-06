import { createTag } from '../../scripts/utils.js';

const ZIPCODE_ENDPOINT = 'https://p-geo.movetv.com/geo';
const DEFAULT_ZIPCODE = '90020';
const ZIPCODE_KEY = 'user_zip';
let gqlResponse = '';

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
function showWarningMessage() {
  return `
    <div type="warning" class="warning channel-data">
      <img src="/aemedge/icons/warning-icon.svg" id="icon" class="warning-icon"/>
      <h3 class="warning-heading">
      <span>
      <p class="warning-msg">Local programming
      is not available with Sling in your area. You can still watch the Olympics on USA on-demand.
      </p>
      </span>
      </h3>
    </div>`;
}

function channelName(packages) {
  let channelDiv;
  packages.forEach((pkg) => {
    if (channelDiv !== undefined) {
      channelDiv += `<picture><img class="channel-img"
                      src="https://www.sling.com/content/dam/sling-tv/save-this/${pkg.name}.svg"></picture>`;
    } else {
      channelDiv = `<picture><img class="channel-img"
                      src="https://www.sling.com/content/dam/sling-tv/save-this/${pkg.name}.svg"></picture>`;
    }
  });
  return channelDiv;
}
async function getChannelsByZipCode(block) {
  const zipCode = block.querySelector('#zipcode').value;
  localStorage.setItem(ZIPCODE_KEY, zipCode);
  const API_ENDPOINT = 'https://webapi.p.sling.com/catalog/packages/local_and_rsn';
  try {
    const res = await fetch(`${API_ENDPOINT}?zipcode=${zipCode}`);
    const formContainer = block.querySelector('.channel-form-container');
    if (res.ok) {
      gqlResponse = await res.json();
      if (gqlResponse.packages) {
        if (block.querySelector('.channel-data')) {
          document.querySelector('.channel-data').remove();
        }
        formContainer.insertAdjacentHTML('beforeend', `
        <div class="channel-data">
        <span>
        <p>Local programming available with Sling in your area:</p>
        </span>
         <div>
         ${channelName(gqlResponse.packages)}           
        </div>
        </div>       
        `);
      }
    } else {
      console.log('response from api call', res.status);
      if (block.querySelector('.channel-data')) {
        document.querySelector('.channel-data').remove();
      }
      formContainer.insertAdjacentHTML('beforeend', showWarningMessage());
    }
  } catch (error) {
    console.log('exception in api call', error);
  }
}

export default async function decorate(block) {
  const zipCode = await getZipcode();
  const formContainer = createTag('div', { class: 'channel-form-container' });
  const spanZipInput = createTag('span', { class: 'input-container' });
  const inputTag = createTag('input', { class: 'zip-input', id: 'zipcode', value: `${zipCode}` });
  const labelTag = createTag('label', { for: 'zipcode', class: 'zipcode-input-label' });
  labelTag.innerText = 'ZIP Code';
  spanZipInput.append(inputTag);
  spanZipInput.append(labelTag);
  const spanBtn = createTag('span');
  const buttonTag = createTag('button', { class: 'submit-button', id: 'zipcodebtn' });
  buttonTag.innerText = 'SUBMIT';
  spanBtn.append(buttonTag);
  formContainer.append(spanZipInput, spanBtn);
  block.append(formContainer);
  const zipcode = block.querySelector('#zipcode');
  if (zipCode && zipcode) {
    await getChannelsByZipCode(block);
  }
  const zipcodebtn = block.querySelector('#zipcodebtn');
  if (zipcodebtn) {
    zipcodebtn.addEventListener('click', async () => {
      try {
        await getChannelsByZipCode(block);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
  }
}
