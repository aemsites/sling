import { createTag, getPictureUrlByScreenWidth, getVideoUrlByScreenWidth } from '../../scripts/utils.js';
import { toClassName } from '../../scripts/aem.js';

function processBlockConfig(block) {
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
  let currentVideoUrl = getVideoUrlByScreenWidth(videoLinks);
  // Remove video links from DOM to prevent them from showing up as text
  videoLinks.forEach((link) => link.parentElement.remove());

  setupVideo(currentVideoUrl, block);

  // Resize event listener to update video based on screen size changes
  window.addEventListener('resize', () => {
    const newVideoUrl = getVideoUrlByScreenWidth(videoLinks);

    // Update video only if the URL changes
    if (newVideoUrl !== currentVideoUrl) {
      currentVideoUrl = newVideoUrl;
      setupVideo(currentVideoUrl, block);
    }
  });
}

function setupBGPictures(background, block) {
  const pictures = Array.from(background.querySelectorAll('picture'));
  let currentPicture = getPictureUrlByScreenWidth(pictures);
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
    const newPicture = getPictureUrlByScreenWidth(pictures);

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

const scrollCTAIntoHeader = (entries) => {
  entries.forEach((entry) => {
    const block = entry.target;
    const cta = block.querySelector('.cta a');
    if (entry.isIntersecting) {
      cta.classList.remove('scroll-into-header');
    } else {
      cta.classList.add('scroll-into-header');
    }
  });
};

export default function decorate(block) {
  processBlockConfig(block);
  const background = block.querySelector('.background');
  const bgColor = block.querySelector('.background-color');
  const scrollCTA = block.querySelector('.scroll-cta-into-header');
  if (scrollCTA) {
    const cta = document.querySelector('.cta a');
    if (cta) {
      const options = {
        root: null,
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(scrollCTAIntoHeader, options);
      observer.observe(block);
    }
    scrollCTA.remove();
  }
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
  block.querySelectorAll('.config-property').forEach((prop) => prop.remove()); // remove config property divs from dom
  block.querySelectorAll('div').forEach((div) => { if (div.children.length === 0) div.remove(); }); // remove empty divs
}
