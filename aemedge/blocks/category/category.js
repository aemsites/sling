import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { createTag, getBlogs, convertExcelDate } from '../../scripts/utils.js';

// Adding tags
function addTags(container, tags) {
  const tagsDiv = createTag('div', { class: 'card-tags' });
  tags.forEach((tag) => {
    const tagElement = createTag('a', { class: 'card-tag-link', href: `/whatson/${tag.toLowerCase()}` }, tag.toUpperCase());
    tagsDiv.append(tagElement);
  });
  container.append(tagsDiv);
}

// Adding title
function addTitle(container, title) {
  const titleDiv = createTag('div', { class: 'card-title' }, title);
  container.append(titleDiv);
}

// Adding description
function addDescription(container, description) {
  const descriptionDiv = createTag('div', { class: 'card-description' }, `${description.substring(0, 100)}…`);
  container.append(descriptionDiv);
}

// Adding author + publish date
function addAuthorAndDate(container, authorName, publishDate) {
  const authorDateDiv = createTag('div', { class: 'card-author-date' });
  const author = createTag('span', { class: 'card-author' }, authorName || 'Sling Staff');
  authorDateDiv.append(author);
  if (publishDate) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = publishDate.toLocaleDateString('en-US', dateOptions);
    const date = createTag('span', { class: 'card-date' }, formattedDate);
    authorDateDiv.append(date);
  }
  container.append(authorDateDiv);
}

// Creating card content
function addCardContent(container, {
  tags, title, description, author, date,
}) {
  const cardContent = createTag('div', { class: 'card-content' });
  container.append(cardContent);

  if (tags) {
    addTags(cardContent, tags);
  }
  if (title) {
    addTitle(cardContent, title);
  }
  if (description) {
    addDescription(cardContent, description);
  }
  addAuthorAndDate(cardContent, author, date);
}

// Create cardLarge images for breakpoints
export async function addCardImageLarge(row, style, eagerImage = true) {
  const cardImageDiv = createTag('div', { class: 'card-image' });
  const desktopMediaQuery = window.matchMedia('only screen and (min-width: 768px)');

  function updateDesktopImage() {
    cardImageDiv.innerHTML = ''; // Clear existing content
    cardImageDiv.append(createOptimizedPicture(
      row.desktopImagePath,
      row.title,
      eagerImage,
      [{ width: '1200' }, {
        media: '(min-width: 1024px)',
        width: '1440',
      }],
    ));
  }

  function updateMobileImage() {
    cardImageDiv.innerHTML = ''; // Clear existing content
    cardImageDiv.append(createOptimizedPicture(
      row.mobileImagePath,
      row.title,
      eagerImage,
      [{ width: '600' }, {
        media: '(max-width: 1023px)',
        width: '1000',
      }],
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

// Create card images using default thumbnail image
export async function addCardImage(row, style, eagerImage = false) {
  if (row.image !== '' && row.image !== '0' && row.title !== '0') {
    const cardImageDiv = createTag('div', { class: 'card-image' });
    cardImageDiv.append(createOptimizedPicture(
      row.image,
      row.title,
      eagerImage,
      [{ width: '750' }, { media: '(min-width: 600px)', width: '1440' }],
    ));
    return cardImageDiv;
  }
  return null;
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
