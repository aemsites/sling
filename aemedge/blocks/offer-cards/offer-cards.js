import { createTag, getPictureUrlByScreenWidth } from '../../scripts/utils.js';
import { toClassName } from '../../scripts/aem.js';

function setupBGPictures(block) {
  const background = block.querySelector('.background');
  const pictures = Array.from(background.querySelectorAll('picture'));
  let currentPicture = getPictureUrlByScreenWidth(pictures);
  pictures.forEach((picture) => picture.parentElement.remove());
  const existingPicture = background.querySelector('picture');
  if (existingPicture) {
    existingPicture.parentElement.remove();
  }
  const bgDIV = createTag('div', { class: 'background' });
  bgDIV.append(currentPicture);
  const spanBtn = createTag('span', { class: 'backgroundlg' });
  bgDIV.append(spanBtn);
  block.prepend(bgDIV);

  window.addEventListener('resize', () => {
    const newPicture = getPictureUrlByScreenWidth(pictures);
    if (newPicture !== currentPicture) {
      currentPicture = newPicture;
      const oldPicture = block.querySelector('picture');
      if (oldPicture) {
        oldPicture.parentElement.remove();
      }
      const container = createTag('div', { class: 'background' });
      container.append(currentPicture);
      block.prepend(container);
    }
  });
}

// read the config and construct the DOM
function processBlockConfig(block) {
  const offerCardContent = createTag('div', { class: 'offer-cards-content' });
  const nonMediaDIV = createTag('div', { class: 'text-cta-container' });
  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        cols[0].classList.add('config-property');
        col.classList.add(name);
        if (name !== 'foreground') nonMediaDIV.append(col);
      }
    }
  });
  offerCardContent.append(nonMediaDIV);
  block.append(offerCardContent);
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove()); // remove config property divs from dom
}

export default function decorate(block) {
  processBlockConfig(block);
  const background = block.querySelector('.background');
  const bgColor = block.querySelector('.background-color');
  let bgMediaType;
  if (background) {
    if (background.querySelector('picture')) {
      bgMediaType = 'picture';
    }
  }
  // set the bg color on the section
  if (bgColor) {
    const section = block.closest('.section');
    if (section) {
      section.style.backgroundColor = bgColor.textContent;
    }
    bgColor.remove();
  }
  if (bgMediaType === 'picture') setupBGPictures(block);
  background.remove();
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); }); // remove empty divs
}
