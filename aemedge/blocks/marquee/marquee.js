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

function getPictureUrl(pictures) {
  const screenWidth = window.innerWidth;
  if (pictures.length === 0) {
    return null;
  }
  if (pictures.length === 1) {
    return pictures[0];
  }
  if (pictures.length === 2) {
    // First link for desktop and tablet, second link for mobile
    if (screenWidth >= 1024) {
      return pictures[0]; // Desktop
    }
    if (screenWidth >= 768 && screenWidth < 1024) {
      return pictures[0].getAttribute('href'); // Tablet
    }
    return pictures[1].getAttribute('href'); // Mobile
  }

  // If there are 3 or more links
  if (screenWidth >= 1024) {
    return pictures[0]; // Desktop
  }
  if (screenWidth >= 768 && screenWidth < 1024) {
    return pictures[1]; // Tablet
  }
  return pictures[2]; // Mobile
}

function toClassName(name) {
  return typeof name === 'string'
    ? name
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    : '';
}
function setCSSClasses(block) {
  const marqueContent = createTag('div', { class: 'marquee-content' });
  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        cols[0].classList.add('config-property');
        col.classList.add(name);
        marqueContent.append(col);
      }
    }
  });
  block.append(marqueContent);
}

function setupVideo(url, block) {
  if (!url) return;

  const existingVideo = block.querySelector('video');
  if (existingVideo) {
    existingVideo.parentElement.remove();
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
  const container = createTag('div', { class: 'background' });
  container.append(video);
  block.prepend(container);
}

function setupBGVideos(block) {
  const videoLinks = Array.from(block.querySelectorAll('a[href*=".mp4"]'));
  let currentVideoUrl = getVideoUrl(videoLinks);
  // Remove video links from DOM to prevent them from showing up as text
  videoLinks.forEach((link) => link.parentElement.remove());

  setupVideo(currentVideoUrl, block);

  // Resize event listener to update video based on screen size changes
  window.addEventListener('resize', () => {
    const newVideoUrl = getVideoUrl(videoLinks);

    // Update video only if the URL changes
    if (newVideoUrl !== currentVideoUrl) {
      currentVideoUrl = newVideoUrl;
      setupVideo(currentVideoUrl, block);
    }
  });
}

function setupBGPictures(background, block) {
  const pictures = Array.from(background.querySelectorAll('picture'));
  let currentPicture = getPictureUrl(pictures);
  // Remove video links from DOM to prevent them from showing up as text
  pictures.forEach((picture) => picture.parentElement.remove());
  const existingPicture = background.querySelector('picture');
  if (existingPicture) {
    existingPicture.parentElement.remove();
  }
  const bgDIV = createTag('div', { class: 'background' });
  bgDIV.append(currentPicture);
  block.prepend(bgDIV);

  // Resize event listener to update video based on screen size changes
  window.addEventListener('resize', () => {
    const newPicture = getPictureUrl(pictures);

    // Update video only if the URL changes
    if (newPicture !== currentPicture) {
      currentPicture = newPicture;
      const oldPicture = block.querySelector('picture');
      if (oldPicture) {
        oldPicture.parentElement.remove();
      }
      const container = createTag('div', { class: 'background' });
      container.append(currentPicture);
      block.prepend(container);
    }
  });
}

export default function decorate(block) {
  setCSSClasses(block);
  const background = block.querySelector('.background');
  const bgColor = block.querySelector('.background-color');
  let bgMediaType;
  if (background) {
    if (background.querySelector('picture')) {
      bgMediaType = 'picture';
    } else if (background.querySelector('a[href*=".mp4"]')) {
      bgMediaType = 'video';
    }
  }
  if (bgColor) {
    const section = block.closest('.section');
    if (section) {
      section.style.backgroundColor = bgColor.textContent;
    }
    bgColor.remove();
  }

  setupBGVideos(block);
  if (bgMediaType === 'picture') setupBGPictures(background, block);
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove());
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); });
}
