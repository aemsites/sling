import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import {
  createTag,
  getBlogs,
  getBlogsByPaths,
  convertExcelDate,
  addCardImage,
  addCardContent,
  pathToTag,
} from '../../scripts/utils.js';

const LIMIT_100 = '100';

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
      [{ width: '600' }],
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

export async function createCard(row, style, lastSegmentOfURL, eagerImage, isLarge = false) {
  const cardClass = isLarge ? 'card card-large' : style || 'card';
  const card = createTag('div', { class: cardClass });
  const link = createTag('a', { class: 'card-link', href: row.path, alt: row.title });
  const cardImageFunction = isLarge ? addCardImageLarge : addCardImage;
  const cardImage = await cardImageFunction(row, style, eagerImage);
  link.append(cardImage);
  card.prepend(link);
  addCardContent(link, lastSegmentOfURL, {
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
  let numberofblogs = 7;
  // get 7 links which is max
  const links = Array.from(block.querySelectorAll('a[href]')).slice(0, numberofblogs);
  const paths = links.map((a) => new URL(a.href).pathname);
  block.textContent = '';
  // check if category page
  const category = getMetadata('template');
  if (category === !'blog-category') return;

  // get tags from url
  const categories = new URL(window.location.href).pathname.split('/').filter((path) => path);
  // remove whatson from the categories
  categories.shift();
  // categories.map((cat) => titleToName(cat));
  const currentCategory = categories[categories.length - 1];
  let lastSegmentOfURL;
  if (currentCategory && currentCategory.includes('and')) {
    lastSegmentOfURL = currentCategory.replace('and', '&');
  } else {
    lastSegmentOfURL = currentCategory;
  }

  let limit = '';
  // check if whatson homepage and add limit what we pull from query index for better performance
  if (window.location.pathname === '/whatson' || window.location.pathname === '/whatson/') {
    limit = LIMIT_100;
  }
  let blogsbypaths;
  if (paths.length >= 1) blogsbypaths = await getBlogsByPaths(paths, limit);
  let blogs;
  let mergedBlogs;
  if (blogsbypaths && (blogsbypaths.length > 0 && blogsbypaths.length < 8)) {
    numberofblogs -= blogsbypaths.length;
    // Get blogs
    if (numberofblogs > 0) {
      blogs = await getBlogs(categories.map((cat) => pathToTag(cat)), numberofblogs, limit);
      mergedBlogs = [...blogs, ...blogsbypaths];
    }
  } else {
    mergedBlogs = await getBlogs(categories.map((cat) => pathToTag(cat)), numberofblogs, limit);
  }
  mergedBlogs.forEach(async (blog, i) => {
    if (blog.image === '') return;
    let card;
    if (i === 0) {
      card = await createCard(blog, 'card card-large', lastSegmentOfURL, true, true);
    } else if (i % 2 !== 0) {
      card = await createCard(blog, 'card card-medium', null, false, false);
    } else {
      card = await createCard(blog, 'card card-small', null, false, false);
    }
    block.append(card);
  });
}
