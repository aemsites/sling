import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTag, getBlogs } from '../../scripts/utils.js';

function buildPopularCard(blog) {
  const cardDiv = createTag('div', { class: 'popular-blog-card' });
  const link = createTag('a', { class: 'blog-link', href: blog.path });

  const blogTitle = createTag('span', { class: 'popular-blog-title' });
  if (blog.title && blog.title.length > 70) {
    blogTitle.innerText = `${blog.title.trim().slice(0, 66)}...`;
  } else {
    blogTitle.innerText = blog.title;
  }

  const picture = createOptimizedPicture(blog.image, blog.title);
  link.append(picture, blogTitle);
  cardDiv.append(link);
  return cardDiv;
}

export default async function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      // get tags from url
      const categories = new URL(window.location.href).pathname.split('/').filter((path) => path);
      // remove whatson from the categories
      categories.shift();
      const curPage = categories.pop();
      const blogs = await getBlogs(categories, 8);
      const container = block.querySelector('.most-popular-blogs');
      const headingDiv = createTag('div', { class: 'popular-blogs-heading' });
      const headingTitle = createTag('h4', { class: 'popular-blogs-headline' });
      headingTitle.innerText = 'Most Popular';
      const headingImg = createTag('img', { class: 'popular-heading-img', src: '/whatson/images/whats-on-sling.png' });
      headingDiv.append(headingImg, headingTitle);
      const cardsDiv = createTag('div', { class: 'popular-blog-cards' });
      let rendered = 0;
      blogs.forEach((blog) => {
        if (rendered <= 5) {
          if (!blog.path.endsWith(curPage)) {
            cardsDiv.append(buildPopularCard(blog));
            rendered += 1;
          }
        }
      });
      container?.append(headingDiv, cardsDiv);
    }
  }, { threshold: 0 });
  observer.observe(block.parentElement);
}
