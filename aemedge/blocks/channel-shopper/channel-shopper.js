import { createTag, loadScript, readBlockConfig } from '../../scripts/utils.js';

const options = {
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
  // note the channelIconUrl which is overwriting the path from /content/dam to drive location
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
    channelIconUrl: '/aemedge/icons/channels/AllLOBLogos/color',
    ctaUrl: `${config.ctaUrl}` || '/cart/magento/account',
    maxChannelsSelected: 5,
    limitHitErrorText: `${config.limitHitErrorText}` || 'Unselect a channel to add another. To view all channels '
                          + 'in your recommended plan, click the \'more\' button(s).',
    errorMsgDuration: 5000,
    promoTruncateCharLimit: 13,
  };

  const container = createTag('div', { id: 'channel-shopper-app', 'data-sling-props': JSON.stringify(slingProps) });
  block.append(container);

  observer.observe(block);
}
