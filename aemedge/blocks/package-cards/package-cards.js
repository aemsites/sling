import { createTag, readBlockConfig, loadScript } from '../../scripts/utils.js';

const options = {
  threshold: 0,
};// eslint-disable-next-line no-use-before-define
const observer = new IntersectionObserver(await loadReactLib, options);
async function loadReactLib(entries) {
  if (entries.some(async (entry) => {
    if (entry.isIntersecting) {
      await loadScript('../../../aemedge/scripts/sling-react/package-cards-build.js', {}, entry.target);
      observer.unobserve(entry.target);
    }
  }));
}

function createLogoObject(logo) {
  const logoStr = logo.split('=');
  const logoObject = {};
  logoObject.channelSign = logoStr[0].trim();
  logoObject.alText = logoStr[1].trim();
  return logoObject;
}
export default async function decorate(block) {
  const config = await readBlockConfig(block);
  const c1logos = [];
  const c2logos = [];
  if (config['C1-Override-Logos'].length > 0 && config['C1-Override-Logos'] === 'true') {
    if (typeof config['C1-Logos'] === 'string') {
      if (config['C1-Logos'] !== '') {
        c1logos.push(createLogoObject(config['C1-Logos']));
      }
    } else {
      config['C1-Logos']?.forEach((logo) => {
        c1logos.push(createLogoObject(logo));
      });
    }
  }

  if (config['C2-Override-Logos'].length > 0 && config['C2-Override-Logos'] === 'true') {
    if (typeof config['C2-Logos'] === 'string') {
      if (config['C2-Logos'] !== '') {
        c2logos.push(createLogoObject(config['C2-Logos']));
      }
    } else {
      config['C2-Logos']?.forEach((logo) => {
        c2logos.push(createLogoObject(logo));
      });
    }
  }

  const cardone = {
    packId: config['C1-Pack-Id'] || null,
    title: config['C1-Title'] || null,
    priceText: config['C1-Price-Text'] || '/mo.',
    showPromotionalPrice: (config['C1-Show-Promotional-Price']?.toLowerCase?.() === 'true') || false,
    promotionalText: config['C1-Promotional-Text'] || '<p><b>As low as <span class:\'strike-through\'>$40</span>&nbsp;$20 for your first month</b></p>\r\n',
    channelNumber: config['C1-Channel-Number'] || null,
    singleChannelText: config['C1-Single-Channel-Text'] || null,
    multipleChannelText: config['C1-Multiple-Channel-Text'] || null,
    linkText: config['C1-Link-Text'] || 'View all channels',
    overrideLogos: (config['C1-Override-Logos']?.toLowerCase?.() === 'true') || false,
    logos: c1logos.length > 0 ? c1logos : null,
  };
  const cardtwo = {
    packId: config['C2-Pack-Id'] || null,
    title: config['C2-Title'] || null,
    priceText: config['C2-Price-Text'] || '/mo',
    showPromotionalPrice: (config['C2-Show-Promotional-Price']?.toLowerCase?.() === 'true') || false,
    promotionalText: config['C2-Promotional-Text'] || null,
    channelNumber: config['C2-Channel-Number'] || null,
    singleChannelText: config['C2-Single-Channel-Text'] || null,
    multipleChannelText: config['C2-Multiple-Channel-Text'] || null,
    linkText: config['C2-Link-Text'] || 'View all Channels',
    overrideLogos: (config['C2-Override-Logos']?.toLowerCase?.() === 'true') || false,
    logos: c2logos.length > 0 ? c2logos : null,
  };
  const container = createTag(
    'div',
    {
      id: 'package-cards-app',
      'data-sling-package-cards-plan-id': config['Plan-Id'] || 'monthly',
      'data-sling-package-cards-plan-identifier-a-c': config['Plan-Identifier'] || 'one-month',
      'data-sling-package-cards-plan-offer-identifier': config['Plan-Offer-Identifier'] || 'extra-stair-step-2',
      'data-sling-package-cards-classification': config.Classification || 'us',
      'data-sling-package-cards-classification-a-c': config['Classification-A-C'] || 'us',
      'data-sling-package-cards-card-one-config': JSON.stringify(cardone),
      'data-sling-package-cards-card-two-config': JSON.stringify(cardtwo),
      'data-sling-package-cards-card-two-type': config['Card-Two-Type'] || 'extra',
      'data-sling-package-cards-logo-base-path': '/aemedge/icons/application-assets/shared/web/logos/black',
      'data-sling-package-cards-analytics-modal-name': config['Analytics-Modal-Name'] || 'analytics-modal-name',
    },
  );
  block.append(container);
  // observer.observe(block);
}
