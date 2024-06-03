/* eslint-disable no-undef */
export default {
  transform: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    params,
  }) => {
    const CTA_FRAGMENT_URL = 'https://main--sling--aemsites.hlx.page/fragments/try-sling';
    // Remove unnecessary parts of the content
    const main = document.body;
    const results = [];
    const meta = WebImporter.Blocks.getMetadata(document);
    const authorName = document.querySelector('.author-card--author-name')?.textContent;
    const publishDate = document.querySelector('.author-card--date')?.textContent;
    const tags = document.querySelectorAll('.author-card--tags a');
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;
    const authorImage = document.querySelector('.author-card--author-image')?.src;
    meta.Author = authorName;
    meta.Date = publishDate;
    meta.Tags = Array.from(tags).map((tag) => tag.textContent).join(', ');
    meta.Image = ogImage.replace('https://www.sling.com', '');
    const youtubeIframes = document.querySelectorAll('iframe[src*="youtube"]');
    // Handle youtube videos
    youtubeIframes.forEach((iframe) => {
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
    ]);

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);
    // // Add metadata block to the document
    const block = WebImporter.Blocks.getMetadataBlock(document, meta);

    // // append the block to the main element
    main.append(block);

    const newPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
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
