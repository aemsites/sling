// eslint-disable-next-line import/no-unresolved
import {
  toClassName, buildBlock, decorateBlock, loadBlock,
} from '../../scripts/aem.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  const isFaq = block.classList.contains('faq');
  let newBlock;
  if (isFaq) {
    // build a new block with accordion in the 2nd column
    newBlock = document.createElement('div');
    // build accordion for the tabContent
    const rows = [...block.children];
    let currentTabCategory;
    let oldTabCategory;
    let accordionContent = [];
    // const tabContent = [];
    rows.forEach(async (row) => {
      const is3Col = row.children.length === 3;
      if (is3Col) {
        oldTabCategory = currentTabCategory;
        currentTabCategory = row.firstElementChild;
        console.log(`oldTabCategory: ${oldTabCategory?.textContent}, currentTabCategory: ${currentTabCategory.textContent}`);
      }
      if (oldTabCategory && (oldTabCategory.textContent !== currentTabCategory.textContent)) {
        // new tab category found - build accordion with the existing accordionContent
        const accordion = buildBlock('accordion', accordionContent);
        console.log('category: ', oldTabCategory.textContent, 'tabContent: ', accordion);
        // add tabCategory and accordionContent to newDiv
        const tabCategoryDiv = document.createElement('div');
        tabCategoryDiv.innerHTML = oldTabCategory.innerHTML;
        const tabContentDiv = document.createElement('div');
        tabContentDiv.append(accordion);
        const newRow = document.createElement('div');
        newRow.append(tabCategoryDiv);
        newRow.append(tabContentDiv);
        newBlock.append(newRow);
        accordionContent = [];
        oldTabCategory = null;
      } else {
        if (is3Col) {
          row.children[0].remove();
        }
        const accKey = row.children[0].innerHTML;
        const accValue = row.children[1].innerHTML;
        accordionContent.push([accKey, accValue]);
        // console.log('accordionContent: ', JSON.stringify(accordionContent));
      }
    });
    // console.log('newBlock: ', newBlock);

    block.innerHTML = '';
    block.innerHTML = newBlock.innerHTML;
  }

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
