import {
  buildBlock,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  decorateBlock,
  loadBlock,
  toClassName,
  loadScript,
} from './aem.js';

import {
  buildBlogBreadcrumb,
  buildPopularBlogs,
  getPageType,
  buildFragmentBlocks,
  createTag,
  loadGameFinders,
  loadPackageCards,
  linkTextIncludesHref,
  centerHeadlines,
  buildVideoBlocks,
} from './utils.js';

const LCP_BLOCKS = ['category']; // add your LCP blocks to the list
const TEMPLATES = ['blog-article', 'blog-category']; // add your templates here
const TEMPLATE_META = 'template';
const EXT_IMAGE_URL = /dish\.scene7\.com|\/aemedge\/svgs\//;

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const pictures = main.querySelectorAll('picture');
  if ((getPageType() === 'blog' && pictures?.length > 0) || (getPageType() === 'category' && pictures?.length > 0)) {
    const h1 = main.querySelector('h1');
    const images = [];
    if (h1) {
      h1.classList.add('blog-primary-title');
      if (pictures.length >= 2) {
        main.querySelectorAll('picture').forEach((image, idx) => {
          // eslint-disable-next-line no-bitwise
          if (h1 && (h1.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_PRECEDING)) {
            images.push(image);
            if (idx === 0) {
              image.classList.add('desktop');
              // load desktop image eager on desktop
              const mquery = window.matchMedia('(min-width: 769px)');
              if (mquery.matches) {
                image.querySelector('img').setAttribute('loading', 'eager');
              } else {
                image.querySelector('img').setAttribute('loading', 'lazy');
              }
            }
            if (idx === 1) {
              image.classList.add('mobile');
              // load mobile image eager on mobile
              const mquery = window.matchMedia('(max-width: 768px)');
              if (mquery.matches) {
                image.querySelector('img').setAttribute('loading', 'eager');
              } else {
                image.querySelector('img').setAttribute('loading', 'lazy');
              }
            }
          }
        });
      } else if (pictures.length === 1) {
        const image = main.querySelector('picture');
        if (h1 && (h1.compareDocumentPosition(image) && Node.DOCUMENT_POSITION_PRECEDING)) {
          images.push(image);

          image.classList.add('desktop,mobile');
          // load desktop image eager on desktop
          const mquery = window.matchMedia('(min-width: 769px)');
          if (mquery.matches) {
            image.querySelector('img').setAttribute('loading', 'eager');
          } else {
            image.querySelector('img').setAttribute('loading', 'lazy');
          }
        }
      }
      if (getPageType() === 'blog') {
        const section = document.createElement('div');
        section.append(buildBlock('blog-hero', { elems: images }));
        const breadCrumb = buildBlogBreadcrumb();
        if (breadCrumb) {
          breadCrumb.classList.add('blog-details-breadcrumb');
          section.append(breadCrumb);
        }
        section.append(h1);
        main.prepend(section);
      }
    } else if (pictures.length >= 2) {
      main.querySelectorAll('picture').forEach((image, idx) => {
        // eslint-disable-next-line no-bitwise
        images.push(image);
        if (idx === 0) {
          image.classList.add('desktop');
          // load desktop image eager on desktop
          const mquery = window.matchMedia('(min-width: 769px)');
          if (mquery.matches) {
            image.querySelector('img').setAttribute('loading', 'eager');
          } else {
            image.querySelector('img').setAttribute('loading', 'lazy');
          }
        }
        if (idx === 1) {
          image.classList.add('mobile');
          // load mobile image eager on mobile
          const mquery = window.matchMedia('(max-width: 768px)');
          if (mquery.matches) {
            image.querySelector('img').setAttribute('loading', 'eager');
          } else {
            image.querySelector('img').setAttribute('loading', 'lazy');
          }
        }
      });
    } else if (pictures.length === 1) {
      const image = main.querySelector('picture');

      images.push(image);

      image.classList.add('desktop,mobile');
      // load desktop image eager on desktop
      const mquery = window.matchMedia('(min-width: 769px)');
      if (mquery.matches) {
        image.querySelector('img').setAttribute('loading', 'eager');
      } else {
        image.querySelector('img').setAttribute('loading', 'lazy');
      }
    }
  }
}

function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');

    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

export function buildMultipleButtons(main) {
  const buttons = main.querySelectorAll('.button-container:not(.subtext)');

  buttons.forEach((button) => {
    const parent = button.parentElement;
    const siblingButton = button.nextElementSibling;

    if (siblingButton && siblingButton.classList.contains('subtext') && !parent.classList.contains('combined')) {
      const buttonContainer = createTag('div', { class: 'button-container combined' });
      parent.insertBefore(buttonContainer, button);
      buttonContainer.append(button, siblingButton);
    }

    if (siblingButton && siblingButton.classList.contains('button-container') && !siblingButton.classList.contains('subtext')) {
      const nextSibling = siblingButton.nextElementSibling;
      if (nextSibling && !nextSibling.classList.contains('subtext') && !parent.classList.contains('buttons-container')) {
        const buttonContainer = createTag('div', { class: 'buttons-container' });
        parent.insertBefore(buttonContainer, button);
        buttonContainer.append(button, siblingButton);
      }
    }
  });

  const buttonGroups = main.querySelectorAll('div.button-container.combined');
  buttonGroups.forEach((buttonGroup) => {
    const parent = buttonGroup.parentElement;
    const siblingButton = buttonGroup.nextElementSibling;
    const siblingUp = buttonGroup.previousElementSibling;

    if (!parent.classList.contains('buttons-container')) {
      if (siblingButton && siblingButton.classList.contains('combined')) {
        const buttonContainer = createTag('div', { class: 'buttons-container' });
        parent.insertBefore(buttonContainer, buttonGroup);
        buttonContainer.append(buttonGroup, siblingButton);
      }
      if (siblingButton && siblingButton.classList.contains('button-container') && !siblingButton.classList.contains('combined')) {
        const buttonContainer = createTag('div', { class: 'buttons-container' });
        parent.insertBefore(buttonContainer, buttonGroup);
        buttonContainer.append(buttonGroup, siblingButton);
      }
      if (siblingUp && siblingUp.classList.contains('button-container') && !siblingUp.classList.contains('combined')) {
        const buttonContainer = createTag('div', { class: 'buttons-container' });
        parent.insertBefore(buttonContainer, buttonGroup);
        buttonContainer.append(siblingUp, buttonGroup);
      }
    }
  });
}

/**
 * Sets an optimized background image for a given section element.
 * This function takes into account the device's viewport width and device pixel ratio
 * to choose the most appropriate image from the provided breakpoints.
 *
 * @param {HTMLElement} section - The section element to which the background image will be applied.
 * @param {string} bgImage - The base URL of the background image.
 * @param {Array<{width: string, media?: string}>} [breakpoints=[
 *  { width: '450' },
 *   { media: '(min-width: 450px)', width: '750' },
 *   { media: '(min-width: 768px)', width: '1024' },
 *   { media: '(min-width: 1024px)', width: '1600' },
 *   { media: '(min-width: 1600px)', width: '2200' },
 * ]] - An array of breakpoint objects. Each object contains a `width` which is the width of the
 * image to request, and an optional `media` which is a media query string indicating when this
 * breakpoint should be used.
 */

export const resizeListeners = new WeakMap();
export function getBackgroundImage(element) {
  const sectionData = element.dataset.background;
  const bgImages = sectionData.split(',').map((img) => img.trim());
  return (bgImages.length === 1
    || (window.innerWidth > 1024 && bgImages.length === 2)) ? bgImages[0] : bgImages[1];
}

export function createOptimizedBackgroundImage(element, breakpoints = [
  { width: '450' },
  { media: '(min-width: 450px)', width: '768' },
  { media: '(min-width: 768px)', width: '1024' },
  { media: '(min-width: 1024px)', width: '1600' },
  { media: '(min-width: 1600px)', width: '2000' },
]) {
  const updateBackground = () => {
    const bgImage = getBackgroundImage(element);
    const pathname = EXT_IMAGE_URL.test(bgImage)
      ? bgImage
      : new URL(bgImage, window.location.href).pathname;

    const matchedBreakpoint = breakpoints
      .filter((br) => !br.media || window.matchMedia(br.media).matches)
      .reduce((acc, curr) => (parseInt(curr.width, 10)
      > parseInt(acc.width, 10) ? curr : acc), breakpoints[0]);

    const adjustedWidth = matchedBreakpoint.width * window.devicePixelRatio;
    element.style.backgroundImage = EXT_IMAGE_URL.test(bgImage) ? `url(${pathname}`
      : `url(${pathname}?width=${adjustedWidth}&format=webply&optimize=highest)`;
  };

  if (resizeListeners.has(element)) {
    window.removeEventListener('resize', resizeListeners.get(element));
  }
  resizeListeners.set(element, updateBackground);
  window.addEventListener('resize', updateBackground);
  updateBackground();
}

function decorateStyledSections(main) {
  Array.from(main.querySelectorAll('.section[data-background]')).forEach((section) => {
    createOptimizedBackgroundImage(section);
  });
}

/**
 * consolidate the first two divs in a section into two columns
 * Special case for when there is 1 fragment-wrapper
 * @param main
 */

function makeTwoColumns(main) {
  const sections = main.querySelectorAll('.section.columns-2');
  let columnTarget;
  let columnTwoItems;
  sections.forEach((section) => {
    const fragmentSections = section.querySelector('.fragment-wrapper');
    const columnOne = document.createElement('div');
    columnOne.classList.add('column-1');
    const columnTwo = document.createElement('div');
    columnTwo.classList.add('column-2');

    if (!fragmentSections) {
      const children = Array.from(section.children);
      children.forEach((child, index) => {
        if (index % 2 === 0) {
          columnOne.append(child);
        } else {
          columnTwo.append(child);
        }
      });

      // section.innerHTML = ''; // any extra divs are removed
      section.append(columnOne, columnTwo);
    } else {
      // 1 fragment-wrapper div plus 1 default content div only
      columnTarget = section.querySelector('.fragment-wrapper');
      columnOne.append(...columnTarget.children);
      columnTwoItems = section.querySelector('div');
      columnTwo.append(columnTwoItems);
      section.append(columnOne, columnTwo);
    }
  });
}

async function buildGlobalBanner(main) {
  const banner = getMetadata('global-banner');
  if (banner) {
    const bannerURL = new URL(banner);
    const bannerPath = bannerURL.pathname;
    if (bannerURL) {
      const bannerLink = createTag('a', { href: bannerPath }, bannerPath);
      const fragment = buildBlock('fragment', [[bannerLink]]);
      const section = createTag('div', { class: 'section' });
      const wrapper = document.createElement('div');
      wrapper.append(fragment);
      section.append(wrapper);
      main.prepend(section);
      decorateBlock(fragment);
      await loadBlock(fragment);
    }
  }
}

async function setNavType() {
  const nav = getMetadata('nav');
  if (nav && nav.includes('nav-without-topnav')) {
    const header = document.querySelector('header');
    header?.classList.add('nav-without-topnav');
  }
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent && !a.href.includes('/fragments/') && !EXT_IMAGE_URL.test(a.href)) {
      const hasIcon = a.querySelector('.icon');
      if (hasIcon || a.querySelector('img')) return;

      const up = a.parentElement;
      const twoup = up.parentElement;
      const threeup = twoup.parentElement;
      const childTag = a?.firstChild?.tagName?.toLowerCase();
      const isSubscript = childTag === 'sub';
      const isSuperscript = childTag === 'sup';
      const isEm = up.tagName === 'EM';

      if (isSubscript && !isEm) {
        a.classList.add('blue');
        up.classList.add('button-container', 'subtext');
      } else if (isSubscript && isEm) {
        a.classList.add('white');
        twoup.classList.add('button-container', 'subtext');
      } else if (isSuperscript) {
        a.classList.add('black');
        up.classList.add('button-container', 'subtext');
      } else {
        const linkText = a.textContent;
        const linkTextEl = document.createElement('span');
        linkTextEl.classList.add('link-button-text');
        linkTextEl.textContent = linkText;
        a.setAttribute('aria-label', linkText);

        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.textContent = '';
          a.className = 'button text';
          up.classList.add('button-container');
          a.append(linkTextEl);
        }

        const pageType = getPageType();
        if (pageType === 'blog') {
          if (up.childNodes.length === 1 && up.tagName === 'DEL' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')) {
            a.className = 'button primary';
            if (a.href.includes('/cart/')) a.target = '_blank';
            twoup.classList.add('button-container');
          }
          if (up.childNodes.length === 1 && up.tagName === 'EM' && threeup.childNodes.length === 1 && twoup.tagName === 'DEL' && (threeup.tagName === 'P' || threeup.tagName === 'DIV')) {
            a.className = 'button secondary';
            if (a.href.includes('/cart/')) a.target = '_blank';
            threeup.classList.add('button-container');
          }
        } else {
          if (up.childNodes.length === 1 && up.tagName === 'DEL' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')) {
            a.className = 'button primary';
            twoup.classList.add('button-container');
          }
          if (up.childNodes.length === 1 && up.tagName === 'EM' && threeup.childNodes.length === 1 && twoup.tagName === 'DEL' && (threeup.tagName === 'P' || threeup.tagName === 'DIV')) {
            a.className = 'button secondary';
            threeup.classList.add('button-container');
          }
          if (up.childNodes.length === 1 && up.tagName === 'EM' && twoup.tagName === 'STRONG' && threeup.tagName === 'DEL' && (threeup.parentElement.tagName === 'P' || threeup.parentElement.tagName === 'DIV')) {
            a.className = 'button dark';
            threeup.parentElement.classList.add('button-container');
          }
        }
      }
    }
  });
}

// On blog pages, make the last primary button sticky in mobile
export function makeLastButtonSticky() {
  if (getPageType() === 'blog') {
    const buttons = document.querySelectorAll('a.button.primary');
    if (buttons.length > 0) {
      buttons[buttons.length - 1].classList.add('sticky');
    }
  }
}

/**
 * Extracts color information from p text content in curly braces.
 * @returns {Object|null} - An object containing the extracted color
 * or null if no color information is found.
 */
export function extractElementsColor() {
//  const textNodes = Array.from(document.querySelectorAll('div > p:first-child'));
  const textNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, li, p'));
  textNodes.forEach((node) => {
    const up = node.parentElement;
    const isParagraph = node.tagName === 'P';
    const text = node.textContent;
    // color must be letters or dashes
    const colorRegex = text && /{([a-zA-Z-\s]+)?}/;
    const numberRegex = text && /\{(\d{1,2})?}/;
    const spanRegex = new RegExp(`\\[${colorRegex.source}([a-zA-Z0-9\\s]*.)\\]`);
    const colorMatches = text.match(colorRegex);
    const numberMatches = text.match(numberRegex);
    const spanMatches = text.match(spanRegex);
    // case where colored text is wrapped in a span.
    // no HTML elements allowed (no bold, no links).
    if (spanMatches) {
      node.innerHTML = text.replace(new RegExp(spanRegex, 'g'), (match, color, spanText) => {
        const span = createTag('span', { class: `${toClassName(color)}` }, spanText);
        return span.outerHTML;
      });
    }

    // case for buttons
    if (isParagraph && node.querySelector('a')) {
      const anchor = node.querySelector('a');
      if (colorMatches) {
        anchor.classList.add(`bg-${toClassName(colorMatches[1])}`);
        // remove the color from the text
        anchor.textContent = anchor.textContent.replace(colorMatches[0], '');
      }
    }

    // case where only the color or width is in the first cell
    if (isParagraph && up.tagName === 'DIV' && up.firstElementChild === node && text.trim().startsWith('{') && text.trim().endsWith('}')) {
      if (colorMatches) {
        const backgroundColor = colorMatches[1];
        up.classList.add(`bg-${toClassName(backgroundColor)}`);
      }
      if (numberMatches) {
        const percentWidth = numberMatches[1];
        up.style.maxWidth = `${percentWidth}%`;
      }
      node.remove();
    }
  });
}

/**
   * load fonts.css and set a session storage flag
   */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
   * load the template specific js and css
   */
async function loadTemplate(main) {
  try {
    const template = getMetadata(TEMPLATE_META) ? toClassName(getMetadata(TEMPLATE_META)) : null;
    if ((template && TEMPLATES.includes(template) && (getPageType() === 'blog')) || (getPageType() === 'author')) {
      const templateJS = await import(`../templates/${template}/${template}.js`);
      // invoke the default export from template js
      if (templateJS.default) {
        await templateJS.default(main);
      }
      loadCSS(
        `${window.hlx.codeBasePath}/templates/${template}/${template}.css`,
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load template with error : ${err}`);
  }
}

/**
   * Builds a spacer out of a code block with the text 'spacer'.
   * add up to 3 spacers with 'spacer1', 'spacer2', 'spacer3'
   */
function buildSpacer(main) {
  const codeElements = main.querySelectorAll('code');
  codeElements.forEach((code) => {
    const spacerMatch = code.textContent.match(/spacer-(\d+)/);
    if (spacerMatch) {
      const spacerHeight = parseInt(spacerMatch[1], 10);
      const spacerDiv = document.createElement('div');
      spacerDiv.style.height = `${spacerHeight * 10}px`;
      code.insertAdjacentElement('afterend', spacerDiv);
      code.remove();
    }
  });
}

export function decorateExtImage() {
  // dynamic media link or images in /svg folder
  // not for bitmap images because we're not doing renditions here
  const numberRegex = /\{(\d{1,2})?}/;
  const fragment = document.createDocumentFragment();

  document.querySelectorAll('a[href]').forEach((a) => {
    if (EXT_IMAGE_URL.test(a.href) && linkTextIncludesHref(a)) {
      const extImageSrc = a.href;
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      img.classList.add('svg');
      // this alt is a cop out, but it's better than nothing
      img.alt = 'Sling TV image';
      // making assumption it is not LCP
      img.loading = 'lazy';
      img.src = extImageSrc;
      picture.append(img);

      // Check if the link's text content matches numberRegex
      const numberMatches = a.textContent.match(numberRegex);
      if (numberMatches) {
        const percentWidth = numberMatches[1];
        img.style.maxWidth = `${percentWidth}%`;
        // Remove the text content matching numberRegex
        a.textContent = a.textContent.replace(numberRegex, '');
      }

      fragment.append(picture);
      a.replaceWith(fragment);
    }
  });
}

/**
   * Builds all synthetic blocks in a container element.
   * @param {Element} main The container element
   */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    if (getPageType() !== 'blog') buildFragmentBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateLinkedImages() {
  const pictures = document.querySelectorAll('.section.columns-container picture');
  pictures.forEach((picture) => {
    const pictureParent = picture.parentElement;
    const nextSibling = pictureParent.nextElementSibling;
    if (nextSibling && nextSibling.tagName === 'P' && nextSibling.querySelector('a')) {
      const anchor = nextSibling.querySelector('a');
      anchor.innerHTML = '';
      anchor.appendChild(picture);
    }
  });
}

async function loadLaunchEager() {
  const isTarget = getMetadata('target');
  if (isTarget && isTarget.toLowerCase() === 'true') {
    await loadScript('/aemedge/scripts/sling-martech/analytics-lib.js');
    if (window.location.host.startsWith('localhost')) {
      await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-b69ac51c7dcd-development.min.js');
    } else if (window.location.host.startsWith('www.sling.com') || window.location.host.endsWith('.live')) {
      await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-c846c0e0cbc6.min.js');
    } else if (window.location.host.endsWith('.page')) {
      await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-6367a8aeb307-staging.min.js');
    }
  }
}
/**
   * Decorates the main element.
   * @param {Element} main The main element
   */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  centerHeadlines();
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  makeTwoColumns(main);
  decorateStyledSections(main);
  buildSpacer(main);
  extractElementsColor();
  decorateExtImage(main);
  decorateLinkedImages();
  buildVideoBlocks(main);
}

/**
   * Loads everything needed to get to LCP.
   * @param {Element} doc The container element
   */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    if (getPageType() === 'blog') {
      buildPopularBlogs(main);
    }
    decorateMain(main);
    await loadTemplate(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
   * Loads a block named 'header' into header
   * @param {Element} header header element
   * @returns {Promise}
   */
async function loadHeader(header) {
  let block = 'header';
  const template = getMetadata('template');
  if (template
    && (template === 'blog-article'
      || template === 'blog-category' || template === 'blog-author')) {
    block = 'whatson-header';
  }
  const headerBlock = buildBlock(`${block}`, '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
   * Loads everything that doesn't need to be delayed.
   * @param {Element} doc The container element
   */
async function loadLazy(doc) {
  autolinkModals(doc);
  const main = doc.querySelector('main');
  await loadBlocks(main);
  const gameFinders = doc.querySelectorAll('.game-finder.block');
  if (gameFinders && gameFinders.length > 0) {
    await loadGameFinders(doc);
  }
  const packageCards = doc.querySelectorAll('.package-cards.block');
  if (packageCards && packageCards.length > 0) {
    await loadPackageCards(doc);
  }
  // listen to zipcode changes and redecorate
  document.addEventListener('zipupdate', async () => {
    if (packageCards && packageCards.length > 0) {
      await loadPackageCards(doc);
    }
    if (gameFinders && gameFinders.length > 0) {
      await loadGameFinders(doc);
    }
  }, { once: true });
  buildMultipleButtons(main);
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  loadHeader(doc.querySelector('header'));
  setNavType(main);
  loadFooter(doc.querySelector('footer'));
  buildGlobalBanner(main);
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
   * Loads everything that happens a lot later,
   * without impacting the user experience.
   */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  // load everything that needs to be loaded eagerly
  await loadEager(document);

  // load everything that can be postponed to the latest here
  await loadLazy(document);
  // load launch eagerly when target metadata is set to true
  await loadLaunchEager();
  // load everything that needs to be loaded later
  loadDelayed();
  // make the last button sticky on blog pages
  makeLastButtonSticky();
}
loadPage();
