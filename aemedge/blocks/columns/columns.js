import { buildBlock, decorateBlock, loadBlocks } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
      // if there are multiple pictures and no other content,
      // add a class to the column and build a carousel
      const textContent = col.textContent.trim();
      if (!textContent) {
        const pictures = [...col.querySelectorAll('picture')];
        if (pictures.length === 1) col.classList.add('columns-img-col');
        if (pictures.length > 1) {
          col.classList.add('columns-img-col-multi');
          col.innerHTML = '';
          const carouselContent = [];
          pictures.forEach((picture) => {
            carouselContent.push([picture]);
          });
          const carouselBlock = buildBlock('carousel', carouselContent);
          col.append(carouselBlock);
        }
      }
    });
  });
  const carouselBlocks = block.querySelectorAll('.columns-img-col-multi .carousel');
  if (carouselBlocks) {
    carouselBlocks.forEach(async (subBlock) => {
      decorateBlock(subBlock);
    });
    const main = document.querySelector('main');
    await loadBlocks(main);
  }
  const links = [
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/dakshin',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/hindi',
    'https://main--sling--aemsites.aem.live/international/desi-tv/dakshin',
    'https://main--sling--aemsites.aem.live/programming/sports/soccer',
    'https://main--sling--aemsites.aem.live/international/arabic',
    'https://main--sling--aemsites.aem.live/international/eu/french',
    'https://main--sling--aemsites.aem.live/international/eu/greek',
    'https://main--sling--aemsites.aem.live/international/eu/italian',
    'https://main--sling--aemsites.aem.live/international/eu/polish',
    'https://main--sling--aemsites.aem.live/international/brazilian',
    'https://main--sling--aemsites.aem.live/international/eastasian/cantonese',
    'https://main--sling--aemsites.aem.live/international/eastasian/mandarin',
    'https://main--sling--aemsites.aem.live/international/eastasian/taiwanese',
  ];
  const images = document.querySelectorAll('.columns div .columns-img-col img');
  images.forEach((img, index) => {
    const link = document.createElement('a');
    link.href = links[index] || '#';
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  });
}
