import { buildBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Get content and build the accordion and tags blocks
  let currentTabCategory;
  let oldTabCategory;
  const accordionContent = [];
  const tabContent = [];
  // const tabs = [...block.children].map((child) => {
  //   if (child.children.length === 3) {
  //     tabCategory = child.firstElementChild;
  //   } else {
  //     child.prepend(tabCategory);
  //   }
  //   return tabCategory;
  // });
  [...block.children].forEach((row) => {
    const is2Col = row.children.length === 2;
    const is3Col = row.children.length === 3;
    console.log(`this row is2Col: ${is2Col}, is3Col: ${is3Col}`);
    if (is3Col) {
      oldTabCategory = currentTabCategory;
      currentTabCategory = row.firstElementChild;
      console.log(`oldTabCategory: ${oldTabCategory.textContent}, currentTabCategory: ${currentTabCategory.textContent}`);
    }
    if (oldTabCategory && (oldTabCategory.textContent !== currentTabCategory.textContent)) {
      // build accordion with the content
      const accordion = buildBlock('accordion', { elems: accordionContent });
      tabContent.push([oldTabCategory.content, accordion]);
      accordionContent = [];
    } else {
      const accContent = is3Col ? [[...row.children][1], [...row.children][2]]
        : [[...row.children][0], [...row.children][1]];
      accordionContent.push(accContent);
    }
  });
  block.innerHTML = '';
  const tabs = buildBlock('tabs', tabContent);
  block.append(tabs);
}
