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

async function getPrice(packageJson, extended = false) {
  const price = createTag('div', { class: 'price' });
  const basePrice = Number(packageJson.base_price) || '';
  const offerPrice = Number(packageJson.plan_offer_price) || '';
  const discountPrice = basePrice - offerPrice;
  const basePriceText = extended ? `$${basePrice}/month ` : `$${basePrice}/mo ` || ' ';
  const offerPriceText = `$${offerPrice}` || '';
  const basePriceSpan = createTag('span', { class: 'base-price' }, basePriceText);
  const offerPriceSpan = createTag('span', { class: 'offer-price' }, offerPriceText);
  price.appendChild(basePriceSpan);
  price.appendChild(offerPriceSpan);
  if (extended) {
    const discountPriceSpan = createTag('div', { class: 'discount-price' }, `$${discountPrice} off your first month` || '');
    price.appendChild(discountPriceSpan);
  }
  return price;
}

async function createChannelRows(
  planComparisonPlaceholders,
  table,
  exclusiveChannels,
  comboPackageJson,
  packageType,
) {
  let headerText;
  if (packageType === PACKAGE_TYPES.orange.name) {
    headerText = planComparisonPlaceholders.domesticsegmentsectiontext.replace('{channelCount}', exclusiveChannels.length);
  }
  if (packageType === PACKAGE_TYPES.blue.name) {
    headerText = planComparisonPlaceholders.slingmsssegmentsectiontext.replace('{channelCount}', exclusiveChannels.length);
  }
  if (packageType === PACKAGE_TYPES.combo.name) {
    headerText = planComparisonPlaceholders.slingcombosegmentsectiontext.replace('{channelCount}', exclusiveChannels.length);
  }
  const header = createTag('div', { class: `${packageType}-header` }, headerText);
  table.append(header);
  exclusiveChannels.forEach((channel) => {
    const channelDiv = createTag('div', { class: 'channel-div' });
    const imageUrl = `https://www.sling.com/${planComparisonPlaceholders.compareiconurlbase}/${channel.call_sign}.svg`;
    const channelImage = createTag('img', {
      src: imageUrl,
      alt: channel.name,
    });
    const channelImageSpan = createTag('span', { class: 'channel-image' }, channelImage);
    const channelNameSpan = createTag('span', { class: 'channel-name' }, channel.name);
    const checkMark = createTag('span', { class: 'icon icon-checkmark' });
    const dashMark = createTag('span', { class: 'icon icon-dashmark' });
    channelDiv.append(channelImageSpan);
    channelDiv.append(channelNameSpan);
    if (packageType === PACKAGE_TYPES.orange.name) {
      channelDiv.appendChild(checkMark.cloneNode());
      channelDiv.appendChild(dashMark.cloneNode());
    } else if (packageType === PACKAGE_TYPES.blue.name) {
      channelDiv.appendChild(dashMark.cloneNode());
      channelDiv.appendChild(checkMark.cloneNode());
    } else {
      channelDiv.appendChild(checkMark.cloneNode());
      channelDiv.appendChild(checkMark.cloneNode());
    }
    if (comboPackageJson.channels.some((e) => e.name === channel.name)) {
      channelDiv.appendChild(checkMark.cloneNode());
    } else {
      channelDiv.appendChild(dashMark.cloneNode());
    }
    decorateIcons(channelDiv);
    table.append(channelDiv);
  });
}

async function getComparisonTable(planComparisonPlaceholders, packages) {
  const orangePackageJson = packages
    .filter((p) => p.name === PACKAGE_TYPES.orange.title)[0];
  const bluePackageJson = packages
    .filter((p) => p.name === PACKAGE_TYPES.blue.title)[0];
  const comboPackageJson = packages
    .filter((p) => p.name === PACKAGE_TYPES.combo.title)[0];
  const orangeExclusiveChannels = orangePackageJson.channels.filter(
    ({ name }) => !bluePackageJson.channels.some((e) => e.name === name),
  );
  const blueExclusiveChannels = bluePackageJson.channels.filter(
    ({ name }) => !orangePackageJson.channels.some((e) => e.name === name),
  );
  const commonChannels = orangePackageJson.channels.filter(
    ({ name }) => bluePackageJson.channels.some((e) => e.name === name),
  );

  // Price for each package
  const orangePrice = await getPrice(orangePackageJson);
  const bluePrice = await getPrice(bluePackageJson);
  const comboPrice = await getPrice(comboPackageJson);
  const table = createTag('div', { class: 'comparison-table-content' });
  const emptyColHeader = createTag('div', { }, '');
  const orangeColHeader = createTag('div', { }, orangePrice);
  const blueColHeader = createTag('div', { }, bluePrice);
  const comboColHeader = createTag('div', { }, comboPrice);
  const theadRow = createTag('div', { class: 'header-row' });
  theadRow.append(emptyColHeader);
  theadRow.append(orangeColHeader);
  theadRow.append(blueColHeader);
  theadRow.append(comboColHeader);
  table.append(theadRow);
  // Orange Channels
  await createChannelRows(
    planComparisonPlaceholders,
    table,
    orangeExclusiveChannels,
    comboPackageJson,
    PACKAGE_TYPES.orange.name,
  );

  // Blue Channels
  await createChannelRows(
    planComparisonPlaceholders,
    table,
    blueExclusiveChannels,
    comboPackageJson,
    PACKAGE_TYPES.blue.name,
  );

  // Common Channels
  await createChannelRows(
    planComparisonPlaceholders,
    table,
    commonChannels,
    comboPackageJson,
    PACKAGE_TYPES.combo.name,
  );
  return table;
}

async function getComparisonModalContent(
  packageType,
  planOfferPlaceholders,
  planComparisonPlaceholders,
  packageJson,
  packages,
) {
  const modalContent = createTag('div', { class: 'modal-content' });
  const modalTitle = createTag('h2', { class: 'title' }, planComparisonPlaceholders?.headertext || 'Header');
  const modalSubTitle = createTag('p', { class: 'subtitle' }, planComparisonPlaceholders?.subheadertext || 'Sub Header');
  const zipWrapper = createTag('div');
  const zipBlock = buildBlock('zipcode', createTag('div'));
  zipWrapper.append(zipBlock);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalSubTitle);
  modalContent.appendChild(zipWrapper);
  const comparisonTable = await getComparisonTable(planComparisonPlaceholders, packages);
  const comparisonTableDiv = createTag('div', { class: 'comparison-table' }, comparisonTable);
  modalContent.appendChild(comparisonTableDiv);
  decorateBlock(zipBlock);
  await loadBlock(zipBlock);
  return modalContent.childNodes;
  // const channelsWrapper = createTag('div', { class: 'channels' });
  // const channels = packageJson.channels.map((channel) => {
  //   const imageUrl = `https://www.sling.com/${planOfferPlaceholders.iconurlbase}/${channel.call_sign}.svg`;
  //   const channelImage = createTag('img', {
  //     src: imageUrl,
  //     alt: channel.name,
  //   });
  //   const channelDiv = createTag('span', { class: 'channel' }, channelImage);
  //   return channelDiv;
  // });
}

async function createCard(
  packageType,
  planOfferPlaceholders,
  planComparisonPlaceholders,
  packageJson,
  packages,
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
  const price = await getPrice(packageJson, true);
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
  const buttonWrapper = createTag('div', { class: 'button-wrapper' });
  buttonWrapper.appendChild(planButton);
  if (packageType.name !== 'combo') {
    const comparePlans = createTag('a', { class: 'button compare', href: '#' }, 'COMPARE PLANS');
    buttonWrapper.appendChild(comparePlans);
    // Compare plans modal
    comparePlans.addEventListener('click', async (e) => {
      e.preventDefault();
      const { createModal } = await import('../modal/modal.js');
      const modalContent = await getComparisonModalContent(
        packageType,
        planOfferPlaceholders,
        planComparisonPlaceholders,
        packageJson,
        packages,
      );
      const comparisonModal = await createModal(modalContent);
      comparisonModal.showModal();
    });
  }
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
  const allPackages = planOfferJson.data.packages.items.package;
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
    allPackages,
    orangeExclusiveChannels,
  );
  const blueCard = await createCard(
    PACKAGE_TYPES.blue,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    bluePackageJson,
    allPackages,
    blueExclusiveChannels,
  );
  const comboCard = await createCard(
    PACKAGE_TYPES.combo,
    planOfferPlaceholders,
    planComparisonPlaceholders,
    comboPackageJson,
    [],
    [],
    [...orangeExclusiveChannels, ...blueExclusiveChannels],
  );
  const cardWrapper = createTag('div', { class: 'card-wrapper' });
  cardWrapper.append(orangeCard);
  cardWrapper.append(blueCard);
  cardWrapper.append(comboCard);
  block.append(cardWrapper);
}
