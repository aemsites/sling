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
