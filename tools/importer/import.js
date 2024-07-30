/* eslint-disable no-undef */
export default {
  transform: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    params,
  }) => {
    const BLUE_CTA_LINK = '/cart/magento/account?classification=us&plan=one-month&plan_offer=one-month-stair-step-10&sb=sling-mss';
    const ORANGE_CTA_LINK = '/cart/magento/account?classification=us&plan=one-month&plan_offer=one-month-stair-step-10&sb=domestic';
    const COMBO_CTA_LINK = '/cart/magento/account?classification=us&plan=one-month&plan_offer=one-month-stair-step-10&sb=sling-combo';
    const COMBO_SPORTS_LINK = '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=sling-combo&ats=sports-extra';
    const CTA_BLUE_FRAGMENT_URL = 'https://main--sling--aemsites.aem.page/fragments/try-sling-blue';
    const CTA_ORANGE_FRAGMENT_URL = 'https://main--sling--aemsites.aem.page/fragments/try-sling-orange';
    const CTA_COMBO_FRAGMENT_URL = 'https://main--sling--aemsites.aem.page/fragments/try-sling-combo';
    const CTA_COMBO_SPORTS_FRAGMENT_URL = 'https://main--sling--aemsites.aem.page/fragments/try-sling-cpmbo-sports';
    const CTA_MAP = new Map();
    CTA_MAP.set(BLUE_CTA_LINK, CTA_BLUE_FRAGMENT_URL);
    CTA_MAP.set(ORANGE_CTA_LINK, CTA_ORANGE_FRAGMENT_URL);
    CTA_MAP.set(COMBO_CTA_LINK, CTA_COMBO_FRAGMENT_URL);
    CTA_MAP.set(COMBO_SPORTS_LINK, CTA_COMBO_SPORTS_FRAGMENT_URL);

    const REMOVED_AUTHORS_LIST = [
      'Alex Castle',
      'Ben Macaluso',
      'Brad Koch',
      'Chase Cambria',
      'Emma Dell',
      'Joseph Berman',
      'Michele Drohan',
      'Oscar Enrqie Lorandi',
      'Scott Ross',
      'Tasha Shayne',
      'Wayne Mitchel',
    ];
    const HOSTNAME = new URL(params.originalURL).origin;
    // Remove unnecessary parts of the content
    const main = document.querySelector('main');
    const results = [];
    const meta = WebImporter.Blocks.getMetadata(document);
    let authorImage = document.querySelector('.author-card--author-image')?.src;
    let authorName = document.querySelector('.author-card--author-name')?.textContent;
    if (REMOVED_AUTHORS_LIST.includes(authorName)) {
      authorName = 'Sling Staff';
      authorImage = 'https://dish.scene7.com/is/image/dishenterprise/SLING%202023%20LOGO%201200x1200?$transparent-png-desktop$';
    }
    const publishDate = document.querySelector('.author-card--date')?.textContent || '';
    const tags = document.querySelectorAll('.author-card--tags a');
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;

    meta.Author = authorName || '';
    if (publishDate === '') {
      meta['Publication Date'] = '';
    } else {
      // eslint-disable-next-line prefer-destructuring
      meta['Publication Date'] = new Date(publishDate).toISOString().split('T')[0];
    }
    meta.Tags = Array.from(tags).map((tag) => tag.textContent).join(', ') || '';
    // meta.Image = ogImage.replace('https://www.sling.com', '') || '';
    const img = document.createElement('img');
    img.src = ogImage.replace('https://www.sling.comhttps://dish.scene7.com', 'https://dish.scene7.com') || '';
    meta.Image = img;
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

    // Handle different CTAs
    const ctas = document.querySelectorAll('.action-component .js-react-action-component');
    ctas.forEach((cta) => {
      const slingProps = JSON.parse(cta.getAttribute('data-sling-props'));
      const { ctaUrl } = slingProps;
      const { ctaText } = slingProps;
      const ctaFragment = document.createElement('a');
      if (CTA_MAP.has(ctaUrl)) {
        ctaFragment.href = CTA_MAP.get(ctaUrl);
        ctaFragment.textContent = CTA_MAP.get(ctaUrl);
        cta.parentElement.replaceChild(ctaFragment, cta);
      } else {
        ctaFragment.href = ctaUrl;
        ctaFragment.textContent = ctaText;
        const strong = document.createElement('strong');
        strong.append(ctaFragment);
        cta.parentElement.replaceChild(strong, cta);
      }
    });

    // Handle tables
    const tableElement = document.querySelector('table');
    const tables = document.querySelectorAll('table');
    let hasTable = 'false';
    if (tableElement) {
      hasTable = 'true';
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
        const cells = [[blockName]];
        const trs = document.querySelectorAll('table > tbody > tr');
        const newTable = WebImporter.DOMUtils.createTable(cells, document);
        const colspan = [...trs][0]?.children.length;
        trs.forEach((row) => newTable.append(row));
        const firstTH = newTable.querySelector('tr>th');
        firstTH.setAttribute('colspan', colspan);
        table.parentElement.replaceChild(newTable, table);
      });
    }
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

    // Handle centered h2 text ( wrap then in <strong>)
    const centeredHs = document.querySelectorAll('h2[style="text-align: center;"], h3[style="text-align: center;"],h4[style="text-align: center;"]');
    centeredHs.forEach((h) => {
      const p = document.createElement('p');
      const strongH = document.createElement('strong');
      strongH.append(h.cloneNode(true));
      p.append(strongH);
      h.replaceWith(p);
    });
    // Handle category pages
    const isCategoryPage = document.querySelector('.homepage-wrapper .blog-homepage--outer');
    let category = false;
    if (isCategoryPage) {
      const cells = [
        ['Category'],
        [''],
      ];
      const categoryBlock = WebImporter.DOMUtils.createTable(cells, document);
      // replace blog-homepage--outer with the category block
      isCategoryPage.parentElement.replaceChild(categoryBlock, isCategoryPage);
      // add metadata field
      meta.Template = 'blog-category';
      category = true;
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
    // commenting due to the issue - https://github.com/aemsites/sling/issues/122
    // if (main.querySelector('a[href^="#"]')) {
    //   const u = new URL(url);
    //   const links = main.querySelectorAll('a[href^="#"]');
    //   for (let i = 0; i < links.length; i += 1) {
    //     const a = links[i];
    //     a.href = `${u.pathname}${a.getAttribute('href')}`;
    //   }
    // }

    // issue - https://github.com/aemsites/sling/issues/122
    // treating h2s with 16px as h4
    if (main.querySelector('h2[style*="font-size: 16.0px"]')) {
      const h2s = main.querySelectorAll('h2[style*="font-size: 16.0px"]');
      for (let i = 0; i < h2s.length; i += 1) {
        const h4 = document.createElement('h4');
        h4.innerHTML = h2s[i].innerHTML;
        h2s[i].replaceWith(h4);
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
        path: newPath,
        authorImage,
        category,
        hasTable,
      },
    });
    return results;
  },
};
