import { createTag } from '../../scripts/utils.js';

export default async function decorate(block) {
  const closeButton = createTag('span', { class: 'close' }, '×');
  block.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    block.style.display = 'none';
  });
}
