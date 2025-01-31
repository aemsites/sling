/* eslint-disable max-len */

/* eslint-disable no-undef */
const DATA_SLING_PROPS = 'data-sling-props';
const EDS_BASE_URL = 'https://main--sling--aemsites.aem.page';
const SLING_BASE_URL = 'https://www.sling.com/';
const OFFER_DETAIL_MODAL_URL = '/aemedge/modals/try-sling-offer-details';
const STILL_HAVE_QUESTIONS_FRAG = '/aemedge/fragments/still-have-questions';
const WATCH_ALL_DEVICES_FRAG = '/aemedge/fragments/home-page-supported-devices';
const OFFER_DETAIL_MODAL_PATH = '/aemedge/modals/try-sling-offer-details';
const SLING_BG_IMG_ALT = 'Sling Marquee Background';
const createMetadataBlock = (main, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '').replaceAll('&amp;', '&');
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

const createMediaEle = (bgMediaUrl, altText = SLING_BG_IMG_ALT) => {
  let element;
  if (bgMediaUrl.endsWith('.mp4')) {
    element = document.createElement('a');
    if (bgMediaUrl.startsWith('/content/dam')) {
      element.href = `${SLING_BASE_URL}${bgMediaUrl}`;
      element.innerText = element.href;
    } else {
      element.href = bgMediaUrl;
      element.innerText = element.href;
    }
  } else {
    element = document.createElement('img');
    element.src = bgMediaUrl;
    element.alt = altText;
  }
  return element.outerHTML;
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
      mediaUrlDesktop,
      mediaUrlTablet,
      mediaUrlMobile,
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

    const bgDesktop = backgroundMediaUrlDesktop ? createMediaEle(backgroundMediaUrlDesktop) : '';
    const bgTablet = backgroundMediaUrlTablet ? createMediaEle(backgroundMediaUrlTablet) : '';
    const bgMobile = backgroundMediaUrlMobile ? createMediaEle(backgroundMediaUrlMobile) : '';

    const fgDesktop = mediaUrlDesktop ? createMediaEle(mediaUrlDesktop, mediaAlt) : '';
    const fgTablet = mediaUrlTablet ? createMediaEle(mediaUrlTablet, mediaAlt) : '';
    const fgMobile = mediaUrlMobile ? createMediaEle(mediaUrlMobile, mediaAlt) : '';

    marqueeCells = [
      ['Headline', headlineText],
      ['Sub Headline', subHeadlineText],
      ['Background', [bgDesktop, bgTablet, bgMobile].join('</br>')],
      ['Background Color', backgroundColor],
      ['Foreground', [fgDesktop, fgTablet, fgMobile].join('</br>')],
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

const createFragmentLink = (document, main, fragPath) => {
  const fragLink = document.createElement('a');
  fragLink.href = `${EDS_BASE_URL}${fragPath}`;
  fragLink.innerText = fragLink.href;
  return fragLink;
};

const createFAQFrag = (main, document) => {
  // find the <title> element
  const title = document.querySelector('title');
  let fragPath = '/aemedge/fragments/faq-global';
  if (title && title.innerHTML?.includes('NBA')) {
    fragPath = '/aemedge/fragments/faq-nba';
  }
  return createFragmentLink(document, main, fragPath);
};

// const createColumnsBlock = (main, document, variant) => {
//  const cells = [
//    [`Columns(${variant})`],
//  ];
//  return WebImporter.DOMUtils.createTable(cells, document);
// };

const creatCTALinks = (document, ctaElemProps) => {
  const container = document.createElement('div');
  const tryUsLink = document.createElement('a');
  tryUsLink.href = ctaElemProps.ctaUrl;
  tryUsLink.title = ctaElemProps.ctaText;
  tryUsLink.innerHTML = `<del><em>${ctaElemProps.ctaText}</em></del>`;
  const offerDetailsLink = document.createElement('a');
  offerDetailsLink.href = `${EDS_BASE_URL}${OFFER_DETAIL_MODAL_PATH}`;
  offerDetailsLink.innerText = ctaElemProps.ctaSubtext;
  container.append(tryUsLink, document.createElement('br'), offerDetailsLink);
  return container;
};
const createCarouselBlock = (document, media) => {
  const cells = [
    ['Carousel'],
  ];

  [...media].forEach((el) => cells.push([el.outerHTML]));
  return WebImporter.DOMUtils.createTable(cells, document);
};
const addSectionBreak = (document) => {
  const seperator = document.createElement('hr');
  return seperator;
};

const createSelectionMetaData = (cells, document) => {
  const section = [
    ['Section Metadata'],
    ...cells,
  ];
  return WebImporter.DOMUtils.createTable(section, document);
};

const createTwoColumnsSection = (main, document, columnsEle) => {
  const style = columnsEle.getAttribute('style');
  const url = style.slice(style.indexOf('(') + 1, style.lastIndexOf(')'));
  const bImage = createMediaEle(url.replace(/2f/gi, '').replaceAll(' ', '').replace(/\\/g, '/'));
  const sectionCell = [
    ['style', 'columns-2,dark'],
    ['background', bImage],
  ];
  return createSelectionMetaData(sectionCell, document);
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
    // createColumnsBlock(main, document, 'landing');
    // create marquee / hero block
    const marqueeEl = main.querySelector('div.js-react.js-react-marquee-template');
    if (marqueeEl) marqueeEl.replaceWith(createMarqueBlock(main, document, marqueeEl), addSectionBreak(document));
    // insertSectionBreak(document);
    const faqEl = document.querySelector('div.js-react.js-react-faq') || document.querySelector('div.js-react.js-react-tabbed-faq');
    if (faqEl) faqEl.replaceWith(createFAQFrag(main, document), addSectionBreak(document));
    const gamefinderEl = document.querySelector('div.js-react.js-react-gamefinder');
    if (gamefinderEl) gamefinderEl.replaceWith(createGameFinderBlock(main, document, gamefinderEl), addSectionBreak(document));
    // still needs help block
    const supportEl = document.querySelector('img[src="/content/dam/sling-tv/smart-choice/smart-choice-lp/support-icon_gray.svg"]')?.closest('div')?.parentElement?.parentElement?.parentElement?.parentElement;
    if (supportEl) {
      supportEl.replaceWith(createFragmentLink(document, main, STILL_HAVE_QUESTIONS_FRAG), addSectionBreak(document));
    }
    const watchDevicesEl = document.querySelector('#supported-devices');
    if (watchDevicesEl) {
      watchDevicesEl.replaceWith(createFragmentLink(document, main, WATCH_ALL_DEVICES_FRAG), addSectionBreak(document));
    }

    // create columns like sections
    const columnElems = document.querySelectorAll('div:not([id]).cmp-container');
    columnElems.forEach((columnEl) => {
      const defaultContent = columnEl.querySelector('div.js-react.js-react-rich-text');
      const ctaElement = columnEl.querySelector('div.js-react.js-react-action-component');
      let cta = '';
      if (ctaElement) {
        let ctaEleProps = ctaElement.getAttribute(DATA_SLING_PROPS);
        ctaEleProps = ctaEleProps ? JSON.parse(ctaEleProps) : '';
        cta = creatCTALinks(document, ctaEleProps);
      }
      const media = columnEl.querySelectorAll('div.js-react.js-react-carousel img');
      columnEl.replaceWith(
        defaultContent || '',
        cta || '',
        createCarouselBlock(document, media),
        createTwoColumnsSection(main, document, columnEl),
        addSectionBreak(document),
      );
    });
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

    WebImporter.rules.createMetadata(main, document);
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
