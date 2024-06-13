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

import {
  buildBlogBreadcrumb,
  buildEmailSubsFrm,
  buildPopularBlogs,
  getPageType,
  buildFragmentBlocks,
} from './utils.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
const TEMPLATES = ['blog-article']; // add your templates here
const TEMPLATE_META = 'template';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const picture = main.querySelector('picture');
  if (getPageType() === 'blog' && picture) {
    const h1 = main.querySelector('h1');
    if (h1) h1.classList.add('blog-primary-title');
    const images = [];
    main.querySelectorAll('picture').forEach((image, idx) => {
      // eslint-disable-next-line no-bitwise
      if (h1 && (h1.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_PRECEDING)) {
        images.push(image);
        if (idx === 0) image.classList.add('desktop');
        if (idx === 1) {
          image.classList.add('mobile');
          // load eager on mobile
          const mquery = window.matchMedia('(max-width: 900px)');
          if (mquery.matches) {
            image.querySelector('img').setAttribute('loading', 'eager');
          }
        }
      }
    });
    const section = document.createElement('div');
    section.append(buildBlock('blog-hero', { elems: images }));
    const breadCrumb = buildBlogBreadcrumb();
    if (breadCrumb) {
      breadCrumb.classList.add('blog-details-breadcrumb');
      section.append(breadCrumb);
    }
    section.append(h1);
    main.prepend(section);
  } else if (getPageType() === 'category' && picture) {
    const h1 = main.querySelector('h1');
    if (h1) h1.classList.add('blog-primary-title');
    const images = [];
    main.querySelectorAll('picture').forEach((image, idx) => {
      // eslint-disable-next-line no-bitwise
      if (h1 && (h1.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_PRECEDING)) {
        images.push(image);
        if (idx === 0) image.classList.add('desktop');
        if (idx === 1) {
          image.classList.add('mobile');
          // load eager on mobile
          const mquery = window.matchMedia('(max-width: 900px)');
          if (mquery.matches) {
            image.querySelector('img').setAttribute('loading', 'eager');
          }
        }
      }
    });
    const section = document.createElement('div');
    section.append(buildBlock('blog-hero', { elems: images }));
    section.append(h1);
    main.prepend(section);
  }
}

/** Builds accordion tags */
async function buildFAQ(main) {
  const faqBlock = main.querySelector('.tabs.faq.block');
  if (faqBlock) {
    let newBlock;
    try {
      // build a new block with accordion in the 2nd column
      newBlock = document.createElement('div');
      // build accordion for the tabContent
      const rows = [...faqBlock.children];
      faqBlock.innerHTML = '';
      let currentTabCategory;
      let oldTabCategory;
      let accordionContent = [];
      rows.forEach(async (row, i) => {
        const is3Col = row.children.length === 3;
        if (is3Col || (i === (rows.length - 1))) {
          oldTabCategory = currentTabCategory;
          currentTabCategory = row.firstElementChild;
        }
        if (i === (rows.length - 1)) {
          let accKey;
          let accValue;
          if (is3Col) {
            accKey = row.children[1].innerHTML;
            accValue = row.children[2].innerHTML;
          } else {
            accKey = row.children[0].innerHTML;
            accValue = row.children[1].innerHTML;
          }
          accordionContent.push([accKey, accValue]);
        }
        if ((i === (rows.length - 1))
            || (oldTabCategory
            && (oldTabCategory.textContent !== currentTabCategory.textContent)
            )) {
          // new tab category found - build accordion with the existing accordionContent
          const accordion = buildBlock('accordion', accordionContent);
          // add tabCategory and accordionContent to newDiv
          const tabCategoryDiv = document.createElement('div');
          tabCategoryDiv.innerHTML = oldTabCategory.innerHTML;
          const tabContentDiv = document.createElement('div');
          tabContentDiv.append(accordion);
          const newRow = document.createElement('div');
          newRow.append(tabCategoryDiv);
          newRow.append(tabContentDiv);
          newBlock.append(newRow);
          // reset accordionContent for the next set of rows
          accordionContent = [];
          oldTabCategory = null;
        }
        let accKey;
        let accValue;
        if (is3Col) {
          accKey = row.children[1].innerHTML;
          accValue = row.children[2].innerHTML;
        } else {
          accKey = row.children[0].innerHTML;
          accValue = row.children[1].innerHTML;
        }
        accordionContent.push([accKey, accValue]);
      });
      // set block to newBlock
      faqBlock.innerHTML = newBlock.innerHTML;
    } catch (e) {
      console.error('Error autoblocking FAQ: ', e);
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
    if (template && TEMPLATES.includes(template) && getPageType() === 'blog') {
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
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildFAQ(main);
    buildFragmentBlocks(main);
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
    if (getPageType() === 'blog') {
      buildPopularBlogs(main);
      buildEmailSubsFrm(main);
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
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);
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
