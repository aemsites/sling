// Blog Hero Block
import { buildBlock } from '../../scripts/aem.js';

export default function decorate(block) {
  const h1 = main.querySelector('h1');
  if (h1) h1.classList.add('blog-primary-title');
  const images = [];
  main.querySelectorAll('picture').forEach((image, idx) => {
    // eslint-disable-next-line no-bitwise
    if (h1 && (h1.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_PRECEDING)) {
      images.push(image);
      if (idx === 0) image.classList.add('desktop');
      if (idx === 1) {
        image.classList.add('mobile');
        // load eager on mobile
        const mquery = window.matchMedia('(max-width: 900px)');
        if (mquery.matches) {
          image.querySelector('img').setAttribute('loading', 'eager');
        }
      }
    }
  });
  const section = document.createElement('div');
  section.append(buildBlock('blog-hero', { elems: images }));
  section.append(h1);
  block.prepend(section);
}
