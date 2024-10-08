import { loadScript } from '../../scripts/aem.js';

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const embedFacebook = (url) => {
  const embedHTML = `<div class="fb-post" data-href="${url.href}" data-width="auto"></div>`;
  loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2');
  return embedHTML;
};

const embedInstagram = (url) => {
  const endingSlash = url.pathname.endsWith('/') ? '' : '/';
  const location = window.location.href.endsWith('.html') ? window.location.href : `${window.location.href}.html`;
  // eslint-disable-next-line no-unused-vars
  const src = `${url.origin}${url.pathname}${endingSlash}embed/?cr=1&amp;v=13&amp;wp=1316&amp;rd=${location}`;
  const embedHTML = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${url}" data-instgrm-version="14"
style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
  <div style="padding:16px;"><a href="${url}" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">
    <div style=" display: flex; flex-direction: row; align-items: center;">
      <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div>
      <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
        <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div>
        <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
      </div>
    </div>
    <div style="padding: 19% 0;"></div>
    <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
      <span class="icon icon-instagram"></span>
    </div>
    <div style="padding-top: 8px;">
      <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div>
    </div>
    <div style="padding: 12.5% 0;"></div>
    <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
      <div>
        <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
        <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div>
        <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div>
      </div>
      <div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div>
      <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div>
    </div>
    <div style="margin-left: auto;">
      <div style=" width: 0; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div>
      <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div>
      <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;">
    <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div>
    <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div>
  </div></a>
  <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">
    <a href="${url}" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">An Instagram post</a>
  </p>
  </div></blockquote>`;
  loadScript('https://www.instagram.com/embed.js');
  return embedHTML;
};

// Function to extract videoId from YouTube and Vimeo URLs
const getVideoId = (url) => {
  if (url.origin.includes('youtu.be')) {
    return url.pathname.substring(1);
  }
  if (url.hostname.includes('youtube.com')) {
    console.log('videoId', url);
    return new URLSearchParams(url.search).get('v') || url.pathname.split('/').pop();
  }
  if (url.hostname.includes('vimeo.com')) {
    // lite-vimeo script expects a player.vimeo.com/video URL, so if we have a short URL
    // we need to extract the video ID separately here
    return url.pathname.split('/').pop();
  }
  return null;
};

// YouTube embed with lite-youtube
const embedYoutube = async (url) => {
  await loadScript('/aemedge/blocks/embed/lite-yt-embed/lite-yt-embed.js');
  const videoId = getVideoId(url);
  const wrapper = document.createElement('div');
  wrapper.setAttribute('itemscope', '');
  wrapper.setAttribute('itemtype', 'https://schema.org/VideoObject');

  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}`);
    const json = await response.json();
    wrapper.innerHTML = `
      <meta itemprop="name" content="${json.title}"/>
      <link itemprop="embedUrl" href="https://www.youtube.com/embed/${videoId}"/>
      <link itemprop="thumbnailUrl" href="${json.thumbnail_url}"/>
      ${wrapper.innerHTML}
    `;
  } catch (err) {
    // Nothing to do, metadata just won't be added to the video
  }
  const litePlayer = document.createElement('lite-youtube');
  litePlayer.setAttribute('videoid', videoId);
  wrapper.append(litePlayer);
  return wrapper.outerHTML;
};

// Vimeo embed with lite-vimeo-embed
const embedVimeo = async (url) => {
  await loadScript('/aemedge/blocks/embed/lite-vimeo-embed/lite-vimeo-embed.js');
  const videoId = getVideoId(url);
  const wrapper = document.createElement('div');
  wrapper.setAttribute('itemscope', '');
  wrapper.setAttribute('itemtype', 'https://schema.org/VideoObject');

  try {
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${videoId}`);
    const json = await response.json();
    wrapper.innerHTML = `
      <meta itemprop="name" content="${json.title}"/>
      <link itemprop="embedUrl" href="https://player.vimeo.com/video/${videoId}"/>
      <link itemprop="thumbnailUrl" href="${json.thumbnail_url}"/>
      ${wrapper.innerHTML}
    `;
  } catch (err) {
    // Nothing to do, metadata just won't be added to the video
  }
  const litePlayer = document.createElement('lite-vimeo');
  litePlayer.setAttribute('videoid', videoId);

  const playBtnEl = document.createElement('button');
  playBtnEl.setAttribute(('class', 'ltv-playbtn'), ('aria-label', 'Video play button'));
  wrapper.append(litePlayer);
  return wrapper.outerHTML;
};

const EMBEDS_CONFIG = {
  vimeo: embedVimeo,
  youtube: embedYoutube,
  facebook: embedFacebook,
  twitter: embedTwitter,
  instagram: embedInstagram,
};

function getPlatform(url) {
  const [service] = url.hostname.split('.').slice(-2, -1);
  if (service === 'youtu') {
    return 'youtube';
  }
  return service;
}

const loadEmbed = async (block, service, url) => {
  block.classList.toggle('skeleton', true);

  const embed = EMBEDS_CONFIG[service];
  if (!embed) {
    block.classList.toggle('generic', true);
    block.innerHTML = getDefaultEmbed(url);
    return;
  }

  try {
    block.classList.toggle(service, true);
    try {
      block.innerHTML = await embed(url);
    } catch (err) {
      block.style.display = 'none';
    } finally {
      block.classList.toggle('skeleton', false);
    }
  } catch (err) {
    block.style.maxHeight = '0px';
  }
};

/*
export default function decorate(block) {
  const link = block.querySelector('a').href;
  block.textContent = '';
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      loadEmbed(block, link);
    }
  });
  observer.observe(block);
}
   */

/**
 * @param {HTMLDivElement} block
 */
export default async function decorate(block) {
  const url = new URL(block.querySelector('a').href.replace(/%5C%5C_/, '_'));

  block.textContent = '';
  const service = getPlatform(url);
  // Both YouTube and TikTok use an optimized lib that already leverages the intersection observer
  if (service !== 'youtube') {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) {
        return;
      }

      loadEmbed(block, service, url);
      observer.unobserve(block);
    });
    observer.observe(block);
    return Promise.resolve();
  }
  return loadEmbed(block, service, url);
}
