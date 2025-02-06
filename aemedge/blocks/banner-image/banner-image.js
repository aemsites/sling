import { createTag } from '../../scripts/utils.js';
import { toClassName } from '../../scripts/aem.js';
import { createOptimizedBackgroundImage } from '../../scripts/scripts.js';

// read the config and construct the DOM
function processBlockConfig(block) {
  const bannerContent = createTag('div', { class: 'banner-content' });
  const mediaDIV = createTag('div', { class: 'foreground-container' });
  const nonMediaDIV = createTag('div', { class: 'text-cta-container' });
  const btnsDIV = createTag('div', { class: 'buttons-container' });
  let bgImages = [];

  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        cols[0].classList.add('config-property');
        col.classList.add(name);
        if (name === 'background') {
          if (col.dataset.align) {
            block.setAttribute('data-align', col.dataset.align);
          }
          if (col.dataset.valign) {
            block.setAttribute('data-valign', col.dataset.valign);
          }
          const pictures = Array.from(col.querySelectorAll('img[src]'));
          if (pictures.length > 0) {
            bgImages = pictures.map((source) => new URL(source.getAttribute('src'), window.location.href).href);
          }
          // when called from a FRAGMENT, the background image is not in the picture tag
          const fragPictures = Array.from(col.querySelectorAll('a[href]'));
          if (fragPictures.length > 0) {
            bgImages = fragPictures.map((source) => new URL(source.getAttribute('href'), window.location.href).href);
          }
          // set image array as data attribute for storage
          block.setAttribute('data-background', bgImages);
        }

        if (name === 'background-color') {
          block.parentElement.style.backgroundColor = col.textContent;
        }
        if (name === 'background-gradient') {
          const colorHex = col.textContent;
          const gradient = `linear-gradient(45deg, ${colorHex} 57%, transparent 95%`;
          block.parentElement.style.background = gradient;
        }
        if (name === 'background-fit') {
          block.style.backgroundSize = col.textContent;
        }
        if (name !== 'foreground') {
          if (name.trim() === 'cta' || name.trim() === 'offer-details') {
            btnsDIV.append(col);
            nonMediaDIV.append(btnsDIV);
          } else nonMediaDIV.append(col);
        } else mediaDIV.append(col);

        // Create data-analytics-props object for button only
        const dataAnalyticsProps = {};
        if (name === 'cta') {
          const anchor = col.querySelector('a');
          dataAnalyticsProps.event = 'click';
          dataAnalyticsProps.eventCategory = 'cta';
          dataAnalyticsProps.eventAction = 'click';
          if (anchor) {
            const ctaText = anchor.textContent;
            dataAnalyticsProps.eventLabel = ctaText;
          }
          block.setAttribute('data-analytics-props', JSON.stringify(dataAnalyticsProps));
        }
        if (name !== 'cta' && name !== 'offer-details' && name !== 'headline' && name !== 'sub-headline'
            && name !== 'foreground' && name !== 'background') {
          col.remove();
        }
      }
    }
  });

  if (mediaDIV.querySelector('.foreground')
      && mediaDIV.querySelector('.foreground').children.length > 0) {
    bannerContent.append(nonMediaDIV, mediaDIV);
  } else {
    bannerContent.append(nonMediaDIV);
  }
  block.append(bannerContent);
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove()); // remove config property divs from dom
}

export default function decorate(block) {
  processBlockConfig(block);
  const background = block.querySelector('.background');
  const bgColor = block.querySelector('.background-color');
  if (background) {
    createOptimizedBackgroundImage(block);
    background.remove();
  }
  // set the bg color on the section
  if (bgColor) {
    const section = block.closest('.section');
    if (section) {
      section.style.backgroundColor = bgColor.textContent;
    }
    bgColor.remove();
  }
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); }); // remove empty divs
}
