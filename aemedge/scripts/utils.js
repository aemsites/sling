import {
  getMetadata, buildBlock, decorateBlock, createOptimizedPicture, toCamelCase,
} from './aem.js';

import { getTag } from './tags.js';

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
const TAGS_NOT_TO_BE_TRANSLATED = ['latino-es', 'sci-fi'];
export const pathToTag = (
  (name) => {
    let path = name;
    if (!TAGS_NOT_TO_BE_TRANSLATED.includes(name)) {
      if (name.toLowerCase().includes('-')) {
        path = name.toLowerCase().replace('-', ' ');
      }
    }
    if (name.toLowerCase().includes('-and-')) {
      path = name.toLowerCase().replace('-and-', ' & ');
    }
    return path.toLowerCase();
  }
);
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
    pathElements.forEach((path) => (breamCrumbs.push(pathToTag(path).toUpperCase())));

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
      if ((a.href.includes('twitter.com') || a.href.includes('facebook.com') || a.href.includes('instagram.com') || a.href.includes('watch.sling.com')) && linkTextIncludesHref(a)) {
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
 * @returns {string} - The type of the page based on template
 */
export function getPageType() {
  const template = getMetadata('template');
  if (template === 'blog-article') return 'blog';
  if (template === 'blog-category') return 'category';
  if (template === 'blog-author') return 'author';
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
    (e) => (e.template === 'blog-article' && e.image !== '' && !e.image.startsWith('//aemedge/default-meta-image.png')),
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

export async function getBlogsByPaths(paths) {
  if (!window.allBlogs) {
    window.allBlogs = await fetchData('/whatson/query-index.json');
  }
  const blogArticles = window.allBlogs.filter(
    (e) => (e.template !== 'blog-category' && e.image !== '' && !e.image.startsWith('//aemedge/default-meta-image.png')),
  );
  let filterArticles = [];
  if (paths && paths.length > 0) {
    filterArticles = blogArticles.filter((b) => (paths.includes(b.path)));
  }
  return filterArticles;
}

// Adding tags
function addTags(container, tags) {
  const tagsDiv = createTag('div', { class: 'card-tags' });
  tags.forEach(async (tag) => {
    const tagObject = await getTag(tag.trim());
    const tagElement = createTag('a', {
      class: 'card-tag-link',
      href: `/whatson/${tagObject.name}`,
    }, tag.toUpperCase());
    tagsDiv.append(tagElement);
  });
  container.append(tagsDiv);
}

function addTagsOnLargeCards(container, tags, lastSegmentOfURL) {
  const tagsDiv = createTag('div', { class: 'card-tags' });
  tags.forEach(async (tag) => {
    if (tag.trim() === lastSegmentOfURL.trim().toUpperCase().replace(/-/g, ' ')) {
      const tagObject = await getTag(tag.trim());
      const tagElement = createTag('a', {
        class: 'card-tag-link',
        href: `/whatson/${tagObject.name}`,
      }, tag.toUpperCase());
      tagsDiv.append(tagElement);
    }
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
export async function addCardContent(container, lastSegmentOfURL, {
  tags, title, description, author, date,
}) {
  const cardContent = createTag('div', { class: 'card-content' });
  container.append(cardContent);

  if (tags) {
    if (typeof lastSegmentOfURL !== 'undefined' && lastSegmentOfURL != null) {
      addTagsOnLargeCards(cardContent, tags, lastSegmentOfURL);
    } else {
      addTags(cardContent, tags);
    }
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
      [{ width: '600' }], // good enough because 795 is the max card width
    ));
    return cardImageDiv;
  }
  return null;
}

/**
 * utility to create a tag with link to author page
 * @param {*} authName - author name mentioned in the page metadata
 * @returns a element
 */
export function buildAuthorLink(authName) {
  const authLink = createTag('a', {
    href: `${window.location.origin}/whatson/author/${authName.trim().toLowerCase().replace(' ', '-')}`,
  });
  return authLink;
}

/**
 * Gets placeholders object.
 * @param {string} [prefix] Location of placeholders
 * @param {string} [sheet] Sheet name to fetch placeholders from
 * @returns {object} Window placeholders object
 */
// eslint-disable-next-line import/prefer-default-export, default-param-last
export async function fetchPlaceholders(prefix = 'default', sheet = '') {
  window.placeholders = window.placeholders || {};
  if (!window.placeholders[`${prefix}-${sheet}`]) {
    window.placeholders[`${prefix}-${sheet}`] = new Promise((resolve) => {
      fetch(`${prefix === 'default' ? '' : prefix}/placeholders.json`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          const placeholders = {};
          let jsonData;
          if (sheet) {
            jsonData = json[sheet].data;
          } else {
            jsonData = json.data;
          }
          jsonData
            .filter((placeholder) => placeholder.Key)
            .forEach((placeholder) => {
              placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
            });
          window.placeholders[prefix] = placeholders;
          resolve(window.placeholders[prefix]);
        })
        .catch(() => {
          // error loading placeholders
          window.placeholders[`${prefix}-${sheet}`] = {};
          resolve(window.placeholders[`${prefix}-${sheet}`]);
        });
    });
  }
  return window.placeholders[`${prefix}-${sheet}`];
}

/**
 * Data from Commerce GraphQL endpoint to populate the plan offer block
 */

export const GRAPHQL_ENDPOINT = 'https://www.slingcommerce.com/graphql';

export const GQL_QUERIES = Object.freeze({
  zipcodeAddressVerificationV2: {
    operationName: 'zipcodeAddressVerificationV2',
    query: `
      query zipcodeAddressVerificationV2($zipcode: String!) {
        zipcodeAddressVerificationV2(zipcode: $zipcode) {
          zipcode_matched
          zipcode
          dma
          latitude
          longitude
          city
          state
          __typename
        }
      }
    `,
    variables: (zipCode) => `{"zipcode":"${zipCode}"}`,
  },
  packagesPerZipCode: {
    operationName: 'packagesPerZipCode',
    query: `
      query packagesPerZipcode($zipcode: String!) {
        packagesPerZipcode(zipcode: $zipcode) {
          id
          identifier
          name
          guid
          sku
          package_type
          csr_required
          amount
          description
          migrated_to
          enabled
          priority
          __typename
        }
      }
    `,
    variables: (zipCode) => `{"zipcode":"${zipCode}"}`,
  },
  getPackage: {
    operationName: 'getPackage',
    query: `
      query GetPackage($filter: PackageAttributeFilterInput) {
        packages(filter: $filter) {
          items {
            plan {
              plan_code
              plan_identifier
              plan_name
              __typename
            }
            planOffer {
              plan_offer_identifier
              discount
              discount_type
              plan_offer_name
              offer_identifier
              description
              __typename
            }
            package {
              name
              base_price
              sku
              channels {
                identifier
                call_sign
                name
                __typename
              }
              plan_offer_price
              canonical_identifier
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `,
    variables: (packageType, isChannelRequired, tagIn, zipCode, planOfferIdentifier, planIdentifier) => `{"filter":{"pck_type":{"in":["${packageType}"]},"is_channel_required":{"eq":${isChannelRequired}},"tag":{"in":["${tagIn}"]},"zipcode":{"eq":"${zipCode}"},"plan_offer_identifier":{"eq":"${planOfferIdentifier}"},"plan_identifier":{"eq":"${planIdentifier}"}}}`,
  },
});

export function cleanGQLParam(param) {
  return param.replace(/\s+/g, ' ').trim();
}

/** Make GraphQL query to fetch data */
/**
 * Fetches data from the GraphQL endpoint
 * @param {*} query GraphQL Query
 * @param variables
 * @param operationName
 * @returns JSON response from the GraphQL endpoint
 */
export async function fetchGQL(query, variables, operationName) {
  if (!query || !variables || !operationName) return null;
  const params = new URLSearchParams({
    query: cleanGQLParam(query),
    variables: cleanGQLParam(variables),
    operationName: cleanGQLParam(operationName),
  });
  const res = await fetch(`${GRAPHQL_ENDPOINT}?${params}`);
  const gqlResponse = await res.json();
  return gqlResponse;
}
