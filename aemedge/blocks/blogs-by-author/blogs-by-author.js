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

function displayItems(data, page, cardsContainer, pageInfo) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = data.slice(startIndex, endIndex);

  // Clear previous content
  //  const container = block.querySelector('.cards-container');
  cardsContainer.innerHTML = '';

  // Display current page items
  pageItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.textContent = item;
    cardsContainer.appendChild(itemElement);
  });

  // Display current page number
  pageInfo.textContent = `Page ${page} of ${Math.ceil(data.length / itemsPerPage)}`;
}

function goToPreviousPage(blogs) {
  if (currentPage > 1) {
    currentPage -= 1;
    displayItems(blogs, currentPage);
  }
}

function goToNextPage(blogs) {
  if (currentPage < Math.ceil(blogs.length / itemsPerPage)) {
    currentPage += 1;
    displayItems(blogs, currentPage);
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
      prevBtn.addEventListener('click', (() => goToPreviousPage(blogs)));
      const nextBtn = createTag('button', { class: 'next-button' });
      nextBtn.innerText = 'Next';
      nextBtn.addEventListener('click', (() => goToNextPage(blogs)));
      const pageInfo = createTag('span', { class: 'pagination-info-text' });
      pageInfo.innerHTML = `Page ${currentPage} of ${numberOfPages}`;
      btnContainer.append(prevBtn, pageInfo, nextBtn);
      block.append(cardsContainer, btnContainer);
      displayItems(blogs, currentPage, cardsContainer, pageInfo);
    } else {
      block.innerHTML = 'No Blogs Found';
    }
  }
}
