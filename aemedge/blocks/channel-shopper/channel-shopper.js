import { createTag } from '../../scripts/utils.js';

async function loadScript(src, attrs, container) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    script.onload = resolve;
    script.onerror = reject;
    container.append(script);
  });
}

function toPropName(name) {
  return typeof name === 'string'
    ? name
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

async function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toPropName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}
const options = {
  rootMargin: '0px 0px 500px 0px',
  threshold: 0,
};
// eslint-disable-next-line no-use-before-define
const observer = new IntersectionObserver(loadReactLib, options);
async function loadReactLib(entries) {
  if (entries.some(async (entry) => {
    if (entry.isIntersecting) {
      await loadScript('../../../aemedge/scripts/sling-react/channel-shopper-build.js', {}, entry.target);
      observer.unobserve(entry.target);
    }
  }));
}
export default async function decorate(block) {
  const config = await readBlockConfig(block);
  const slingProps = {
    classification: 'us',
    planIdentifier: `${config.planIdentifier}` || 'one-month',
    planOfferIdentifier: null,
    buttonText: `${config.buttonText}` || 'SHOP BY CHANNEL',
    modalHeaderText: `${config.modalHeaderText}` || 'Choose the channels you like to watch & we’ll recommend the best plan for you!',
    searchChannelPlaceholder: `${config.searchChannelPlaceholder}` || 'Search channels...',
    noResultFoundText: `${config.noResultFoundText}` || 'We couldn’t find this channel, but we found other channels you might like.',
    recommendationText: `${config.modalHeaderText}` || 'Choose a channel to view a recommendation',
    localBadgeText: `${config.localBadgeText}` || 'LOCAL',
    checkoutButtonText: `${config.checkoutButtonText}` || 'CHECKOUT',
    channelIconUrl: '/aemedge/icons/channels',
    ctaUrl: `${config.ctaUrl}` || '/cart/magento/account',
    maxChannelsSelected: 5,
    limitHitErrorText: `${config.limitHitErrorText}` || 'Unselect a channel to add another. To view all channels '
                          + 'in your recommended plan, click the \'more\' button(s).',
    errorMsgDuration: 5000,
    promoTruncateCharLimit: 13,
  };

  const container = createTag('div', { id: 'app', 'data-sling-props': JSON.stringify(slingProps) });
  block.append(container);

  observer.observe(block);
}
