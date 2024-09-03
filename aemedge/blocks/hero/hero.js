// import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTag } from '../../scripts/utils.js';

function getVideoUrl(videoLinks) {
  const screenWidth = window.innerWidth;

  if (videoLinks.length === 0) {
    return null;
  }
  if (videoLinks.length === 1) {
    return videoLinks[0].getAttribute('href');
  }
  if (videoLinks.length === 2) {
    // First link for desktop and tablet, second link for mobile
    if (screenWidth >= 1024) {
      return videoLinks[0].getAttribute('href'); // Desktop
    }
    if (screenWidth >= 768 && screenWidth < 1024) {
      return videoLinks[0].getAttribute('href'); // Tablet
    }
    return videoLinks[1].getAttribute('href'); // Mobile
  }

  // If there are 3 or more links
  if (screenWidth >= 1024) {
    return videoLinks[0].getAttribute('href'); // Desktop
  }
  if (screenWidth >= 768 && screenWidth < 1024) {
    return videoLinks[1].getAttribute('href'); // Tablet
  }
  return videoLinks[2].getAttribute('href'); // Mobile
}

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

  const videoLinks = Array.from(block.querySelectorAll('a[href*=".mp4"]'));
  let currentVideoUrl = getVideoUrl(videoLinks);
  // Remove video links from DOM to prevent them from showing up as text
  videoLinks.forEach((link) => link.parentElement.remove());
  function setupVideo(url) {
    if (!url) return;

    const existingVideo = block.querySelector('video');
    if (existingVideo) {
      existingVideo.remove();
    }

    const video = createTag('video', {
      autoplay: 'true',
      playsinline: 'true',
      muted: 'true',
      loop: 'true',
      oncanplay: 'this.muted=true',
    });

    video.oncanplaythrough = () => {
      video.muted = true;
      video.play();
    };
    const videoSource = createTag('source', { src: url, type: 'video/mp4' });
    video.append(videoSource);

    block.prepend(video);
  }
  setupVideo(currentVideoUrl);

  // Resize event listener to update video based on screen size changes
  window.addEventListener('resize', () => {
    const newVideoUrl = getVideoUrl(videoLinks);

    // Update video only if the URL changes
    if (newVideoUrl !== currentVideoUrl) {
      currentVideoUrl = newVideoUrl;
      setupVideo(currentVideoUrl);
    }
  });
}
