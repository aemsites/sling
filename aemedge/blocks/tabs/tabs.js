// eslint-disable-next-line import/no-unresolved
import {
  toClassName, buildBlock, decorateBlock, loadBlocks,
} from '../../scripts/aem.js';

import { decorateButtons } from '../../scripts/scripts.js';

const AVAILABLE_SUB_BLOCKS = ['accordion', 'columns', 'carousel'];

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  // nonStandard = mix of 2 and 3 column rows for sub blocks under tabs
  // standard = all 3 column rows for sub blocks under tabs
  const numColumns = [...block.children].filter((child) => child.children.length === 3);
  const isStandard = numColumns.length === block.children.length;
  const isNonStandard = numColumns.length !== block.children.length;
  let newBlock;
  // if tabs has 3 columns, use first col for tab category and 2nd and 3rd for tab content
  // and build the block based on the variant provided
  if (isStandard || isNonStandard) {
    const subBlockToBuild = [...block.classList].filter(
      (className) => AVAILABLE_SUB_BLOCKS.includes(className),
    )[0];
    // build a new block with sub block in the 2nd column
    if (subBlockToBuild) {
      newBlock = document.createElement('div');
      // build content for the sub block
      const rows = [...block.children];
      block.innerHTML = '';
      if (subBlockToBuild === 'carousel') {
        rows.forEach((row) => {
          // Create carousel content structure
          const carouselContent = [];
          const images = [...row.children[1].querySelectorAll('picture')];
          // Create proper carousel rows structure
          images.forEach((image) => {
            const carouselRow = document.createElement('div');
            const imageDiv = document.createElement('div');
            imageDiv.append(image.cloneNode(true));
            carouselRow.append(imageDiv);
            carouselContent.push([imageDiv.innerHTML]);
          });
          const subBlock = buildBlock(subBlockToBuild, carouselContent);
          subBlock.classList.add('wide'); // Add wide class for full-width styling
          const tabCategoryDiv = document.createElement('div');
          tabCategoryDiv.innerHTML = row.firstElementChild.innerHTML;
          const tabContentDiv = document.createElement('div');
          tabContentDiv.append(subBlock);
          const newRow = document.createElement('div');
          newRow.append(tabCategoryDiv);
          newRow.append(tabContentDiv);
          newBlock.append(newRow);
        });
      } else {
        if (isNonStandard) {
          let currentTabCategory;
          let oldTabCategory;
          let subBlockContent = [];
          rows.forEach((row, i) => {
            const is3Col = row.children.length === 3;
            if (is3Col || (i === (rows.length - 1))) {
              oldTabCategory = currentTabCategory;
              currentTabCategory = row.firstElementChild;
            }
            if (!is3Col && (i === (rows.length - 1))) {
              let accKey;
              let accValue;
              if (is3Col) {
                accKey = row.children[1].innerHTML;
                accValue = row.children[2].innerHTML;
              } else {
                accKey = row.children[0].innerHTML;
                accValue = row.children[1].innerHTML;
              }
              subBlockContent.push([accKey, accValue]);
            }
            if (oldTabCategory && (oldTabCategory.textContent !== currentTabCategory.textContent)) {
              // new tab category found - build sub block with the existing content
              const subBlock = buildBlock(subBlockToBuild, subBlockContent);
              // add tabCategory and sub block content to newDiv
              const tabCategoryDiv = document.createElement('div');
              tabCategoryDiv.innerHTML = oldTabCategory.innerHTML;
              const tabContentDiv = document.createElement('div');
              tabContentDiv.append(subBlock);
              const newRow = document.createElement('div');
              newRow.append(tabCategoryDiv);
              newRow.append(tabContentDiv);
              newBlock.append(newRow);
              // reset subBlockContent for the next set of rows
              subBlockContent = [];
              oldTabCategory = null;
            }
            let accKey;
            let accValue;
            if (is3Col) {
              accKey = row.children[1].innerHTML;
              accValue = row.children[2].innerHTML;
            } else {
              accKey = row.children[0].innerHTML;
              accValue = row.children[1].innerHTML;
            }
            subBlockContent.push([accKey, accValue]);
          });
        }
        if (isStandard) {
          rows.forEach((row) => {
            const subBlockContent = [];
            const contentKey = row.children[1].innerHTML;
            const contentValue = row.children[2].innerHTML;
            subBlockContent.push([contentKey, contentValue]);
            // build sub block with the existing content
            const subBlock = buildBlock(subBlockToBuild, subBlockContent);
            // add tabCategory and sub block content to newDiv
            const tabCategoryDiv = document.createElement('div');
            tabCategoryDiv.innerHTML = row.firstElementChild.innerHTML;
            const tabContentDiv = document.createElement('div');
            tabContentDiv.append(subBlock);
            const newRow = document.createElement('div');
            newRow.append(tabCategoryDiv);
            newRow.append(tabContentDiv);
            newBlock.append(newRow);
          });
        }
      }
      // set block to newBlock
      block.innerHTML = newBlock.innerHTML;
      // decorate subBlocks
      const subBlocks = block.querySelectorAll(`.${subBlockToBuild}`);
      subBlocks.forEach((subBlock) => {
        decorateBlock(subBlock);
      });
      decorateButtons(block);
    }
  }

  // continue processing tabs as usual
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  const className = block.classList.value;
  let defaultTabIndex = 0;
  if (block.classList.value.includes('default')) {
    const splitClassName = className.split(' ');
    splitClassName.forEach((name) => {
      if (name.includes('default-')) {
        defaultTabIndex = parseInt(name.split('-')[1], 10);
      }
    });
  }

  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');
    if (!hasWrapper(tabpanel.lastElementChild)) {
      tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
    }
    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });
  tablist.children[defaultTabIndex].click();

  block.prepend(tablist);
  if (isStandard || isNonStandard) {
    await loadBlocks(block);
  }
}
