/* eslint-disable no-undef */
export default {
  transform: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    params,
  }) => {
    const CTA_FRAGMENT_URL = 'https://main--sling--aemsites.aem.page/fragments/try-sling';
    const HOSTNAME = new URL(params.originalURL).origin;
    // Remove unnecessary parts of the content
    const main = document.querySelector('main');
    const results = [];
    const meta = WebImporter.Blocks.getMetadata(document);
    const authorName = document.querySelector('.author-card--author-name')?.textContent;
    const publishDate = document.querySelector('.author-card--date')?.textContent || '';
    const tags = document.querySelectorAll('.author-card--tags a');
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;
    const authorImage = document.querySelector('.author-card--author-image')?.src;
    meta.Author = authorName || '';
    if (publishDate === '') {
      meta['Publication Date'] = '';
    } else {
      // eslint-disable-next-line prefer-destructuring
      meta['Publication Date'] = new Date(publishDate).toISOString().split('T')[0];
    }
    meta.Tags = Array.from(tags).map((tag) => tag.textContent).join(', ') || '';
    meta.Image = ogImage.replace('https://www.sling.com', '') || '';
    const videoIframes = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="platform.twitter.com"]');
    // Handle embed youtube or twitter videos
    videoIframes.forEach((iframe) => {
      // replace the iframe with the video URL
      const videoUrl = iframe.src;
      const video = document.createElement('a');
      video.href = videoUrl;
      video.textContent = videoUrl;
      iframe.parentElement.replaceChild(video, iframe);
    });

    // Handle CTAs
    const ctas = document.querySelectorAll('.action-component .js-react-action-component');
    ctas.forEach((cta) => {
      const slingProps = JSON.parse(cta.getAttribute('data-sling-props'));
      if (slingProps.ctaText === 'TRY SLING TV TODAY!') {
        const ctaFragment = document.createElement('a');
        ctaFragment.href = CTA_FRAGMENT_URL;
        ctaFragment.textContent = CTA_FRAGMENT_URL;
        cta.parentElement.replaceChild(ctaFragment, cta);
      }
    });

    // Handle tables
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      let blockName = 'Table';
      // handling table variants
      const style = document.querySelector('table > tbody > tr > td[style]')?.getAttribute('style');
      if (style) {
        if (style.indexOf('rgb(0,30,120)') > -1) {
          blockName = 'Table(schedule)';
        } else if (style.indexOf('rgb(84,172,210)') > -1) {
          blockName = 'Table(playoffs)';
        }
      }
      const cells = [[blockName], [table.outerHTML]];
      const newTable = WebImporter.DOMUtils.createTable(cells, document);
      table.parentElement.replaceChild(newTable, table);
    });

    // Handle Gamefinder block
    const gameFinders = document.querySelectorAll('div.gamefinder');
    gameFinders.forEach((gameFinder) => {
      const cells = [['Game Finder']];
      const reactDiv = gameFinder.querySelector('div.js-react-gamefinder');
      let props;
      if (reactDiv) {
        props = reactDiv.getAttribute('data-sling-props');
        if (props) {
          const blockConfigs = ['numberOfDays', 'leagueList', 'planIdentifier'];
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(JSON.parse(props))) {
            if (blockConfigs.includes(key)) cells.push([`${key}`, `${value}`]);
          }
        }
      }
      const gameFinderBlock = WebImporter.DOMUtils.createTable(cells, document);
      gameFinder.parentElement.replaceChild(gameFinderBlock, gameFinder);
    });
    // Handle category pages
    const isCategoryPage = document.querySelector('.homepage-wrapper .blog-homepage--outer');
    if (isCategoryPage) {
      const cells = [
        ['Category'],
        [''],
      ];
      const categoryBlock = WebImporter.DOMUtils.createTable(cells, document);
      // replace blog-homepage--outer with the category block
      isCategoryPage.parentElement.replaceChild(categoryBlock, isCategoryPage);
      // add metadata field
      meta.Category = 'true';
    }

    // Remove subscribe form at the bottom of the articles
    const subscribeForm = document.querySelector('.email-capture-new')?.parentElement;
    if (subscribeForm) {
      subscribeForm.remove();
    }

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
      'nav',
      '.nav',
      'footer',
      '.footer',
      'noscript',
      'iframe',
      '.breadcrumb',
      '.author-card',
      '.popular-content',
      '.js-react-spacer',
      '.email-capture--container',
      '.blog-homepage--outer',
    ]);

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);
    // // Add metadata block to the document
    const block = WebImporter.Blocks.getMetadataBlock(document, meta);

    // Handle anchor links or odd links
    if (main.querySelector('a[href^="#"]')) {
      const u = new URL(url);
      const links = main.querySelectorAll('a[href^="#"]');
      for (let i = 0; i < links.length; i += 1) {
        const a = links[i];
        a.href = `${u.pathname}${a.getAttribute('href')}`;
      }
    }

    // Handle relative links
    const relativeLinks = main.querySelectorAll('a[href^="/"]');
    for (let i = 0; i < relativeLinks.length; i += 1) {
      const a = relativeLinks[i];
      a.href = `${HOSTNAME}${a.getAttribute('href')}`;
    }

    // // append the block to the main element
    main.append(block);

    const newPathUrl = new URL(params.originalURL).pathname;
    const newPath = decodeURIComponent(newPathUrl)
      .toLowerCase()
      .replace(/\/$/, '')
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
    // const newPath = decodeURIComponent(new URL(url).pathname)
    //                .replace('.htm', '').replace('/news/', `/news/${publishedYear}/`);
    // const destinationUrl = WebImporter.FileUtils.sanitizePath(newPath);
    results.push({
      element: main,
      path: newPath,
      report: {
        'Destination Path': newPath,
        'Author Image': authorImage,
      },
    });
    return results;
  },
};
