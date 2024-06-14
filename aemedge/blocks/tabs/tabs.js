// eslint-disable-next-line import/no-unresolved
import {
  toClassName, buildBlock, decorateBlock, loadBlocks,
} from '../../scripts/aem.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  const isFaq = block.classList.contains('faq');
  let newBlock;
  try {
    if (isFaq) {
      // build a new block with accordion in the 2nd column
      newBlock = document.createElement('div');
      // build accordion for the tabContent
      const rows = [...block.children];
      block.innerHTML = '';
      let currentTabCategory;
      let oldTabCategory;
      let accordionContent = [];
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
          accordionContent.push([accKey, accValue]);
        }
        if ((i === (rows.length - 1))
          || (oldTabCategory && (oldTabCategory.textContent !== currentTabCategory.textContent))) {
          // new tab category found - build accordion with the existing accordionContent
          const accordion = buildBlock('accordion', accordionContent);
          // add tabCategory and accordionContent to newDiv
          const tabCategoryDiv = document.createElement('div');
          tabCategoryDiv.innerHTML = oldTabCategory.innerHTML;
          const tabContentDiv = document.createElement('div');
          tabContentDiv.append(accordion);
          const newRow = document.createElement('div');
          newRow.append(tabCategoryDiv);
          newRow.append(tabContentDiv);
          newBlock.append(newRow);
          // reset accordionContent for the next set of rows
          accordionContent = [];
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
        accordionContent.push([accKey, accValue]);
      });
      // set block to newBlock
      block.innerHTML = newBlock.innerHTML;
      // decorate accordions
      const accordionBlocks = block.querySelectorAll('.accordion');
      await accordionBlocks.forEach(async (accordionBlock) => {
        decorateBlock(accordionBlock);
      });
      const main = document.querySelector('main');
      await loadBlocks(main);
    }
  } catch (e) {
    console.error(e);
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
