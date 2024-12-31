import { createTag, getPictureUrlByScreenWidth } from '../../scripts/utils.js';
import { toClassName } from '../../scripts/aem.js';

function setupBGPictures(block) {
  const background = block.querySelector('.background');
  const pictures = Array.from(background.querySelectorAll('picture'));
  let currentPicture = getPictureUrlByScreenWidth(pictures);
  // Remove video links from DOM to prevent them from showing up as text
  pictures.forEach((picture) => picture.parentElement.remove());
  const existingPicture = background.querySelector('picture');
  if (existingPicture) {
    existingPicture.parentElement.remove();
  }
  const bgDIV = createTag('div', { class: 'background' });
  bgDIV.append(currentPicture);
  block.prepend(bgDIV);

  // Resize event listener to update video based on screen size changes
  window.addEventListener('resize', () => {
    const newPicture = getPictureUrlByScreenWidth(pictures);

    // Update video only if the URL changes
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

const scrollCTAIntoHeader = (entries) => {
  entries.forEach((entry) => {
    const block = entry.target;
    const cta = block.querySelector('.cta a');
    if (entry.isIntersecting) {
      cta.classList.remove('scroll-into-header');
    } else {
      cta.classList.add('scroll-into-header');
    }
  });
};

// read the config and construct the DOM
function processBlockConfig(block) {
  const marqueContent = createTag('div', { class: 'offer-cards-content' });
  const mediaDIV = createTag('div', { class: 'foreground-container' });
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
        else mediaDIV.append(col);
      }
    }
  });

  if (mediaDIV.querySelector('.foreground')
      && mediaDIV.querySelector('.foreground').children.length > 0) {
    marqueContent.append(nonMediaDIV, mediaDIV);
  } else {
    marqueContent.append(nonMediaDIV);
  }

  block.append(marqueContent);
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove()); // remove config property divs from dom
}

export default function decorate(block) {
  processBlockConfig(block);
  const background = block.querySelector('.background');
  const bgColor = block.querySelector('.background-color');
  const scrollCTA = block.querySelector('.scroll-cta-into-header');

  // if scroll configured then toggle the respective css class
  if (scrollCTA) {
    const cta = document.querySelector('.cta a');
    if (cta) {
      const options = {
        root: null,
        threshold: 0.1,
      };
      const observer = new IntersectionObserver(scrollCTAIntoHeader, options);
      observer.observe(block);
    }
    scrollCTA.remove();
  }
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
  if (window.innerWidth < 768) {
    const divElement = document.querySelector('.bullet-items');
    if (divElement) {
      divElement.style.display = 'none';
    }
  }
  if (bgMediaType === 'picture') setupBGPictures(block);
  background.remove();
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); }); // remove empty divs
}
