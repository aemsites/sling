import { getBlogsByAuthor, createTag } from '../../scripts/utils.js';

const itemsPerPage = 10;
let numberOfPages = 0;
let currentPage = 1;

function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

function displayItems(data, page, block) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = data.slice(startIndex, endIndex);

  // Clear previous content
  const cardsContainer = block.querySelector('.cards-container');
  cardsContainer.innerHTML = '';

  // Display current page items
  pageItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `${item.title}</br>`;
    cardsContainer.appendChild(itemElement);
  });

  // Display current page number
  const pageInfo = block.querySelector('.pagination-info-text');
  pageInfo.textContent = `Page ${page} of ${Math.ceil(data.length / itemsPerPage)}`;
}

function goToPreviousPage(blogs, block) {
  if (currentPage > 1) {
    currentPage -= 1;
    displayItems(blogs, currentPage, block);
  }
}

function goToNextPage(blogs, block) {
  if (currentPage < Math.ceil(blogs.length / itemsPerPage)) {
    currentPage += 1;
    displayItems(blogs, currentPage, block);
  }
}

export default async function decorate(block) {
  const path = window.location.pathname;
  const author = path.split('/').pop();
  if (author) {
    const blogs = await getBlogsByAuthor(titleCase(author.replace('-', ' ')));
    if (blogs && blogs.length > 0) {
      numberOfPages = Math.ceil(blogs.length / itemsPerPage);
      currentPage = 1;
      const cardsContainer = createTag('div', { class: 'cards-container' });
      const btnContainer = createTag('div', { class: 'pagination-container' });
      const prevBtn = createTag('button', { class: 'previous-button' });
      prevBtn.innerText = 'Previous';
      const nextBtn = createTag('button', { class: 'next-button' });
      nextBtn.innerText = 'Next';
      const pageInfo = createTag('span', { class: 'pagination-info-text' });
      pageInfo.innerHTML = `Page ${currentPage} of ${numberOfPages}`;
      btnContainer.append(prevBtn, pageInfo, nextBtn);
      block.append(cardsContainer, btnContainer);
      displayItems(blogs, currentPage, block);
      block.querySelector('.previous-button').addEventListener('click', (() => goToPreviousPage(blogs, block)));
      block.querySelector('.next-button').addEventListener('click', (() => goToNextPage(blogs, block)));
    } else {
      block.innerHTML = 'No Blogs Found';
    }
  }
}
