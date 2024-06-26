/* eslint-disable no-lonely-if */
function handleClick(direction, e) {
  const list = e.target.closest('.carousel').querySelector('.carousel-slides');
  // We want to know the width of one of the items.
  // We'll use this to decide how many pixels we want our carousel to scroll.
  const item = list.querySelector('.carousel-slide');
  const itemWidth = item.offsetWidth;
  const firstItem = list.querySelector('.carousel-slide:first-child');
  const lastItem = list.querySelector('.carousel-slide:last-child');

  // Based on the direction we call `scrollBy` with the item width we got earlier
  if (direction === 'previous') {
    // If first item is visible, scroll to the last item
    if (firstItem.getBoundingClientRect().left >= 0) {
      list.scrollBy({ left: lastItem.getBoundingClientRect().left, behavior: 'smooth' });
    } else {
    // If first item is not visible, scroll to the left
      list.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  } else {
    // If last item is visible, scroll to the first item
    if (lastItem.getBoundingClientRect().right <= list.getBoundingClientRect().right) {
      list.scrollBy({ left: firstItem.getBoundingClientRect().left, behavior: 'smooth' });
    } else {
      // If last item is not visible, scroll to the right
      list.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  }
}

function handleButtonClick(i, e) {
  const slides = e.target.closest('.carousel').querySelector('.carousel-slides');
  const children = slides.querySelectorAll('.carousel-slide');
  if (i < 0 || i >= children.length) {
    return;
  }
  if (i === 0 || i === children.length - 1) {
    // if the first or last slide is already in view, don't scroll
    if (children[i].getBoundingClientRect().left >= 0
      && children[i].getBoundingClientRect().right <= slides.getBoundingClientRect().right) {
      return;
    }
    slides.scrollBy({ left: children[i].getBoundingClientRect().left, behavior: 'smooth' });
    return;
  }
  slides.scrollBy({ left: children[i - 1].getBoundingClientRect().left, behavior: 'smooth' });
}

export default async function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('carousel-slides');
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    row.classList.add('carousel-slide');
  });
  ul.append(...rows);
  block.prepend(ul);
  const buttons = ` 
    <button class="button button-previous" type="button">➜</button>
    <button class="button button-next" type="button">➜</button>
  `;
  block.innerHTML += buttons;

  const previousButton = block.querySelector('.button-previous');
  previousButton.addEventListener('click', (e) => handleClick('previous', e));
  const nextButton = block.querySelector('.button-next');
  nextButton.addEventListener('click', (e) => handleClick('next', e));

  // add a button for every slide to the bottom of the carousel
  const slideButtons = block.querySelectorAll('.carousel-slide');
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('carousel-buttons');
  slideButtons.forEach((slide, index) => {
    const button = document.createElement('button');
    button.classList.add('carousel-button');
    button.textContent = index + 1;
    button.addEventListener('click', (e) => handleButtonClick(index, e));
    buttonContainer.appendChild(button);
  });
  block.appendChild(buttonContainer);
}
