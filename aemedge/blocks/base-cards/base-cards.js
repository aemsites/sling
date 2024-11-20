import { createTag, readBlockConfig, loadScript } from '../../scripts/utils.js';

const options = {
  threshold: 0,
};// eslint-disable-next-line no-use-before-define
const observer = new IntersectionObserver(await loadReactLib, options);
async function loadReactLib(entries) {
  if (entries.some(async (entry) => {
    if (entry.isIntersecting) {
      await loadScript('../../../aemedge/scripts/sling-react/base-cards-build.js', {}, entry.target);
      observer.unobserve(entry.target);
    }
  }));
}

export default async function decorate(block) {
  const config = await readBlockConfig(block);
  const slingProps = {
    optionalSectionTitleText: config['Optional-Section-Title-Text'] || 'Sling TV Services',
    optionalSectionSubtitleText: config['Optional-Section-Subtitle-Text'] || 'No annual contracts. Customize with extras.',
    blueServiceDeviceStreamsText: config['Blue-Service-Device-Stream-Text'] || 'Stream on 3 devices at a time',
    orangeServiceDeviceStreamsText: config['Orange-Service-Device-Stream-Text'] || 'Stream on 1 device at a time',
    comboServiceDeviceStreamsText: config['Combo-Service-Device-Stream-Text'] || '3 + 1 device streams',
    blueServiceDVRText: config['Blue-Service-DVR-Text'] || '50 Hours DVR Storage Included',
    orangeServiceDVRText: config['Orange-Service-DVR-Text'] || '50 Hours DVR Storage Included',
    comboServiceDVRText: config['Combo-Service-DVR-Text'] || '50 Hours DVR Storage Included',
    orangeExclusiveChannelsGenres: 'Sports and Family',
    blueExclusiveChannelsGenres: 'News and Entertainment',
    showOrangeHighlightBanner: false,
    showBlueHighlightBanner: false,
    showComboHighlightBanner: false,
    blueServiceGoodForOne: config['Blue-Service-First-Good-For-Text'] || 'Families',
    orangeServiceGoodForOne: config['Orange-Service-First-Good-For-Text'] || 'Lifestyle',
    comboServiceGoodForOne: config['Combo-Service-First-Good-For-Text'] || 'Sports',
    blueServiceGoodForTwo: config['Blue-Service-Second-Good-For-Text'] || 'NFL Fans',
    orangeServiceGoodForTwo: config['Orange-Service-Second-Good-For-Text'] || 'Sports Lovers',
    comboServiceGoodForTwo: config['Combo-Service-Second-Good-For-Text'] || 'Entertainment',
    showLocalsBanners: config['Show-locals-banner-on-blue-and-combo-card'] || true,
    classification: 'us',
    iconURLBase: '/aemedge/icons/channels/AllLOBLogos/color',
    grayIconURLBase: '/aemedge/icons/channels/AllLOBLogos/gray',
    ctaStyle: 'primary',
    ctaTheme: 'light',
    ctaSubText: 'Offer Details',
    ctaSubTextColor: 'marshmallow',
    ctaSubTextDesktopAlignment: 'left',
    ctaSubTextMobileAlignment: 'left',
    planIdentifier: config['Plan-Identifier'] || 'one-month',
    planOfferIdentifier: config['Plan-Offer-Identifier'] || 'extra-stair-step-2',
    comparisonComponentProps: {
      analyticsModalName: 'package-compare-v2',
      usePageScroll: false,
      modalWidth: '1000px',
      modalHeight: '80%',
      headerText: 'Sling Channels',
      subheaderText: 'Don’t see a channel you like? More channels are available in add-ons.',
      slingComboAuthoredName: 'Get Both',
      monthText: ' ',
      compareIconURLBase: '/aemedge/icons/channels/AllLOBLogos/color',
      hideFooterCTA: true,
      footerCtaLink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2',
      footerCtaText: 'Try Us Today',
      targetWindow: '_self',
      mobileStickyCTATextColor: 'White',
      orangeServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=domestic',
      blueServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=sling-mss',
      comboServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=sling-combo',
      orangeServiceCTAText: config['Orange-Service-CTA-Text'] || 'Add Orange',
      blueServiceCTAText: config['Blue-Service-CTA-Text'] || 'Add Blue',
      comboServiceCTAText: config['Combo-Service-CTA-Text'] || 'Add Both',
      orangeServiceTitleText: config['Orange-Service-Title-Text'] || 'Orange',
      blueServiceTitleText: config['Blue-Service-Title-Text'] || 'Blue',
      comboServiceTitleText: config['Combo-Service-Title-Text'] || 'Orange & Blue',
      servicesCompareToolBlueCtaText: config['Blue-CTA-Text'] || 'Select',
      servicesCompareToolOrangeCtaText: config['Orange-CTA-Text'] || 'Select',
      servicesCompareToolComboCtaText: config['Combo-CTA-Text'] || 'Select',
      domesticSegmentSectionText: 'Only on Sling Orange: {channelCount} channels',
      domesticSegmentSectionTextColor: '#171725',
      domesticSegmentSectionTextBackgroundColor: 'rgb(255,152,0)',
      slingMssSegmentSectionText: 'Only on Sling Blue: {channelCount} channels',
      slingMssSegmentSectionTextColor: '#E9E9EA',
      slingMssSegmentSectionTextBackgroundColor: 'rgb(0,50,175)',
      slingMssLocalsSegmentSectionText: 'Live Local Channels in {zipCode}',
      slingMssLocalsSegmentSectionTextColor: '#171725',
      slingMssLocalsSegmentSectionTextBackgroundColor: '#C3C3C3',
      slingMssOtherChannelsSegmentSectionText: 'More Channels on Sling Blue',
      slingMssOtherChannelsSegmentSectionTextColor: '#171725',
      slingMssOtherChannelsSegmentSectionTextBackgroundColor: '#C3C3C3',
      slingComboSegmentSectionText: 'Available in All Base Services: {channelCount} channels',
      slingComboSegmentSectionTextColor: '#E9E9EA',
      domesticSegmentSectionTextBackground: 'linear-gradient(90deg, rgba(255,152,0,1) 0%, rgba(255,208,60,1) 100%);',
      slingMssSegmentSectionTextBackground: 'linear-gradient(90deg, rgba(0,50,175,1) 0%, rgba(0,91,255,1) 100%)',
      slingComboSegmentSectionTextBackground: 'linear-gradient(90deg, rgba(23,23,37,1) 0%, rgba(0,50,175,1) 100%)',
      invalidZipText: 'Invalid ZIP Code',
      zipLabel: 'ZIP Code',
    },
    useV2ComparisonModal: true,
  };

  const container = createTag('div', { id: 'base-cards-app', 'data-sling-props': JSON.stringify(slingProps) });
  block.append(container);
  observer.observe(block);
  // listen to zipcode changes and redecorate
  document.addEventListener('zipupdate', async () => {
    await loadScript('../../../aemedge/scripts/sling-react/base-cards-build.js', {}, block);
  }, { once: true });
}
