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
  // data-analytics-props="{'event':'click','eventCategory':'cta','eventAction':'click','eventLabel':'${ctaText}'}"
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
          // if (extImageUrl.matches) {
          //   bgImages = Array.from(pictures).map((source) => source.getAttribute('src'));
          //   console.log('external images', bgImages);
          // } else { // local image
            bgImages = pictures.map((source) => new URL(source.getAttribute('src'), window.location.href).href);
        //  }
          // set image array as data attribute for storage
          block.setAttribute('data-background', bgImages);

        //   const extImageUrl = /dish\.scene7\.com|\/aemedge\/svgs\//;
        //   const pictures = Array.from(col.querySelectorAll('picture > source:nth-child(2)'));
        //   const additionalSources = Array.from(col.querySelectorAll('img[src]')); // Example of additional sources
        //
        //   const bgImages = pictures
        //     .map((source) => new URL(source.getAttribute('srcset'), window.location.href).href)
        //     .concat(
        //       additionalSources
        //         .filter((img) => extImageUrl.test(img.src))
        //         .map((img) => new URL(img.src, window.location.href).href),
        //     );
         }

        if (name === 'background-color') {
          block.parentElement.style.backgroundColor = col.textContent
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
    if (background.querySelector('picture')) {
      createOptimizedBackgroundImage(block);
      background.remove();
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
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); }); // remove empty divs
}
