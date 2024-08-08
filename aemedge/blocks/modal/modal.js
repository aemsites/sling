import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, decorateIcons, loadBlock, loadCSS,
} from '../../scripts/aem.js';

// This is not a traditional block, so there is no decorate function. Instead, links to
// a */modals/* path  are automatically transformed into a modal. Other blocks can also use
// the createModal() and openModal() functions.

function createObserver() {
  console.log('observer called');
  const nav = document.querySelector('.zipcode-wrapper');
  const header = document.querySelector('.comparison-table-content .header-row');
  const orangenav = document.querySelector('.orange-header');
  const bluenav = document.querySelector('.blue-header');
  const commonnav = document.querySelector('.combo-header');

  const options = {
    root: document.querySelector('.modal-content'),
    rootMargin: '',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        console.log('if');
        header.classList.add('sticky');
        orangenav.classList.add('sticky');
        bluenav.classList.add('sticky');
        commonnav.classList.add('sticky');
      } else {
        console.log('else');
        header.classList.remove('sticky');
        orangenav.classList.remove('sticky');
        bluenav.classList.remove('sticky');
        commonnav.classList.remove('sticky');
      }
    });
  }, options);

  if (nav) {
    observer.observe(nav);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate() {
  setTimeout(createObserver, 100);
}

export async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  const buttondiv = document.createElement('div');
  buttondiv.classList.add('close-button-div');
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  buttondiv.append(closeButton);
  dialog.append(buttondiv);
  dialog.append(dialogContent);
  // close dialog on clicks outside the dialog. https://stackoverflow.com/a/70593278/79461
  dialog.addEventListener('click', (event) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (event.clientX < dialogDimensions.left || event.clientX > dialogDimensions.right
      || event.clientY < dialogDimensions.top || event.clientY > dialogDimensions.bottom) {
      dialog.close();
    }
  });

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);
  decorateIcons(closeButton);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.append(dialog);
  return {
    block,
    showModal: () => {
      dialog.showModal();
      // Google Chrome restores the scroll position when the dialog is reopened,
      // so we need to reset it.
      setTimeout(() => { dialogContent.scrollTop = 0; }, 0);

      document.body.classList.add('modal-open');
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}
