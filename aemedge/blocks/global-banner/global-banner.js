import { createTag } from '../../scripts/utils.js';

export default async function decorate(block) {
  const emptySpan = createTag('span', { class: 'empty' });
  const closeButton = createTag('span', { class: 'close' }, '×');
  block.prepend(emptySpan);
  block.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    block.style.display = 'none';
  });
}
