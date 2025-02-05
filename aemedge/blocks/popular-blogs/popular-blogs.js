import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTag, getBlogs } from '../../scripts/utils.js';

function buildPopularCard(blog, index) {
  const link = createTag('a', { class: 'blog-link', href: blog.path });

  const blogTitle = createTag('span', { class: 'popular-blog-title' });
  if (blog.title && blog.title.length > 70) {
    blogTitle.innerText = `${blog.title.trim().slice(0, 66)}...`;
  } else {
    blogTitle.innerText = blog.title;
  }

  const picture = createOptimizedPicture(blog.image, blog.title);
  link.append(picture, blogTitle);
  const cardDiv = createTag('li', {
    class: 'blog-slide',
    'data-slide-index': `${index}`,
    id: `blog-silde-${index}`,
    'aria-labelledby': blog.title,
    'aria-hidden': index === 0,
  });
  cardDiv.append(link);
  return cardDiv;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.popular-blogs');

  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.blog-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });
}

function showSlide(container, slideIndex = 0) {
  const slides = container.querySelectorAll('.blog-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;

  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  container.querySelector('.blog-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  container.querySelectorAll('.blog-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

const addSliderNav = (cardsWrapper, block) => {
  const btnContainer = createTag('div', { class: 'slider-nav-container' });
  const prevButton = createTag('button', { class: 'slide-prev', 'aria-label': 'Previous Blog' });
  prevButton.innerHTML = '<span class="fa fa-chevron-left" aria-hidden="true"></span>';

  prevButton.addEventListener('click', () => {
    showSlide(cardsWrapper, parseInt(block.dataset.activeSlide || 0, 10) - 1);
  });
  const nextButton = createTag('button', { class: 'slide-next', 'aria-label': 'Next Blog' });
  nextButton.innerHTML = '<span class="fa fa-chevron-right" aria-hidden="true"></span>';
  nextButton.addEventListener('click', () => {
    showSlide(cardsWrapper, parseInt(block.dataset.activeSlide || 0, 10) + 1);
  });
  btnContainer.append(prevButton, nextButton);
  cardsWrapper.prepend(btnContainer);
};

const removeSliderNav = (cardsWrapper) => {
  cardsWrapper.querySelector('.slider-nav-container')?.remove();
};

function enableSlider(e, block) {
  const container = block.querySelector('.slides-container');
  const headingWrapper = container.querySelector('.heading-wrapper');
  const cardsWrapper = container.querySelector('.slides-wrapper');
  container.innerHTML = '';
  if (e.matches) {
    addSliderNav(cardsWrapper, block);
    container?.append(headingWrapper, cardsWrapper);
  } else {
    removeSliderNav(cardsWrapper);
    container?.append(headingWrapper, cardsWrapper);
  }
}
function toTag(cat) {
  let modified = cat;
  if (cat.includes('-and-')) {
    modified = cat.replace('-and-', ' & ');
  } else if (cat.includes('-') && cat !== 'sci-fi') {
    modified = cat.replace('-', ' ');
  }
  return modified;
}
export default async function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      // get tags from url
      let categories = new URL(window.location.href).pathname.split('/').filter((path) => path);
      // remove whatson from the categories
      categories.shift();
      const curPage = categories.pop();
      categories = categories.map(toTag);
      const blogs = await getBlogs(categories, 7);
      // create the dom structure
      const container = block.querySelector('.slides-container');
      const headlineWrapper = createTag('div', { class: 'heading-wrapper' });
      const headingTitle = createTag('h4', { class: 'headline' });
      headingTitle.innerText = 'Most Popular';
      headlineWrapper.append(headingTitle);
      const cardsWrapper = createTag('div', { class: 'slides-wrapper' });
      const cardsDiv = createTag('ul', { class: 'blog-slides' });
      let rendered = 0;
      blogs.forEach((blog) => {
        if (rendered <= 5) {
          if (!blog.path.endsWith(curPage)) {
            cardsDiv.append(buildPopularCard(blog, rendered));
            rendered += 1;
          }
        }
      });
      cardsWrapper.append(cardsDiv);
      container.append(headlineWrapper, cardsWrapper);
      // code to set up carousel for mobile
      const mquery = window.matchMedia('(max-width: 768px)');
      mquery.addEventListener(
        'change',
        (event) => enableSlider(event, block),
      );
      enableSlider(mquery, block);
      block.querySelector(':scope > div').replaceWith(container);
      block.setAttribute('data-active-slide', 0);
    }
  }, { threshold: 0 });
  observer.observe(block.parentElement);
}
