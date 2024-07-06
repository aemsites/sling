/*
 * Embed Block.
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */
let delayDone = false;

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
    scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedTwitter = (url) => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach((script) => {
    const hasTwitterJs = script.src.includes('https://platform.twitter.com/widgets.js');
    if (hasTwitterJs) {
      script.remove();
    }
  });

  if (delayDone) {
    loadScript('https://platform.twitter.com/widgets.js');
  }
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  return embedHTML;
};

const embedInstagram = (url, options) => {
  const scripts = document.querySelectorAll('script');
  const srcArray = [];

  scripts.forEach((script) => {
    srcArray.push(script.src);
  });

  const hasInstagramJs = srcArray.includes('https://www.instagram.com/embed.js');

  if (!hasInstagramJs) {
    loadScript('https://www.instagram.com/embed.js');
  }

  const embedHTML = `<blockquote class="instagram-media" ${options ? 'data-instgrm-captioned' : ''} data-instgrm-permalink="${url.href}" data-instgrm-version="14"></blockquote>`;
  return embedHTML;
};

const embedTiktok = async (url) => {
  const response = await fetch(`https://www.tiktok.com/oembed?url=${url.href}`);
  const nextStep = await response.json();
  const embedHTML = nextStep.html;
  const scripts = document.querySelectorAll('script');

  scripts.forEach((script) => {
    const hasTiktokJs = script.src.includes('https://www.tiktok.com/embed.js');
    if (hasTiktokJs) {
      script.remove();
    }
  });

  if (delayDone) {
    loadScript('https://www.tiktok.com/embed.js');
  }

  return embedHTML;
};

const embedLoaderSpinner = () => {
  const span = document.createElement('span');
  const spanParent = document.createElement('span');
  spanParent.className = 'loader-parent';
  span.className = 'loader';
  spanParent.append(span);
  return spanParent;
};

const loadEmbed = (block, link, options) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
    {
      match: ['instagram'],
      embed: embedInstagram,
    },
    {
      match: ['tiktok'],
      embed: embedTiktok,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    const isTiktok = config.match[0] === 'tiktok';
    if (isTiktok) {
      config.embed(url, options).then((data) => {
        block.innerHTML = data;
      });
    } else {
      block.innerHTML = config.embed(url, options);
    }
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

const instagramObjects = [];

export default function decorate(block) {
  function formatHTML() {
    let embedLink = '';
    block.innerHTML = block.textContent;
    const isTwitter = block.innerHTML.includes('twitter');
    const isTiktok = block.innerHTML.includes('tiktok');
    const isInstagram = block.innerHTML.includes('instagram');

    if (isTwitter) {
      const getLinks = block.querySelectorAll('a');

      getLinks.forEach((a) => {
        const myLink = a.href.includes('status');
        if (myLink) {
          embedLink = a.href;
        }
      });
    }

    if (isTiktok) embedLink = block.querySelector('blockquote').getAttribute('cite');
    if (isInstagram) embedLink = block.querySelector('blockquote').getAttribute('data-instgrm-permalink');

    return embedLink;
  }
  const isLink = block.querySelector('a')?.href;
  const link = !isLink ? formatHTML() : isLink;
  const placeholder = block.querySelector('picture');
  const instagram = block.classList.contains('instagram');
  const preInstagram = block.innerHTML.includes('instagram');
  const preTwitter = block.innerHTML.includes('twitter');
  const twitter = block.classList.contains('twitter');
  const preTiktok = block.innerHTML.includes('tiktok');
  const tiktok = block.classList.contains('tiktok');

  if (preInstagram && !instagram) {
    loadEmbed(block);
    return;
  }

  block.textContent = '';

  if ((twitter && !delayDone) || (preTwitter && !twitter && !delayDone)) {
    const embedWrapper = block.closest('.embed-wrapper');
    const spinner = embedLoaderSpinner();

    embedWrapper.classList.add('twitter-loader');
    block.classList.add('loading');

    embedWrapper.append(spinner);
  }

  if ((tiktok && !delayDone) || (preTiktok && !tiktok && !delayDone)) {
    const embedWrapper = block.closest('.embed-wrapper');
    const spinner = embedLoaderSpinner();

    embedWrapper.classList.add('tiktok-loader');
    block.classList.add('loading');

    embedWrapper.append(spinner);
  }

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = '<div class="embed-placeholder-play"><button title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
  } else if (instagram) {
    const caption = block.classList.contains('captions');
    const spinner = embedLoaderSpinner();

    block.classList.add('loading');

    block.append(spinner);

    instagramObjects.push({ instBlock: block, instLink: link, instCaption: caption });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();

          loadEmbed(block);
        }
      },
      {
        rootMargin: `${window.innerHeight * 1.25}px 0px`,
      },
    );
    observer.observe(block);
  }
}

export function embedDelayDone() {
  delayDone = true;
}

export function instagramDelay() {
  instagramObjects.forEach((instagramInfo) => {
    loadEmbed(instagramInfo.instBlock, instagramInfo.instLink, instagramInfo.instCaption);
  });
}
