import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import {
  createTag, getBlogs, convertExcelDate, addCardImage, addCardContent,
} from '../../scripts/utils.js';

// Create cardLarge images for 2 breakpoints
export async function addCardImageLarge(row, style, eagerImage = true) {
  const cardImageDiv = createTag('div', { class: 'card-image' });
  const desktopMediaQuery = window.matchMedia('only screen and (min-width: 768px)');

  function updateDesktopImage() {
    cardImageDiv.innerHTML = ''; // Clear existing content
    cardImageDiv.append(createOptimizedPicture(
      row.desktopImagePath,
      row.title,
      eagerImage,
      [{ width: '1200' }],
    ));
  }

  function updateMobileImage() {
    cardImageDiv.innerHTML = ''; // Clear existing content
    cardImageDiv.append(createOptimizedPicture(
      row.mobileImagePath,
      row.title,
      eagerImage,
      [{ width: '770' }],
    ));
  }
  function handleImageUpdate() {
    if (desktopMediaQuery.matches) {
      updateDesktopImage();
    } else {
      updateMobileImage();
    }
  }

  // Listen for window resize events to update the image accordingly
  desktopMediaQuery.addEventListener('change', handleImageUpdate);

  // Initial call to set the correct image based on the current window size
  handleImageUpdate();
  return cardImageDiv;
}

export async function createCard(row, style, eagerImage, isLarge = false) {
  const cardClass = isLarge ? 'card card-large' : style || 'card';
  const card = createTag('div', { class: cardClass });
  const link = createTag('a', { class: 'card-link', href: row.path, alt: row.title });
  const cardImageFunction = isLarge ? addCardImageLarge : addCardImage;
  const cardImage = await cardImageFunction(row, style, eagerImage);

  link.append(cardImage);
  card.prepend(link);
  addCardContent(link, {
    tags: row.tags ? JSON.parse(row.tags) : null,
    title: row.title,
    description: row.description,
    author: row.author,
    date: row.date ? convertExcelDate(row.date) : null,
  });
  const author = card.querySelector('.card .card-link .card-content .card-author-date .card-author');
  const authorlink = document.createElement('a');
  const authorname = author.innerHTML.trim().toLowerCase().replace(' ', '-');
  authorlink.href = `https://main--sling--aemsites.aem.page/whatson/author/${authorname}`;
  authorlink.textContent = author.textContent;
  author.textContent = '';
  author.appendChild(authorlink);
  author.addEventListener('click', (event) => {
    event.stopPropagation();
    window.location.href = authorlink;
  });
  return card;
}

export default async function decorate(block) {
  block.textContent = '';
  // check if category page
  const category = getMetadata('template');
  if (category === !'blog-category') return;

  // get tags from url
  const categories = new URL(window.location.href).pathname.split('/').filter((path) => path);
  // remove whatson from the categories
  categories.shift();
  categories.map((cat) => cat.replace('-and-', '&'));
  // Get blogs
  const blogs = await getBlogs(categories.map((cat) => cat.replace('-and-', ' & ')), 7);
  blogs.forEach(async (blog, i) => {
    if (blog.image === '') return;
    let card;
    if (i === 0) {
      card = await createCard(blog, 'card card-large', true, true);
    } else if (i % 2 !== 0) {
      card = await createCard(blog, 'card card-medium', false, false);
    } else {
      card = await createCard(blog, 'card card-small', false, false);
    }
    block.append(card);
  });
}
