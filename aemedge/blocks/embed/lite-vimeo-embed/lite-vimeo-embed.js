/* eslint-disable  */

/**
 * adapted from https://github.com/luwes/lite-vimeo-embed
 */
class LiteVimeo extends (globalThis.HTMLElement ?? class {}) {
  static _warmConnections() {
    if (LiteVimeo.preconnected) return;
    LiteVimeo.preconnected = true;

    // The iframe document and most of its subresources come right off player.vimeo.com
    addPrefetch('preconnect', 'https://player.vimeo.com');
    // Images
    addPrefetch('preconnect', 'https://i.vimeocdn.com');
    // Files .js, .css
    addPrefetch('preconnect', 'https://f.vimeocdn.com');
    // Metrics
    // addPrefetch('preconnect', 'https://fresnel.vimeocdn.com');
  }

  connectedCallback() {

    this.videoId = this.getAttribute('videoid');
    const fullUrl = // Oembed requires the unlisted account number appended to the URL too
        new URL( `https://player.vimeo.com/video/${this.videoId}`);
    /**
     * Lo, the vimeo placeholder image!  (aka the thumbnail, poster image, etc)
     * We have to use the Vimeo API.
     */
    let { width, height } = getThumbnailDimensions(this.getBoundingClientRect());
    let devicePixelRatio = window.devicePixelRatio || 1;
    if (devicePixelRatio >= 2) devicePixelRatio *= .75;
    width = Math.round(width * devicePixelRatio);
    height = Math.round(height * devicePixelRatio);

    fetch(`https://vimeo.com/api/oembed.json?url=${fullUrl}`)
      .then(response => response.json())
      .then(data => {
        let thumbnailUrl = data.thumbnail_url;
        thumbnailUrl = thumbnailUrl.replace(/-d_[\dx]+$/i, `-d_${width}x${height}`);
        this.style.backgroundImage = `url("${thumbnailUrl}")`;
      });

    let playBtnEl = this.querySelector('.ltv-playbtn');
    // A label for the button takes priority over a [playlabel] attribute on the custom-element
    this.playLabel = (playBtnEl && playBtnEl.textContent.trim()) || this.getAttribute('playlabel') || 'Play video';

    if (!playBtnEl) {
      playBtnEl = document.createElement('button');
      playBtnEl.type = 'button';
      playBtnEl.setAttribute('aria-label', this.playLabel);
      playBtnEl.classList.add('ltv-playbtn');
      this.append(playBtnEl);
    }
    playBtnEl.removeAttribute('href');

    // On hover (or tap), warm up the TCP connections we're (likely) about to use.
    this.addEventListener('pointerover', LiteVimeo._warmConnections, {
      once: true
    });

    // Once the user clicks, add the real iframe and drop our play button
    this.addEventListener('click', this.addIframe);
  }

  addIframe() {
    if (this.classList.contains('ltv-activated')) return;
    this.classList.add('ltv-activated');

    const iframeEl = document.createElement('iframe');
    iframeEl.width = 640;
    iframeEl.height = 360;
    // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
    iframeEl.title = this.playLabel;
    iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframeEl.allowFullscreen = true;
    const userParams = this.getAttribute('params');
    const additionalParams = userParams && userParams.trim() !== '' ? userParams : 'autoplay=1';
    // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
    // https://stackoverflow.com/q/64959723/89484
    iframeEl.src = `https://player.vimeo.com/video/${encodeURIComponent(this.videoId)}?${additionalParams}`;
    this.append(iframeEl);

    // Set focus for a11y
    iframeEl.addEventListener('load', iframeEl.focus, { once: true });
  }
}

if (globalThis.customElements && !globalThis.customElements.get('lite-vimeo')) {
  globalThis.customElements.define('lite-vimeo', LiteVimeo);
}

/**
 * Add a <link rel={preload | preconnect} ...> to the head
 */
function addPrefetch(kind, url, as) {
  const linkElem = document.createElement('link');
  linkElem.rel = kind;
  linkElem.href = url;
  if (as) {
    linkElem.as = as;
  }
  linkElem.crossorigin = true;
  document.head.append(linkElem);
}

/**
 * Get the thumbnail dimensions to use for a given player size.
 *
 * @param {Object} options
 * @param {number} options.width The width of the player
 * @param {number} options.height The height of the player
 * @return {Object} The width and height
 */
function getThumbnailDimensions({ width, height }) {
  let roundedWidth = width;
  let roundedHeight = height;

  // If the original width is a multiple of 320 then we should
  // not round up. This is to keep the native image dimensions
  // so that they match up with the actual frames from the video.
  //
  // For example 640x360, 960x540, 1280x720, 1920x1080
  //
  // Round up to nearest 100 px to improve cacheability at the
  // CDN. For example, any width between 601 pixels and 699
  // pixels will render the thumbnail at 700 pixels width.
  if (roundedWidth % 320 !== 0) {
    roundedWidth = Math.ceil(width / 100) * 100;
    roundedHeight = Math.round((roundedWidth / width) * height);
  }

  return {
    width: roundedWidth,
    height: roundedHeight
  };
}
