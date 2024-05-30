import {
  checkDomain,
  linkTextIncludesHref,
  createTag,
} from './utils.js';
import { getMetadata, buildBlock, decorateBlock } from './aem.js';

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
      titleSpan.innerHTML = pageTitle;
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
        const aClone = a.cloneNode(true);
        const videoBlock = buildBlock('video', aClone);
        // main.append(videoBlock);
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
      const block = buildBlock('fragment', a.cloneNode(true));
      a.replaceWith(block);
      decorateBlock(block);
      // main.append(block);
    }
  });
}

/**
 * Function to build the email subscription form
 * @returns the form container
 */

export function buildEmailSubsFrm() {
  const containerDiv = createTag('div');
  const p = createTag('p', { class: 'email-susbcription' });
  const b = createTag('b');
  b.innerHTML = 'Place Holder for Email Subscription Form';
  p.appendChild(b);
  return containerDiv.appendChild(buildBlock('email-subscription', { elems: [p] }));
}

/**
 * Function to build the Mostpopular blogs
 * @returns
 */
export function buildPopularBlogs() {
  const containerDiv = createTag('div');
  const p = createTag('p', { class: 'popular-blogs' });
  const b = createTag('b');
  b.innerHTML = 'Place Holder for Popular Blogs';
  p.appendChild(b);
  return containerDiv.appendChild(buildBlock('popular-blogs', { elems: [p] }));
}

// export function buildBlogHero(main) {
//   const picture = main.querySelector('picture');
//   const section = document.createElement('div');
//   const heroBlock = buildBlock('hero', { elems: [picture] });
//   section.append(decorateBlock(heroBlock));
//   const breadCrumb = buildBlogBreadcrumb();
//   if (breadCrumb) section.append(breadCrumb);
//   main.prepend(section);
// }
