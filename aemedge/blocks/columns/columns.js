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
}
