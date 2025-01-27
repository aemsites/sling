/* eslint-disable no-undef */
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

const createMarqueBlock = (main, document) => {
  const el = document.createElement('img');
  el.src = 'https://www.sample.com/images/helloworld.png';

  const cells = [
    ['Marquee'],
    ['Title', 'The Hello World page'],
    ['Sub Title', 'This is a really cool Hello World page.'],
    ['Image', el],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};

const createFAQBlock = (main, document) => {
  const cells = [
    ['Fragment'],
    ['Replace with Fragment URL'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};

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
    createMarqueBlock(main, document);
    createFAQBlock(main, document);
    // create metadata block
    createMetadataBlock(main, document);

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
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
