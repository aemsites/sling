import {
  sampleRUM,
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
} from './utils.js';

const LCP_BLOCKS = ['category']; // add your LCP blocks to the list
const TEMPLATES = ['blog-article', 'blog-category']; // add your templates here
const TEMPLATE_META = 'template';

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
  const buttons = main.querySelectorAll('p.button-container');
  buttons.forEach((button) => {
    if (button.nextElementSibling && button.nextElementSibling.classList.contains('button-container')) {
      const siblingButton = button.nextElementSibling;
      if (siblingButton && !button.parentElement.classList.contains('buttons-container')) {
        const buttonContainer = createTag('div', { class: 'buttons-container' });
        button.parentElement.insertBefore(buttonContainer, button);
        buttonContainer.append(button, siblingButton);
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

const resizeListeners = new WeakMap();
function getBackgroundImage(section) {
  // look for "background" values in the section metadata
  const bgImages = section.dataset.background.split(',');
  if (bgImages.length === 1) {
    return bgImages[0].trim();
  } // if there are 2 images, first is for desktop and second is for mobile
  return (window.innerWidth > 1024 && bgImages.length === 2)
    ? bgImages[0].trim() : bgImages[1].trim();
}

function createOptimizedBackgroundImage(section, breakpoints = [
  { width: '450' },
  { media: '(min-width: 450px)', width: '768' },
  { media: '(min-width: 768px)', width: '1024' },
  { media: '(min-width: 1024px)', width: '1600' },
  { media: '(min-width: 1600px)', width: '2000' },
]) {
  const updateBackground = () => {
    const bgImage = getBackgroundImage(section);
    const url = new URL(bgImage, window.location.href);
    const pathname = encodeURI(url.pathname);

    const matchedBreakpoints = breakpoints.filter(
      (br) => !br.media || window.matchMedia(br.media).matches,
    );
    // If there are any matching breakpoints, pick the one with the highest resolution
    const matchedBreakpoint = matchedBreakpoints.reduce(
      (acc, curr) => (parseInt(curr.width, 10) > parseInt(acc.width, 10) ? curr : acc),
      breakpoints[0],
    );

    const adjustedWidth = matchedBreakpoint.width * window.devicePixelRatio;
    section.style.backgroundImage = `url(${pathname}?width=${adjustedWidth}&format=webply&optimize=highest)`;
    section.style.backgroundSize = 'cover';
  };

  if (resizeListeners.has(section)) {
    window.removeEventListener('resize', resizeListeners.get(section));
  }

  resizeListeners.set(section, updateBackground);
  window.addEventListener('resize', updateBackground);
  updateBackground();
}

/**
 * Finds all sections in the main element of the document
 * that require adding a background image
 * @param {Element} main
 */

function decorateStyledSections(main) {
  Array.from(main.querySelectorAll('.section[data-background]')).forEach((section) => {
    createOptimizedBackgroundImage(section);
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
    if (a.href !== a.textContent) {
      const hasIcon = a.querySelector('.icon');
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      const threeup = a.parentElement.parentElement.parentElement;
      if (hasIcon) return;
      if (!a.querySelector('img')) {
        // let default button be text-only, no decoration
        const linkText = a.textContent;
        const linkTextEl = document.createElement('span');
        linkTextEl.classList.add('link-button-text');
        linkTextEl.append(linkText);
        a.textContent = `${linkText}`;
        a.setAttribute('aria-label', `${linkText}`);
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.textContent = '';
          a.className = 'button text'; // default
          up.classList.add('button-container');
          a.append(linkTextEl);
        }
        // primary buttons in whatson pages
        if (getPageType() === 'blog') {
          if (
            up.childNodes.length === 1
            && up.tagName === 'DEL'
            && twoup.childNodes.length === 1
            && (twoup.tagName === 'P' || twoup.tagName === 'DIV')) {
            a.className = 'button primary';
            if (a.href.includes('/cart/')) a.target = '_blank';
            twoup.classList.add('button-container');
          }
          // secondary button
          if (
            up.childNodes.length === 1
              && up.tagName === 'EM'
              && threeup.childNodes.length === 1
              && (twoup && twoup.tagName === 'DEL')
              && (threeup.tagName === 'P' || threeup.tagName === 'DIV')) {
            a.className = 'button secondary';
            if (a.href.includes('/cart/')) a.target = '_blank';
            threeup.classList.add('button-container');
          }
        } else if (
          up.childNodes.length === 1
          && up.tagName === 'DEL'
          && twoup.childNodes.length === 1
          && (twoup.tagName === 'P' || twoup.tagName === 'DIV')) {
          a.className = 'button primary';
          twoup.classList.add('button-container');
        }

        if (
          up.childNodes.length === 1
          && up.tagName === 'EM'
          && threeup.childNodes.length === 1
          && (twoup && twoup.tagName === 'DEL')
          && (threeup.tagName === 'P' || threeup.tagName === 'DIV')) {
          a.className = 'button secondary';
          threeup.classList.add('button-container');
        }
        if (
          up.childNodes.length === 1
          && up.tagName === 'EM'
          && twoup.tagName === 'STRONG'
          && (threeup.tagName === 'DEL')
          && (threeup.parentElement.tagName === 'P' || threeup.parentElement.tagName === 'DIV')) {
          a.className = 'button dark';
          threeup.parentElement.classList.add('button-container');
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
   * Sanitizes a string for use as class name.
   * @param {string} name The unsanitized string
   * @returns {string} The class name
   */
export function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
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
  const allPageSpacers = main.querySelectorAll('code');

  allPageSpacers.forEach((el) => {
    const alt = el.innerText.trim();

    if (alt === 'spacer' || alt === 'spacer1') {
      el.innerText = '';
      el.classList.add('spacer1');
    }
    if (alt === 'spacer2') {
      el.innerText = '';
      el.classList.add('spacer2');
    }
    if (alt === 'spacer3') {
      el.innerText = '';
      el.classList.add('spacer3');
    }
  });
}

export function decorateExtImage() {
  // dynamic media link or images in /svg folder
  // not for bitmap images because we're not doing renditions here
  const extImageUrl = /dish\.scene7\.com|\/aemedge\/svgs\//;
  document.querySelectorAll('a[href]').forEach((a) => {
    if (extImageUrl.test(a.href) && linkTextIncludesHref(a)) {
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
      a.replaceWith(picture);
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

/**
   * Decorates the main element.
   * @param {Element} main The main element
   */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateStyledSections(main);
  buildSpacer(main);
  decorateExtImage(main);
  decorateLinkedImages();
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
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
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
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  makeLastButtonSticky();
}
loadPage();
