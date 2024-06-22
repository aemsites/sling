import { readBlockConfig } from '../../scripts/aem.js';
import { GQL_QUERIES, fetchGQL } from '../../scripts/gql-utils.js';
import { createTag, fetchPlaceholders } from '../../scripts/utils.js';

const PACKAGE_TYPES = Object.freeze({
  blue: {
    name: 'blue',
    title: 'Blue',
  },
  orange: {
    name: 'orange',
    title: 'Orange',
  },
  combo: {
    name: 'combo',
    title: 'Orange & Blue',
  },
});

function createCard(
  packageType,
  planOfferPlaceholders,
  planComparisonPlaceholders,
  packageJson,
) {
  const card = createTag('div', { class: 'card' });
  const cardHeader = createTag('div', { class: 'card-header' }, planComparisonPlaceholders[`${packageType.name}servicetitletext`] || '');
  const price = createTag('div', { class: 'price' });
  const basePrice = Number(packageJson.base_price) || '';
  const offerPrice = Number(packageJson.plan_offer_price) || '';
  const discountPrice = basePrice - offerPrice;
  const basePriceSpan = createTag('span', { class: 'base-price' }, `$${basePrice}` || '');
  const offerPriceSpan = createTag('span', { class: 'offer-price' }, `$${offerPrice}` || '');
  const discountPriceSpan = createTag('div', { class: 'discount-price' }, `$${discountPrice} off your first month` || '');
  price.appendChild(basePriceSpan);
  price.appendChild(offerPriceSpan);
  price.appendChild(discountPriceSpan);
  cardHeader.appendChild(price);
  card.appendChild(cardHeader);
  const cardBody = createTag('div', { class: 'card-body' });
  const channelsWrapper = createTag('div', { class: 'channels' });
  const channels = packageJson.channels.map((channel) => {
    const imageUrl = `https://www.sling.com/${planOfferPlaceholders.iconurlbase}/${channel.call_sign}.svg`;
    const channelImage = createTag('img', {
      src: imageUrl,
      alt: channel.name,
    });
    const channelDiv = createTag('span', { class: 'channel' }, channelImage);
    return channelDiv;
  });
  channelsWrapper.append(...channels);
  cardBody.appendChild(channelsWrapper);
  const streamDevicesContent = planOfferPlaceholders[`${packageType.name}servicedevicestreamstext`];
  const streamDevices = createTag('div', { class: 'stream-devices' }, streamDevicesContent || '');
  cardBody.appendChild(streamDevices);
  card.appendChild(cardBody);
  return card;
}

export default async function decorate(block) {
  window.zipCode = '90210';
  const blockConfig = await readBlockConfig(block);
  const planOfferPlaceholders = await fetchPlaceholders('default', 'plan-offer');
  const planIdentifier = blockConfig['plan-identifier'] || planOfferPlaceholders.planIdentifier || 'one-month';
  const planOfferIdentifier = blockConfig['plan-offer-identifier'] || planOfferPlaceholders.planOfferIdentifier || 'extra-stair-step-2';
  const packageType = blockConfig['package-type'] || planOfferPlaceholders.packageType || 'base_linear';
  const isChannelRequired = blockConfig['is-channel-required'] || planOfferPlaceholders.isChannelRequired || 'true';
  const tagIn = blockConfig['tag-in'] || planOfferPlaceholders.tagIn || 'us';
  const zipCode = window.zipCode || planOfferPlaceholders.defaultZipCode;
  block.innerHTML = '';
  const planOfferJson = await fetchGQL(
    GQL_QUERIES.getPackage.query,
    GQL_QUERIES.getPackage.variables(
      packageType,
      isChannelRequired,
      tagIn,
      zipCode,
      planOfferIdentifier,
      planIdentifier,
    ),
    GQL_QUERIES.getPackage.operationName,
  );
  console.log(planOfferJson);

  const planComparisonPlaceholders = await fetchPlaceholders('default', 'plan-comparison');
  // Create the Section Title & Subtitle
  const sectionTitleValue = blockConfig['section-title-text'] || planOfferPlaceholders.optionalSectionTitleText || '';
  const sectionTitle = createTag('h2', { class: 'section-title' }, sectionTitleValue);
  const sectionSubtitleValue = blockConfig['section-subtitle-text'] || planOfferPlaceholders.optionalSectionSubtitleText || '';
  const sectionSubtitle = createTag('div', { class: 'section-subtitle' }, sectionSubtitleValue);
  block.appendChild(sectionTitle);
  block.appendChild(sectionSubtitle);
  const orangePackageJson = planOfferJson.data.packages.items.package
    .filter((p) => p.name === PACKAGE_TYPES.orange.title)[0];
  const bluePackageJson = planOfferJson.data.packages.items.package
    .filter((p) => p.name === PACKAGE_TYPES.blue.title)[0];
  const comboPackageJson = planOfferJson.data.packages.items.package
    .filter((p) => p.name === PACKAGE_TYPES.combo.title)[0];
  const orangeCard = createCard(
    PACKAGE_TYPES.orange,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    orangePackageJson,
  );
  const blueCard = createCard(
    PACKAGE_TYPES.blue,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    bluePackageJson,
  );
  const comboCard = createCard(
    PACKAGE_TYPES.combo,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    comboPackageJson,
  );
  const cardWrapper = createTag('div', { class: 'card-wrapper' });
  cardWrapper.append(orangeCard);
  cardWrapper.append(blueCard);
  cardWrapper.append(comboCard);
  block.append(cardWrapper);
}
