import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
const TEMPLATES = ['blog-article']; // add your templates here
const TEMPLATE_META = 'template';

/**
 * Create an HTML tag in one line of code
 * @param {string} tag Tag to create
 * @param {object} attributes Key/value object of attributes
 * @param {Element} html html to append to tag
 * @returns {HTMLElement} The created tag
 */
export function createTag(tag, attributes, html = undefined) {
  const element = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement || html instanceof SVGElement) {
      element.append(html);
    } else {
      element.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes)
      .forEach(([key, val]) => {
        element.setAttribute(key, val);
      });
  }
  return element;
}
/**
 * function to build the breadcrumb for blog details page
 * @returns blobsdiv element for whatson pages, otherwise null
 */
function buildBlogBreadcrumb() {
  const urlPath = window.location.pathname;

  if (urlPath.includes('/whatson')) {
    const bcWrapper = createTag('div');
    const breamCrumbs = ['BLOG'];
    let pathElements = urlPath.split('/');
    pathElements = pathElements.slice(2, pathElements.length - 1);
    pathElements.forEach((path) => (breamCrumbs.push(path.trim().replace('-', ' ').toUpperCase())));

    breamCrumbs.map((breadCrumb, index) => {
      const href = urlPath.substring(0, urlPath.indexOf(urlPath.split('/')[index + 2]) - 1);
      const breadCrumbLink = createTag('a', {
        class: 'blog-breadcrumb--links',
        href,
      });
      breadCrumbLink.innerHTML = breadCrumb;
      const arrowSpan = createTag('span', { class: 'blog-breadcrumb--arrow fa fa-angle-right' });
      arrowSpan.innerHTML = '  >  ';
      return bcWrapper.append(breadCrumbLink, arrowSpan);
    });
    const pageTitle = getMetadata('og:title');
    if (pageTitle) {
      // generate span tag with title
      const titleSpan = createTag('span', { class: 'blog-breadcrumb-active-article' });
      titleSpan.innerHTML = pageTitle;
      bcWrapper.append(titleSpan);
    }
    return bcWrapper;
  }
  return null;
}
/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const picture = main.querySelector('picture');
  const template = getMetadata(TEMPLATE_META);
  if (template !== 'blog-article') {
    const h1 = main.querySelector('h1');
    // eslint-disable-next-line no-bitwise
    if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
      const section = document.createElement('div');
      section.append(buildBlock('hero', { elems: [picture, h1] }));
      main.prepend(section);
    }
  } else if (picture) {
    const h1 = main.querySelector('h1');
    const h2 = main.querySelector('h1+h2'); // blog articles shows only image
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture] }));
    const breadCrumb = buildBlogBreadcrumb();
    if (breadCrumb) section.append(breadCrumb);
    section.append(h1);
    section.append(h2);
    main.prepend(section);
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

    if (template && TEMPLATES.includes(template)) {
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
    console.log(`Failed to load template with error : ${err}`);
  }
}
/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
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
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

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
}

loadPage();
