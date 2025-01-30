/* eslint-disable no-undef */
const DATA_SLING_PROPS = 'data-sling-props';
const EDS_BASE_URL = 'https://main--sling--aemsites.aem.page';
const OFFER_DETAIL_MODAL_URL = '/aemedge/modals/try-sling-offer-details';
const STILL_HAVE_QUESTIONS_FRAG = '/aemedge/fragments/still-have-questions';
const WATCH_ALL_DEVICES_FRAG = '/aemedge/fragments/home-page-supported-devices';
const getForegroundImage = (el) => 'TODO - replace it with foreground image';
const createMetadataBlock = (main, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // find the <meta property="og:image"> element
  const ogImage = document.querySelector('meta[property="og:image"]')?.content;
  if (ogImage) {
    const img = document.createElement('img');
    img.src = ogImage.replace('https://www.sling.comhttps://dish.scene7.com', 'https://dish.scene7.com') || '';
    meta.Image = img;
  }

  // robots
  const robots = document.querySelector('head > meta[name="robots"]')?.content;
  if (robots && robots !== 'index') meta.robots = robots;
  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};

const createMarqueBlock = (main, document, marqueeEl) => {
  let reactProps = marqueeEl.getAttribute(DATA_SLING_PROPS);
  let marqueeCells = [];
  if (reactProps) {
    reactProps = JSON.parse(reactProps);
    const {
      backgroundColor,
      backgroundMediaUrlDesktop,
      backgroundMediaUrlMobile,
      backgroundMediaUrlTablet,
      ctaScrollIntoHeader,
      ctaSubtext,
      ctaText,
      ctaUrl,
      headlineText,
      mediaAlt,
      subHeadlineText,
    } = reactProps;
    const ctaLink = document.createElement('a');
    ctaLink.title = ctaText;
    ctaLink.href = ctaUrl;
    ctaLink.innerHTML = `<del>${ctaText}</del>`;

    const offerDetailsLink = document.createElement('a');
    offerDetailsLink.title = ctaSubtext;
    offerDetailsLink.href = `${OFFER_DETAIL_MODAL_URL}`;
    offerDetailsLink.innerText = ctaSubtext;

    const bgDesktopImg = document.createElement('img');
    bgDesktopImg.src = backgroundMediaUrlDesktop;
    bgDesktopImg.alt = mediaAlt;

    const bgTabletImg = document.createElement('img');
    bgTabletImg.src = backgroundMediaUrlTablet;
    bgTabletImg.alt = mediaAlt;

    const bgMobileImg = document.createElement('img');
    bgMobileImg.src = backgroundMediaUrlMobile;
    bgMobileImg.alt = mediaAlt;

    marqueeCells = [
      ['Headline', headlineText],
      ['Sub Headline', subHeadlineText],
      ['Background', [bgDesktopImg.outerHTML, bgDesktopImg.outerHTML, bgMobileImg.outerHTML].join('</br>')],
      ['Background Color', backgroundColor],
      ['Foreground', getForegroundImage(marqueeEl)],
      ['CTA', ctaLink],
      ['Scroll CTA Into Header', ctaScrollIntoHeader],
      ['Offer Details', offerDetailsLink],
    ];
  }

  const cells = [
    ['Marquee'],
    ...marqueeCells,
  ];
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createGameFinderBlock = (main, document, gamefinderEl) => {
  let reactProps = gamefinderEl.getAttribute(DATA_SLING_PROPS);
  if (reactProps) reactProps = JSON.parse(reactProps);
  const cells = [
    ['Game Finder'],
  ];
  Object.keys(reactProps).forEach((key) => {
    if (key !== 'channelsLogoPath' && key !== 'modalChannelsLogoPath') cells.push([key, reactProps[key]]);
  });

  return WebImporter.DOMUtils.createTable(cells, document);
};

// const createFragmentBlock = (document, fragPath) => {
//  const fragLink = document.createElement('a');
//  fragLink.href = `${EDS_BASE_URL}${fragPath}`;
//  fragLink.innerText = fragLink.href;
//  const cells = [
//    ['Fragment'],
//    [fragLink],
//  ];
//  return WebImporter.DOMUtils.createTable(cells, document);
// };
const createFragmentSection = (document, main, fragPath) => {
  const container = document.createElement('div');
  const seperator = document.createElement('hr');
  const fragLink = document.createElement('a');
  fragLink.href = `${EDS_BASE_URL}${fragPath}`;
  fragLink.innerText = fragLink.href;
  container.append(seperator, fragLink);
  return container;
};
// create FAQ fragment block
const createFAQBlock = (main, document) => {
  // find the <title> element
  const title = document.querySelector('title');
  let fragPath = '/aemedge/fragments/faq-global';
  if (title && title.innerHTML?.includes('NBA')) {
    fragPath = '/aemedge/fragments/faq-nba';
  }
  return createFragmentSection(document, main, fragPath);
};
const createColumnsBlock = (main, document, variant) => {
  const cells = [
    [`Columns(${variant})`],
  ];
  return WebImporter.DOMUtils.createTable(cells, document);
};
// create still need helps fragment block
// eslint-disable-next-line max-len
// const createStillNeedsHelpFragment = (main, document) => createFragmentBlock(document, STILL_HAVE_QUESTIONS_FRAG);
export default {
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.querySelector('main');
    // create marquee / hero block
    const marqueeEl = main.querySelector('div.js-react.js-react-marquee-template');
    if (marqueeEl) marqueeEl.replaceWith(createMarqueBlock(main, document, marqueeEl));
    const faqEl = document.querySelector('div.js-react.js-react-faq');
    if (faqEl) { faqEl.replaceWith(createFAQBlock(main, document)); }
    const gamefinderEl = document.querySelector('div.js-react.js-react-gamefinder');
    if (gamefinderEl) gamefinderEl.replaceWith(createGameFinderBlock(main, document, gamefinderEl));
    // still needs help block
    const supportEl = document.querySelector('img[src="/content/dam/sling-tv/smart-choice/smart-choice-lp/support-icon_gray.svg"]')?.closest('div')?.parentElement?.parentElement?.parentElement?.parentElement;
    if (supportEl) {
      supportEl.replaceWith(createFragmentSection(document, main, STILL_HAVE_QUESTIONS_FRAG));
    }
    const watchDevicesEl = document.querySelector('#supported-devices');
    if (watchDevicesEl) {
      watchDevicesEl.replaceWith(createFragmentSection(document, main, WATCH_ALL_DEVICES_FRAG));
    }
    // create metadata block
    createMetadataBlock(main, document);

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
      '.new-header',
      'nav',
      '.nav',
      'footer',
      '.footer',
      'iframe',
      'noscript',
    ]);

    // WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);

    return main;
  },

  /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    let p = new URL(url).pathname;
    if (p.endsWith('/')) {
      p = `${p}index`;
    }
    return decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
  },
};
