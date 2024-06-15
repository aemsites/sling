// eslint-disable-next-line import/no-unresolved
import {
  toClassName, buildBlock, decorateBlock, loadBlocks,
} from '../../scripts/aem.js';

const AVAILABLE_SUB_BLOCKS = ['accordion', 'columns'];

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  const isNonStandard = ([...block.children][0]).children.length === 3;
  let newBlock;
  // if tabs has 3 columns, use first col for tab category and 2nd and 3rd for tab content
  // and build the block based on the variant provided
  if (isNonStandard) {
    const subBlockToBuild = [...block.classList].filter(
      (className) => AVAILABLE_SUB_BLOCKS.includes(className),
    )[0];
    // build a new block with sub block in the 2nd column
    newBlock = document.createElement('div');
    // build content for the sub block
    const rows = [...block.children];
    block.innerHTML = '';
    let currentTabCategory;
    let oldTabCategory;
    let subBlockContent = [];
    rows.forEach(async (row, i) => {
      const is3Col = row.children.length === 3;
      if (is3Col || (i === (rows.length - 1))) {
        oldTabCategory = currentTabCategory;
        currentTabCategory = row.firstElementChild;
      }
      if (i === (rows.length - 1)) {
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
      if ((i === (rows.length - 1))
          || (oldTabCategory && (oldTabCategory.textContent !== currentTabCategory.textContent))) {
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
    // set block to newBlock
    block.innerHTML = newBlock.innerHTML;
    // decorate subBlocks
    const subBlocks = block.querySelectorAll(`.${subBlockToBuild}`);
    await subBlocks.forEach(async (subBlock) => {
      decorateBlock(subBlock);
    });
    const main = document.querySelector('main');
    await loadBlocks(main);
  }

  // continue processing tabs as usual
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
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

  block.prepend(tablist);
}
