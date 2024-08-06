import { getMetadata } from '../../scripts/aem.js';
import {
  addCardImage,
  convertExcelDate,
  createTag,
  fetchData,
} from '../../scripts/utils.js';

export async function getBlogsByAuthor(author) {
  if (!window.allBlogs) {
    window.allBlogs = await fetchData('/whatson/query-index.json');
  }
  const blogArticles = window.allBlogs.filter(
    (e) => (e.template !== 'blog-category' && e.image !== '' && !e.image.startsWith('//aemedge/default-meta-image.png')),
  );
  let filterArticles = [];
  if (author) {
    filterArticles = blogArticles.filter((b) => (b.author.includes(author) && !b.path.includes('/author')));
  }
  return filterArticles;
}

export async function createBlogByAuthorCard(item) {
  const cardContainer = createTag('div', { class: 'card-container' });
  // image container
  const imageContainer = createTag('div', { class: 'image-container' });
  const imageLink = createTag('a', { class: 'image-link' });
  imageLink.href = item.path;
  const image = await addCardImage(item);
  imageLink.append(image);
  imageContainer.append(imageLink);

  // article text container
  const textContainer = createTag('div', { class: 'text-container' });
  const titleContainer = createTag('div', { class: 'title-container' });
  const titleLink = createTag('a', { class: 'title-link' });
  titleLink.href = item.path;
  titleLink.innerHTML = `<span class="blog-title">${item.title}</span>`;
  textContainer.append(titleLink);
  const descContainer = createTag('div', { class: 'description-container' });
  descContainer.innerText = item.description;
  const dateContainer = createTag('div', { class: 'date-container' });
  const authContainer = createTag('div', { class: 'auth-container' });
  authContainer.innerHTML = `<span class="author-name">${item.author}</span>`;
  const publicationDate = createTag('div', { class: 'publication-date' });
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const pubDate = convertExcelDate(item.date);
  const formattedDate = pubDate.toLocaleDateString('en-US', dateOptions);
  publicationDate.innerHTML = `<span class="author-name">${formattedDate}</span>`;
  dateContainer.append(authContainer, publicationDate);
  textContainer.append(titleContainer, descContainer, dateContainer);
  cardContainer.append(imageContainer, textContainer);
  return cardContainer;
}

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
  pageItems.forEach(async (item) => {
    const itemElement = document.createElement('div');
    const card = await createBlogByAuthorCard(item);
    const cardseparator = createTag('hr', { class: 'card-separator' });

    itemElement.append(card, cardseparator);
    cardsContainer.appendChild(itemElement);
  });

  // Display current page number
  const pageInfo = block.querySelector('.pagination-info-text');
  if (pageInfo) {
    pageInfo.textContent = `Page ${page} of ${Math.ceil(data.length / itemsPerPage)}`;
  }
}

function goToPreviousPage(blogs, block) {
  if (currentPage > 1) {
    currentPage -= 1;
    displayItems(blogs, currentPage, block);
  }
  if (currentPage < numberOfPages) {
    block.querySelector('.next-button').classList.replace('inactive', 'active');
  }

  if (currentPage === 1) {
    block.querySelector('.previous-button').classList.replace('active', 'inactive');
  }
}

function goToNextPage(blogs, block) {
  if (currentPage < Math.ceil(blogs.length / itemsPerPage)) {
    currentPage += 1;
    if (currentPage > 1) {
      block.querySelector('.previous-button').classList.replace('inactive', 'active');
    }
    if (currentPage === numberOfPages) {
      block.querySelector('.next-button').classList.replace('active', 'inactive');
    }
    displayItems(blogs, currentPage, block);
  }
}

export async function decorateCards() {
  const path = window.location.pathname;
  const main = document.querySelector('main');
  const author = path.split('/').pop();
  if (author) {
    const blogs = await getBlogsByAuthor(titleCase(author.replace('-', ' ')));
    const btnContainer = createTag('div', { class: 'pagination-container' });
    if (blogs && blogs.length > 0) {
      numberOfPages = Math.ceil(blogs.length / itemsPerPage);
      currentPage = 1;
      const cardsContainer = createTag('div', { class: 'cards-container' });
      // const btnContainer = createTag('div', { class: 'pagination-container' });
      const prevBtn = createTag('button', { class: 'previous-button paginate-btn inactive' });
      prevBtn.innerText = 'Previous';
      const nextBtn = createTag('button', { class: 'next-button paginate-btn active' });
      nextBtn.innerText = 'Next';
      const pageInfo = createTag('span', { class: 'pagination-info-text' });
      pageInfo.innerHTML = `Page ${currentPage} of ${numberOfPages}`;

      // show button container only if there are more than 1 page
      if (numberOfPages > 1) {
        btnContainer.append(prevBtn, pageInfo, nextBtn);
        main.append(cardsContainer, btnContainer);
        displayItems(blogs, currentPage, main);
        main.querySelector('.previous-button').addEventListener('click', (() => goToPreviousPage(blogs, main)));
        main.querySelector('.next-button').addEventListener('click', (() => goToNextPage(blogs, main)));
      } else {
        main.append(cardsContainer, btnContainer);
        displayItems(blogs, currentPage, main);
      }
    } else {
      main.append(btnContainer);
      btnContainer.innerHTML = '<h4 style="width: 100%; text-align: center;">No blog articles found for this author.</h4>';
    }
  }
}

export default async function decorate(main) {
  const bcWrapper = createTag('div', { class: 'blog-breadcrumb' });
  const defaultContent = document.querySelector('main > div');
  const authName = getMetadata('author');
  if (main) {
    const embedHTML = `<a class="blog-breadcrumb-link" href="/whatson">BLOG</a>
<span class="icon icon-fw-arrow"></span><span class="blog-breadcrumb-active-article">${authName}</span>`;
    bcWrapper.innerHTML = embedHTML;
    defaultContent.append(bcWrapper);
  }
}
decorateCards();
