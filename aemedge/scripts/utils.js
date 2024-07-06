import {
  getMetadata, buildBlock, decorateBlock, createOptimizedPicture,
} from './aem.js';

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
      if (a.href.includes('youtube') && linkTextIncludesHref(a)) {
        const videoBlock = buildBlock('video', a.cloneNode(true));
        a.replaceWith(videoBlock);
        decorateBlock(videoBlock);
      }
      if ((a.href.includes('twitter.com') || a.href.includes('facebook.com')) && linkTextIncludesHref(a)) {
        const embedBlock = buildBlock('embed', a.cloneNode(true));
        a.replaceWith(embedBlock);
        decorateBlock(embedBlock);
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
 * Function to build the Mostpopular blogs
 * @returns popular blogs block
 */
export function buildPopularBlogs(main) {
  const section = createTag('div');
  const popularBlogs = createTag('div', { class: 'slides-container' });
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
  const template = getMetadata('template');
  if (template === 'blog-article') return 'blog';
  if (template === 'blog-category') return 'category';
  return '';
}

/**
 * Fetches and transforms data from a JSON file
 * @param {string} path - The path to the JSON file
 * @returns {Promise<Array>} - A promise resolving to the transformed data array
 */
export async function fetchData(path) {
  const response = await fetch(path);
  const json = await response.json();

  return json.data.map((row) => {
    if (row.image.startsWith('/default-meta-image.png')) {
      row.image = `/${window.hlx.codeBasePath}${row.image}`;
    }
    return row;
  });
}

/**
 * Converts excel date into JS date.
 * @param {number} excelDate date to convert.
 */
export function convertExcelDate(excelDate) {
  const jsDate = +excelDate > 99999
    ? new Date(+excelDate * 1000)
    : new Date(Math.round((+excelDate - (1 + 25567 + 1)) * 86400 * 1000));
  return jsDate;
}

function compareArrays(arr, arr2) {
  return arr.every((i) => arr2.includes(i));
}

/**
 * Retrieves blogs matching specific tags
 * @param {Array} categories - An array of categories to filter by
 * @param {number} num - The number of blogs to retrieve
 * @returns {Promise<Array>} - A promise resolving to the filtered blogs array
 */
export async function getBlogs(categories, num) {
  if (!window.allBlogs) {
    window.allBlogs = await fetchData('/whatson/query-index.json');
  }

  const blogArticles = window.allBlogs.filter(
    (e) => (e.template !== 'blog-category' && e.image !== '' && !e.image.startsWith('//aemedge/default-meta-image.png')),
  );
  if (categories && categories.length > 0) {
    const filteredList = blogArticles.filter((e) => {
      const rawTags = JSON.parse(e.tags);
      const tags = rawTags.map((tag) => tag.trim().toLowerCase());
      return compareArrays(categories, tags);
    });
    if (num) {
      return filteredList.slice(0, num);
    }
    return filteredList;
  }
  if (num) {
    return blogArticles.slice(0, num);
  }
  return blogArticles;
}

// Adding tags
function addTags(container, tags) {
  const tagsDiv = createTag('div', { class: 'card-tags' });
  tags.forEach((tag) => {
    const tagElement = createTag('a', { class: 'card-tag-link', href: `/whatson/${tag.toLowerCase()}` }, tag.toUpperCase());
    tagsDiv.append(tagElement);
  });
  container.append(tagsDiv);
}

// Adding title
function addTitle(container, title) {
  const titleDiv = createTag('div', { class: 'card-title' }, title);
  container.append(titleDiv);
}

// Adding description
function addDescription(container, description) {
  const descriptionDiv = createTag('div', { class: 'card-description' }, `${description.substring(0, 100)}…`);
  container.append(descriptionDiv);
}

// Adding author + publish date
function addAuthorAndDate(container, authorName, publishDate) {
  const authorDateDiv = createTag('div', { class: 'card-author-date' });
  const author = createTag('span', { class: 'card-author' }, authorName || 'Sling Staff');
  authorDateDiv.append(author);
  if (publishDate) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = publishDate.toLocaleDateString('en-US', dateOptions);
    const date = createTag('span', { class: 'card-date' }, formattedDate);
    authorDateDiv.append(date);
  }
  container.append(authorDateDiv);
}

// Creating card content
export async function addCardContent(container, {
  tags, title, description, author, date,
}) {
  const cardContent = createTag('div', { class: 'card-content' });
  container.append(cardContent);

  if (tags) {
    addTags(cardContent, tags);
  }
  if (title) {
    addTitle(cardContent, title);
  }
  if (description) {
    addDescription(cardContent, description);
  }
  addAuthorAndDate(cardContent, author, date);
}

// Create card images using default thumbnail image
export async function addCardImage(row, style, eagerImage = false) {
  if (row.image !== '' && row.image !== '0' && row.title !== '0') {
    const cardImageDiv = createTag('div', { class: 'card-image' });
    cardImageDiv.append(createOptimizedPicture(
      row.image,
      row.title,
      eagerImage,
      [{ width: '800' }], // because 795 is the max card width
    ));
    return cardImageDiv;
  }
  return null;
}
