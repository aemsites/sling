import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { createTag, getBlogs, convertExcelDate } from '../../scripts/utils.js';

/**
 * Creates a card element from an index row
 * @param {Object} row - JSON Object representing a blog
 * @param {String} style - The style of the card (default: 'card')
 * @param {Boolean} eagerImage - Whether to load the image eagerly (default: false)
 * @returns {Promise<Array>} - A promise resolving to the card element
 */
export async function createCard(row, style, eagerImage = false) {
  // Create card div
  const card = createTag('div', { class: style || 'card' });
  const desktopMediaQuery = window.matchMedia('only screen and (min-width: 1024px)');

  // Create and add the link
  const link = createTag('a', { class: 'card-link', href: row.path, alt: row.title });

  // Check if we are on desktop or mobile
  if (desktopMediaQuery.matches) {
    // create large card for desktop size
    const desktopLargeCard = createTag('div', { class: 'card-image large' });

    const desktopLargeImage = createOptimizedPicture(
      row.desktopImagePath,
      row.title,
      eagerImage,
      [{ width: '1200' }, {
        media: '(min-width: 1024px)',
        width: '1440',
      }],
    );
    // link.append(desktopLargeImage);
    console.log('this is desktop', desktopLargeImage);
    // desktopLargeCard.prepend(link);
  } else {
    // create large card for mobile size
    const mobileLargeCard = createTag('div', { class: 'card-image large' });
    const mobileLargeImage = createOptimizedPicture(
      row.mobileImagePath,
      row.title,
      eagerImage,
      [{ width: '600' }, {
        media: '(max-width: 1023px)',
        width: '1000',
      }],
    );
    // link.append(mobileLargeImage);
    console.log('this is mobile', mobileLargeImage);
    // mobileLargeCard.prepend(link);
  }

  // Add the image to the link and then card first
  if (row.image !== '' && row.image !== '0' && row.title !== '0') {
    const cardImage = createTag('div', { class: 'card-image' });
    cardImage.append(createOptimizedPicture(
      row.image,
      row.title,
      eagerImage,
      [{ width: '750' }, { media: '(min-width: 600px)', width: '1440' }],
    ));

    link.append(cardImage);
    card.prepend(link);
  }

  // Create a separate child div for the card content
  const cardContent = createTag('div', { class: 'card-content' });
  link.append(cardContent);
  // Add tags
  if (row.tags && row.tags !== '0') {
    const tags = createTag('div', { class: 'card-tags' });
    const tagArray = JSON.parse(row.tags);
    tagArray.forEach((tag) => {
      const tagElement = createTag('a', { class: 'card-tag-link', href: `/whatson/${tag.toLowerCase()}` }, tag.toUpperCase());
      tags.append(tagElement);
    });
    cardContent.append(tags);
  }
  // Add title
  if (row.title && row.title !== '0') {
    const title = createTag('div', { class: 'card-title' }, row.title);
    cardContent.append(title);
  }
  // Add description
  if (row.description && row.description !== '0') {
    const description = createTag('div', { class: 'card-description' }, `${row.description.substring(0, 100)}...`);
    cardContent.append(description);
  }
  // Add author and publish date
  const authorDate = createTag('div', { class: 'card-author-date' });
  let author;
  if (!row.author || row.author === '0') {
    author = createTag('span', { class: 'card-author' }, 'Sling Staff');
  } else {
    author = createTag('span', { class: 'card-author' }, row.author);
  }
  authorDate.append(author);
  if (row.date && row.date !== '0') {
    const publishDate = convertExcelDate(row.date);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = publishDate.toLocaleDateString('en-US', dateOptions);
    const date = createTag('span', { class: 'card-date' }, formattedDate);
    authorDate.append(date);
  }
  cardContent.append(authorDate);
  return (card);
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
  // original code
  /*
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

   */
  // modified code
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
