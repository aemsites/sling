import { getMetadata, buildBlock, decorateBlock } from './aem.js';

export const PRODUCTION_DOMAINS = ['sling.com'];
const domainCheckCache = {};
/**
 * Checks a url to determine if it is a known domain.
 * @param {string | URL} url the url to check
 * @returns {Object} an object with properties indicating the urls domain types.
 */
export function checkDomain(url) {
  const urlToCheck = typeof url === 'string' ? new URL(url) : url;

  let result = domainCheckCache[urlToCheck.hostname];
  if (!result) {
    const isProd = PRODUCTION_DOMAINS.some((host) => urlToCheck.hostname.includes(host));
    const isHlx = ['hlx.page', 'hlx.live', 'aem.page', 'aem.live'].some((host) => urlToCheck.hostname.includes(host));
    const isLocal = urlToCheck.hostname.includes('localhost');
    const isPreview = isLocal || urlToCheck.hostname.includes('hlx.page') || urlToCheck.hostname.includes('aem.page');
    const isKnown = isProd || isHlx || isLocal;
    const isExternal = !isKnown;
    result = {
      isProd,
      isHlx,
      isLocal,
      isKnown,
      isExternal,
      isPreview,
    };

    domainCheckCache[urlToCheck.hostname] = result;
  }

  return result;
}
/**
 * check if link text is same as the href
 * @param {Element} link the link element
 * @returns {boolean} true or false
 */
export function linkTextIncludesHref(link) {
  const href = link.getAttribute('href');
  const textcontent = link.textContent;

  return textcontent.includes(href);
}

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

// blog details related functions

/**
 * function to build the breadcrumb for blog details page
 * @returns blobsdiv element for whatson pages, otherwise null
 */
export function buildBlogBreadcrumb() {
  const urlPath = window.location.pathname;

  if (urlPath.includes('/whatson')) {
    const bcWrapper = createTag('div', { class: 'blog-breadcrumb' });
    const breamCrumbs = ['BLOG'];
    let pathElements = urlPath.split('/');
    pathElements = pathElements.slice(2, pathElements.length - 1);
    pathElements.forEach((path) => (breamCrumbs.push(path.trim().replace('-', ' ').toUpperCase())));

    breamCrumbs.map((breadCrumb, index) => {
      const href = urlPath.substring(0, urlPath.indexOf(urlPath.split('/')[index + 2]) - 1);
      const breadCrumbLink = createTag('a', {
        class: 'blog-breadcrumb-link',
        href,
      });
      breadCrumbLink.innerHTML = breadCrumb;
      const arrowSpan = createTag('span', { class: 'icon icon-fw-arrow' });
      return bcWrapper.append(breadCrumbLink, arrowSpan);
    });
    const pageTitle = getMetadata('og:title');
    if (pageTitle) {
      // generate span tag with title
      const titleSpan = createTag('span', { class: 'blog-breadcrumb-active-article' });
      titleSpan.innerHTML = pageTitle.toUpperCase();
      bcWrapper.append(titleSpan);
    }
    return bcWrapper;
  }
  return null;
}

/**
 * Builds video blocks when encounter video links.
 * @param {Element} main The container element
 */
export function buildVideoBlocks(main) {
  const template = getMetadata('template');
  if (template === 'blog-article') {
    main.querySelectorAll('a[href]').forEach((a) => {
      if (a.href.includes('youtube')) {
        const videoBlock = buildBlock('video', a.cloneNode(true));
        a.replaceWith(videoBlock);
        decorateBlock(videoBlock);
      }
    });
  }
}

/**
   * Builds fragment blocks from links to fragments
   * @param {Element} main The container element
   */
export function buildFragmentBlocks(main) {
  main.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href);
    const domainCheck = checkDomain(url);
    if (domainCheck.isKnown && linkTextIncludesHref(a) && url.pathname.includes('/fragments/')) {
      const block = buildBlock('fragment', url.pathname);
      a.replaceWith(block);
      decorateBlock(block);
    }
  });
}

/**
 * Function to build the email subscription form
 * @returns the email subscription block
 */

export function buildEmailSubsFrm(main) {
  const section = createTag('div');
  const blockDiv = createTag('div');
  const block = buildBlock('email-subscription', { elems: [blockDiv] });
  section.append(block);
  main.append(section);
}

/**
 * Function to build the Mostpopular blogs
 * @returns popular blogs block
 */
export function buildPopularBlogs(main) {
  const section = createTag('div');
  const popularBlogs = createTag('div', { class: 'most-popular-blogs' });
  popularBlogs.innerHTML = '<h4> Most Popular  </h4>';
  const block = buildBlock('popular-blogs', { elems: [popularBlogs] });
  section.append(block);
  main.append(section);
}

/**
 * Function to check whether the page is of type blog-article
 * @param {*} document
 * @returns
 */
export function getPageType() {
  const category = getMetadata('category');
  const template = getMetadata('template');
  if (template === 'blog-article' && !category) return 'blog';
  return 'category';
}
