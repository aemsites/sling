import {
  readBlockConfig, buildBlock, decorateBlock, loadBlock, decorateButtons,
  decorateIcons,
} from '../../scripts/aem.js';
import {
  GQL_QUERIES, fetchGQL, createTag, fetchPlaceholders,
} from '../../scripts/utils.js';

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

async function createCard(
  packageType,
  planOfferPlaceholders,
  planComparisonPlaceholders,
  packageJson,
  exclusiveChannels = [],
  comboExclusiveChannels = [],
) {
  const card = createTag('div', { class: `card ${packageType.name}` });
  if (packageType.name === 'combo') {
    card.classList.add('combo');
  } else {
    card.classList.add('single');
  }
  const cardHeader = createTag('div', { class: 'card-header' });
  const cardTitle = createTag('div', { class: 'card-title' });
  const title = createTag('h3', {}, planComparisonPlaceholders[`${packageType.name}servicetitletext`] || '');
  cardTitle.appendChild(title);
  cardHeader.appendChild(cardTitle);
  const price = createTag('div', { class: 'price' });
  const basePrice = Number(packageJson.base_price) || '';
  const offerPrice = Number(packageJson.plan_offer_price) || '';
  const discountPrice = basePrice - offerPrice;
  const basePriceSpan = createTag('span', { class: 'base-price' }, `$${basePrice}/month ` || ' ');
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
  const exclusiveChannelsList = exclusiveChannels.map((channel) => {
    const imageUrl = `https://www.sling.com/${planOfferPlaceholders.iconurlbase}/${channel.call_sign}.svg`;
    const channelImage = createTag('img', {
      src: imageUrl,
      alt: channel.name,
    });
    const channelDiv = createTag('span', { class: 'channel' }, channelImage);
    return channelDiv;
  });
  const carouselContent = [];
  exclusiveChannelsList.forEach((channel) => {
    carouselContent.push([channel]);
  });
  const carouselBlock = buildBlock('carousel', carouselContent);
  channelsWrapper.append(carouselBlock);
  if (packageType.name !== 'combo') {
    const cardBodyText = createTag('div', { class: 'card-body-text' }, `${channels.length} total channels including` || '');
    const cardBodySubtext = createTag('div', { class: 'card-body-subtext' }, `${exclusiveChannelsList.length} exclusive ${planOfferPlaceholders[`${packageType.name}exclusivechannelsgenres`]} channels` || '');
    const planLink = createTag('a', { class: 'plan-link', href: '#' }, 'What\'s included');
    cardBody.appendChild(cardBodyText);
    cardBody.appendChild(cardBodySubtext);
    channelsWrapper.appendChild(planLink);
  } else {
    const cardBodyText = createTag('div', { class: 'card-body-text' }, `Enjoy all ${channels.length} ${packageJson.name} channels` || '');
    const cardBodySubtext = createTag('div', { class: 'card-body-subtext' }, `including all ${comboExclusiveChannels.length} exclusive channels` || '');
    cardBody.appendChild(cardBodyText);
    cardBody.appendChild(cardBodySubtext);
  }
  cardBody.appendChild(channelsWrapper);
  const streamDevicesTVIcon = createTag('span', { class: 'icon icon-dark-tv' });
  const streamDevicesContent = createTag('div', { class: 'stream-devices-content' }, planOfferPlaceholders[`${packageType.name}servicedevicestreamstext`]);
  const streamDevicesInfo = createTag('span', { class: 'icon icon-info' });
  // eslint-disable-next-line dot-notation
  const streamDevicesInfoModal = createTag('a', { href: planOfferPlaceholders.blueorangestreammodal, alt: 'stream for each package', class: 'modal' }, streamDevicesInfo);
  const streamDevices = createTag('div', { class: 'stream-devices' });
  streamDevices.appendChild(streamDevicesTVIcon);
  streamDevices.appendChild(streamDevicesContent);
  streamDevices.appendChild(streamDevicesInfoModal);
  cardBody.appendChild(streamDevices);

  // Buttons
  const planButton = createTag('a', { class: 'button plan', href: planComparisonPlaceholders[`${packageType.name}servicectalink`] }, planComparisonPlaceholders[`${packageType.name}servicectatext`] || '');
  const comparePlans = createTag('a', { class: 'button compare', href: '#' }, 'COMPARE PLANS');
  const buttonWrapper = createTag('div', { class: 'button-wrapper' });
  buttonWrapper.appendChild(planButton);
  buttonWrapper.appendChild(comparePlans);
  cardBody.appendChild(buttonWrapper);
  decorateButtons(buttonWrapper);
  decorateIcons(cardBody);
  card.appendChild(cardBody);
  decorateBlock(carouselBlock);
  await loadBlock(carouselBlock);
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
  const orangeExclusiveChannels = orangePackageJson.channels.filter(
    ({ name }) => !bluePackageJson.channels.some((e) => e.name === name),
  );
  const blueExclusiveChannels = bluePackageJson.channels.filter(
    ({ name }) => !orangePackageJson.channels.some((e) => e.name === name),
  );
  const orangeCard = await createCard(
    PACKAGE_TYPES.orange,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    orangePackageJson,
    orangeExclusiveChannels,
  );
  const blueCard = await createCard(
    PACKAGE_TYPES.blue,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    bluePackageJson,
    blueExclusiveChannels,
  );
  const comboCard = await createCard(
    PACKAGE_TYPES.combo,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    comboPackageJson,
    [],
    [...orangeExclusiveChannels, ...blueExclusiveChannels],
  );
  const cardWrapper = createTag('div', { class: 'card-wrapper' });
  cardWrapper.append(orangeCard);
  cardWrapper.append(blueCard);
  cardWrapper.append(comboCard);
  block.append(cardWrapper);
}
