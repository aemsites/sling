/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

/* eslint-disable no-undef */
const DATA_SLING_PROPS = 'data-sling-props';
const EDS_BASE_URL = 'https://main--sling--aemsites.aem.page';
const SLING_BASE_URL = 'https://www.sling.com';
const OFFER_DETAIL_MODAL_URL = '/aemedge/modals/try-sling-offer-details';
const STILL_HAVE_QUESTIONS_FRAG = '/aemedge/fragments/still-have-questions';
const WATCH_ALL_DEVICES_FRAG = '/aemedge/fragments/home-page-supported-devices';
const FAQ_GLOBAL_FRAG_PATH = '/aemedge/fragments/home/faq/homepage-faqs/faq-global';
const FAQ_NBA_FRAG_PATH = '/aemedge/fragments/faq-nba';
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

const createMediaEle = (document, bgMediaUrl, altText = SLING_BG_IMG_ALT) => {
  let element;
  if (bgMediaUrl) {
    if (bgMediaUrl.startsWith('https://dish.scene7.com') || bgMediaUrl.endsWith('.mp4')) {
      element = document.createElement('a');
      if (bgMediaUrl.startsWith('/content/dam')) {
        element.href = `${SLING_BASE_URL}${bgMediaUrl}`;
        element.innerText = element.href;
      } else {
        element.href = bgMediaUrl;
        element.innerText = element.href;
      }
    } else {
    // const existingImg = document.querySelector(`img[src='${bgMediaUrl}']`);
    // if (existingImg) existingImg.remove();
      element = document.createElement('img');
      element.src = bgMediaUrl;
      element.alt = altText;
      element.loading = 'eager';
    }
    return element.outerHTML;
  } return '';
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

    const bgDesktop = backgroundMediaUrlDesktop ? createMediaEle(document, backgroundMediaUrlDesktop) : '';
    const bgTablet = backgroundMediaUrlTablet ? createMediaEle(document, backgroundMediaUrlTablet) : '';
    const bgMobile = backgroundMediaUrlMobile ? createMediaEle(document, backgroundMediaUrlMobile) : '';

    const fgDesktop = mediaUrlDesktop ? createMediaEle(document, mediaUrlDesktop, mediaAlt) : '';
    const fgTablet = mediaUrlTablet ? createMediaEle(document, mediaUrlTablet, mediaAlt) : '';
    const fgMobile = mediaUrlMobile ? createMediaEle(document, mediaUrlMobile, mediaAlt) : '';

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
  if (title && title.innerHTML?.includes('NBA')) {
    return createFragmentLink(document, main, FAQ_NBA_FRAG_PATH);
  }
  return createFragmentLink(document, main, FAQ_GLOBAL_FRAG_PATH);
};

const creatCTALinks = (document, ctaElemProps) => {
  const container = document.createElement('div');
  const tryusP = document.createElement('p');
  const tryUsLink = document.createElement('a');
  tryUsLink.href = ctaElemProps.ctaUrl.startsWith('/') ? `${EDS_BASE_URL}${ctaElemProps.ctaUrl}` : ctaElemProps.ctaUrl;
  tryUsLink.title = ctaElemProps.ctaText;
  tryUsLink.innerHTML = `<del>${ctaElemProps.ctaText}</del>`;
  tryusP.append(tryUsLink);
  const offerP = document.createElement('p');
  const offerDetailsLink = document.createElement('a');
  offerDetailsLink.href = `${EDS_BASE_URL}${OFFER_DETAIL_MODAL_PATH}`;
  offerDetailsLink.innerHTML = `<sup>${ctaElemProps.ctaSubtext}</sup>`;
  offerP.append(offerDetailsLink);
  container.append(tryusP, offerP);
  return container;
};

const createCTALink = (document, ctaUrl, ctaLinkTxt, ctaType) => {
  if (ctaUrl) {
    const cta = document.createElement('a');
    cta.href = ctaUrl.startsWith('/') ? `${EDS_BASE_URL}${ctaUrl}` : ctaUrl;
    cta.title = ctaLinkTxt;
    if (ctaType === 'primary') cta.innerHTML = `<del>${ctaLinkTxt}</del>`;
    if (ctaType === 'steam') cta.innerHTML = `<em><del>${ctaLinkTxt}</del></em>`;
    return cta;
  } return '';
};

const createOfferDetailsLink = (document, offerLinkTxt) => {
  const offerDetailsLink = document.createElement('a');
  offerDetailsLink.href = `${EDS_BASE_URL}${OFFER_DETAIL_MODAL_PATH}`;
  offerDetailsLink.innerHTML = `<sup>${offerLinkTxt}</sup>`;
  return offerDetailsLink;
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

const createSectionMetaData = (cells, document) => {
  const section = [
    ['Section Metadata'],
    ...cells,
  ];
  return WebImporter.DOMUtils.createTable(section, document);
};

const createTwoColumnsSection = (main, document, columnsEle) => {
  const style = columnsEle.getAttribute('style');
  if (style) {
    const url = style.slice(style.indexOf('(') + 1, style.lastIndexOf(')'));
    const bImage = createMediaEle(document, url.replace(/2f/gi, '').replaceAll(' ', '').replace(/\\/g, '/'));
    const sectionCell = [
      ['style', 'columns-2,dark'],
      ['background', bImage],
    ];
    return createSectionMetaData(sectionCell, document);
  }
  return '';
};
const createPackageCardBlock = (document, packagecardEle) => {
  const cells = [
    ['Package Cards'],
  ];
  const propsMap = new Map([
    ['data-sling-package-cards-plan-id', 'Plan Id'],
    ['data-sling-package-cards-plan-identifier-a-c', 'Plan Identifier'],
    ['data-sling-package-cards-plan-offer-identifier', 'Plan Offer Identifier'],
    ['data-sling-package-cards-classification', 'Classification'],
    ['data-sling-package-cards-classification-a-c', 'Classification A C'],
    ['data-sling-package-cards-card-two-type', 'Card Two Type'],
    ['data-sling-package-cards-card-one-config', 'Card One Config'],
    ['data-sling-package-cards-card-two-config', 'Card Two Config'],
  ]);
  const cardProps = new Map([
    ['packId', 'Pack Id'],
    ['title', 'Ttiel'],
    ['priceText', 'Price Text'],
    ['showPromotionalPrice', 'Show Promotional Price'],
    ['promotionalText', 'Promotional Text'],
    ['channelNumber', 'Channel Number'],
    ['singleChannelText', 'Single Channel Text'],
    ['multipleChannelText', 'Multiple Channel Text'],
    ['linkText', 'Link Text'],
    ['overrideLogos', 'Override Logos'],
    ['logos', 'Logos'],
  ]);
  const attributeNames = packagecardEle.getAttributeNames();
  attributeNames.forEach((name) => {
    if (propsMap.has(name)) {
      if (!name.includes('-config')) {
        cells.push([`${propsMap.get(name)}`, `${packagecardEle.getAttribute(name)}`]);
      } else {
        let cardPrefix = 'C1 ';
        if (name.includes('-card-two')) cardPrefix = 'C2 ';
        cells.push([`${propsMap.get(name)}`]);
        const configProps = JSON.parse(packagecardEle.getAttribute(name));
        Object.entries(configProps).forEach((entry) => {
          const [key, value] = entry;
          if (key === 'logos') {
            const logos = [];
            if (value) {
              value.forEach((logo) => {
                logos.push(`${logo.channelSign} = ${logo.altText}`);
              });
            }
            cells.push([`${cardPrefix}${cardProps.get(key)}`, logos.join('</br>')]);
          } else cells.push([`${cardPrefix}${cardProps.get(key)}`, value || '']);
        });
      }
      // console.log(packagecardEle.getAttribute(name));
    }
  });
  // attributes.forEach((attr) => console.log(`${attr.name} = ${attr.value}`));

  return WebImporter.DOMUtils.createTable(cells, document);
};
const createLandingColumnsBlock = (document, txtImgColumns) => {
  const cells = [['Columns(landing,middle)']];

  txtImgColumns.forEach((txtImgColumn) => {
    // keeping only one image for columns block as desktop & mobile are using the same
    const images = txtImgColumn.querySelectorAll('img');
    if (images?.length === 2) images[1].remove();
    const reverse = txtImgColumn.querySelector('div.reverse-on-mobile');
    const columns = txtImgColumn.querySelectorAll('div.js-column-carousel-column');
    if (reverse) cells.push([...columns].reverse());
    else cells.push([...columns]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createBannerBlock = (document, bannerEl) => {
  const props = JSON.parse(bannerEl.getAttribute(DATA_SLING_PROPS));
  let blockName = 'Banner Image';
  let variant;
  if (variant) blockName = `${blockName}(${variant})`;
  const cells = [
    [blockName],
    ['Headline', props.heading || ''],
    ['Sub headline', props.subHeading || ''],
    ['foreground', createMediaEle(document, props.contentImg) || ''],
    ['background', [createMediaEle(document, props.desktopImg), createMediaEle(document, props.mobImg)].join('</br>')],
    ['CTA', createCTALink(document, props.imgLink, props.ctaText, props.buttonStyle)],
    ['Offer details', createOfferDetailsLink(document, props.ctaSubtext)],
    ['Background fit', props.objectFit || ''],
    ['background gradient', props.gradientType || ''],
    ['Background color', props.backgroundColor || ''],
    ['ctaAnalyticsParent', props.ctaAnalyticsParent || ''],
    ['ctaAnalyticsComponent', props.ctaAnalyticsComponent || ''],
    ['ctaAnalyticsName', props.ctaAnalyticsName || ''],
    ['ctaAnalyticsTarget', props.ctaAnalyticsTarget || ''],
  ];
  return WebImporter.DOMUtils.createTable(cells, document);
};
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
    // [...main.querySelectorAll('img')].forEach((img) => {
    //  if (img.src?.includes('dish.scene7.com')) {
    //    const srcLink = document.createElement('a');
    //    srcLink.href = img.src;
    //    srcLink.innerText = img.src;
    //    img.replaceWith(srcLink);
    //  }
    // });
    // create marquee / hero block
    const marqueeEl = main.querySelector('div.js-react.js-react-marquee-template');
    if (marqueeEl) marqueeEl.parentElement.replaceWith(createMarqueBlock(main, document, marqueeEl), addSectionBreak(document));

    const bannerElems = main.querySelectorAll('div.js-react.js-react-banner');
    bannerElems.forEach((bannerEl) => {
      bannerEl.replaceWith(createBannerBlock(document, bannerEl));
    });
    // create package cards
    const packageCardElems = document.querySelectorAll('div.js-react.js-react-package-cards');
    packageCardElems.forEach((packagecardEle) => {
      packagecardEle.replaceWith(
        addSectionBreak(document),
        createPackageCardBlock(document, packagecardEle),
      );
    });
    const packageCardcontainers = document.querySelectorAll('.cmp-container');
    packageCardcontainers.forEach((pContainer) => {
      const lastContainer = pContainer.querySelector('div.container:last-of-type');
      if (lastContainer) {
        if (!lastContainer.querySelector('table')) {
          lastContainer.append(
            createSectionMetaData([['style', 'columns-2']], document),
            addSectionBreak(document),
          );
        }
        if (lastContainer.querySelectorAll('hr')) {
          addSectionBreak(document);
        }
      }
    });
    const faqEl = document.querySelector('div.js-react.js-react-faq') || document.querySelector('div.js-react.js-react-tabbed-faq');
    if (faqEl) faqEl.replaceWith(createFAQFrag(main, document), addSectionBreak(document));
    const gamefinderEl = document.querySelector('div.js-react.js-react-gamefinder');
    if (gamefinderEl) {
      gamefinderEl.replaceWith(
        createGameFinderBlock(main, document, gamefinderEl),
        addSectionBreak(document),
      );
    }
    // still needs help block
    const supportEl = document.querySelector('img[src="/content/dam/sling-tv/smart-choice/smart-choice-lp/support-icon_gray.svg"]')?.closest('div')?.parentElement?.parentElement?.parentElement?.parentElement;
    if (supportEl) {
      supportEl.replaceWith(
        createFragmentLink(document, main, STILL_HAVE_QUESTIONS_FRAG),
        addSectionBreak(document),
      );
    }
    const watchDevicesEl = document.querySelector('#supported-devices');
    if (watchDevicesEl) {
      watchDevicesEl.replaceWith(
        createFragmentLink(document, main, WATCH_ALL_DEVICES_FRAG),
        addSectionBreak(document),
      );
    }

    // replace all CTA elemements with links
    const ctaElements = document.querySelectorAll('div.js-react.js-react-action-component');
    ctaElements.forEach((ctaElement) => {
      if (ctaElement) {
        let ctaEleProps = ctaElement.getAttribute(DATA_SLING_PROPS);
        ctaEleProps = ctaEleProps ? JSON.parse(ctaEleProps) : '';
        ctaElement.replaceWith(creatCTALinks(document, ctaEleProps));
      }
    });

    const imgTxtColumns = document.querySelectorAll('div.column-control.column-carousel');
    if (imgTxtColumns) {
      imgTxtColumns[0]?.parentElement?.replaceWith(
        createLandingColumnsBlock(document, imgTxtColumns),
        addSectionBreak(document),
      );
    }
    // import single column carousel
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
      '.js-react-header',
      '.header',
      '.new-header',
      '#global-nav',
      'nav',
      '.nav',
      'footer',
      '.footer',
      'iframe',
      'noscript',
      '.js-react.js-react-spacer',
      '.spacer',
      '.vspo-highlight-banner',
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
