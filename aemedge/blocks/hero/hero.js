// import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTag } from '../../scripts/utils.js';

export default function decorate(block) {
  const h1Parent = block.querySelector('h1').parentElement;
  h1Parent.classList.add('hero-content');

  // Handle multiple images
  const pictures = block.querySelectorAll('picture');
  if (pictures.length > 1) {
    pictures.forEach((picture, i) => {
      if (picture.parentElement.tagName === 'P') {
        picture.parentElement.remove();
      }
      if (i === 0) {
        picture.classList.add('background');
        h1Parent.parentElement.prepend(picture);
        h1Parent.parentElement.classList.add('multiple-images');
      }
      if (i !== 0) {
        picture.classList.add('foreground');
        h1Parent.append(picture);
      }
    });
  }

  // Handle video
  const videoLink = block.querySelector('a[href*=".mp4"]');
  if (videoLink) {
    const videoUrl = videoLink.href;
    // const videoWrapper = createTag('div', { class: 'hero-video' });
    const video = createTag('video', {
      autoplay: 'true',
      playsinline: 'true',
      muted: 'true',
      loop: 'true',
    });
    const videoSource = createTag('source', { src: videoUrl });
    video.append(videoSource);
    // videoWrapper.append(video);
    // If video is wrapped in a button container, replace the container with the video wrapper
    if (videoLink.parentElement.tagName === 'P' && videoLink.parentElement.classList.contains('button-container')) {
      videoLink.parentElement.remove();
    } else {
      videoLink.remove();
    }
    block.prepend(video);
  }
}
