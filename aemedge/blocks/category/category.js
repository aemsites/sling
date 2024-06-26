import { getMetadata } from '../../scripts/aem.js';
import { getBlogs, createCard } from '../../scripts/utils.js';

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
