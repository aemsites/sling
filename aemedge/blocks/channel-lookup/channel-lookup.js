import {
  createTag, getZipcode, ZIPCODE_KEY, fetchPlaceholders,
} from '../../scripts/utils.js';

const placeholders = await fetchPlaceholders('aemedge', 'messages');

function showWarningMessage() {
  return `
    <div type="warning" class="warning channel-data">
      <img src="${placeholders.iconurlbase}/warning-icon.svg" id="icon" class="warning-icon"/>
      <h3 class="warning-heading">
      <span>
      <p class="warning-msg">${placeholders.localchannelwarning}</p>
      </span>
      </h3>
    </div>`;
}

function channelName(packages) {
  let channelDiv;
  packages.forEach((pkg) => {
    if (channelDiv !== undefined) {
      channelDiv += `<picture><img class="channel-img"
                      src="${placeholders.channelsurlbase}/${pkg.name.toLowerCase()}.svg"></picture>`;
    } else {
      channelDiv = `<picture><img class="channel-img"
                      src="${placeholders.channelsurlbase}/${pkg.name.toLowerCase()}.svg"></picture>`;
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
      const gqlResponse = await res.json();
      if (gqlResponse.packages) {
        if (block.querySelector('.channel-data')) {
          block.querySelector('.channel-data').remove();
        }
        formContainer.insertAdjacentHTML('beforeend', `
        <div class="channel-data">
        <span>
        <p>${placeholders.localchannelfound}</p>
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
        block.querySelector('.channel-data').remove();
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
  const inputTag = createTag('input', {
    type: 'number', class: 'zip-input', id: 'zipcode', value: `${zipCode}`,
  });
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
