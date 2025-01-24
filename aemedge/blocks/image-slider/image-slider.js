let slideIndex = 0;

function showSlide(block) {
  const slides = block.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  // Ensure the slide index wraps correctly
  const realSlideIndex = (((slideIndex % totalSlides) + totalSlides) % totalSlides);

  // Scroll to the active slide
  const activeSlide = slides[realSlideIndex];
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
    transition: '.6s ease-in-out',
  });
}

function autoScroll(block) {
  const slides = block.querySelectorAll('.carousel-slide');
  showSlide(block, slideIndex);
  slideIndex += 1;
  if (slideIndex >= slides.length) {
    block.querySelector('.carousel-slides').scrollLeft = 0;
    slideIndex = 0;
  }
}

export default async function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('carousel-slides');
  const images = block.querySelectorAll('picture');
  images.forEach((row) => {
    row.classList.add('carousel-slide');
  });
  ul.append(...images);

  // Clone the first slide and append it to the end
  const firstSlideClone = images[0].cloneNode(true);
  ul.append(firstSlideClone);

  block.prepend(ul);

  // Call autoScroll every 3 seconds
  setInterval(() => autoScroll(block), 5000);
}
