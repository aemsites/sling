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
export default async function decorate(block) {
  const config = await readBlockConfig(block);
  console.log(config);
  const slingProps = {
    optionalSectionTitleText: 'Sling TV Services',
    optionalSectionSubtitleText: 'No annual contracts. Customize with extras.',
    blueServiceDeviceStreamsText: 'Stream on 3 devices at a time',
    orangeServiceDeviceStreamsText: 'Stream on 1 device at a time',
    comboServiceDeviceStreamsText: '3 + 1 device streams',
    blueServiceDVRText: '50 Hours DVR Storage Included',
    orangeServiceDVRText: '50 Hours DVR Storage Included',
    comboServiceDVRText: '50 Hours DVR Storage Included',
    orangeExclusiveChannelsGenres: 'Sports and Family',
    blueExclusiveChannelsGenres: 'News and Entertainment',
    showOrangeHighlightBanner: false,
    showBlueHighlightBanner: false,
    showComboHighlightBanner: false,
    blueServiceGoodForOne: 'Families',
    orangeServiceGoodForOne: 'Lifestyle',
    comboServiceGoodForOne: 'Sports',
    blueServiceGoodForTwo: 'NFL Fans',
    orangeServiceGoodForTwo: 'Sports Lovers',
    comboServiceGoodForTwo: 'Entertainment',
    showLocalsBanners: true,
    classification: 'us',
    iconURLBase: '/aemedge/icons/channels',
    grayIconURLBase: '/aemedge/icons/channels',
    ctaStyle: 'primary',
    ctaTheme: 'light',
    ctaSubText: 'Offer Details',
    ctaSubTextColor: 'marshmallow',
    ctaSubTextDesktopAlignment: 'left',
    ctaSubTextMobileAlignment: 'left',
    planIdentifier: 'one-month',
    planOfferIdentifier: 'extra-stair-step-2',
    offerDetailsContent: "<p style=\\'text-align: center;\\'><b>Offer Details</b></p>\n<p style=\\'text-align: center;\\'><b>Updated December 2023</b></p>\n<p><b>Billing</b></p>\n<p>Available to new customers upon account activation. One per customer. Must provide email address and credit card. After one month, you will be billed for Sling monthly at the everyday price unless you go online to cancel. Your account will be authorized to receive programming upon your first login.</p>\n<p><b>Cancellation</b></p>\n<p>Cancel on&nbsp;<a href=\\'/\\'>Sling.com</a>&nbsp;or visit our&nbsp;<a title=\\'Help Center\\' href=\\'/help/en/contact-us\\'>Help Center</a>&nbsp;to contact us. Programming fees are charged monthly in advance and no credits or refunds will be issued for partial or prepaid months after cancellation.</p>\n<p><b>Streaming limitations</b></p>\n<p>The number of devices on which Sling content can be watched at the same time varies based on the Sling service. If you subscribe to our Sling Latino core services, you can enjoy three streams at a time. If you subscribe to our Sling International core services, you can enjoy three streams at a time. If you subscribe to our Sling Orange service, you can enjoy one stream at a time. Any extras you add to your Sling Orange service will be included in your single stream. If you subscribe to our Sling Blue service, you can enjoy up to three streams of these channels at the same time. Any extras you add to your Sling Blue service will be included in your three streams. If you subscribe to both services in Sling Orange + Sling Blue, you can enjoy up to four streams at the same time. Because you are purchasing two separate services in Sling Orange + Sling Blue, you can get the total number of streams included on each separate service—one stream for any channel on the single-stream Sling Orange service and three streams for channels on the multi-stream Sling Blue service. To get up to four streams, go to the My Account page and make sure that the “show me only Sling Blue versions of channels in both services” box is not checked.</p>\n<p><b>Miscellaneous</b></p>\n<p>Certain programs may be unavailable due to programmer restrictions or blackouts. Only available within the United States. State and local taxes apply. All prices, fees, charges, services, programming, features, functionality and offers subject to change without notice.</p>\n<p><b>Channels Offered in Select Markets</b></p>\n<p>Some local channels including ABC, FOX and NBC are only available in select markets. See which local channels are available in your area&nbsp;<a href=\\'/help/en/subscription-programming-questions/channels-programming/local-channels\\'>here</a>.</p>\n",
    comparisonComponentProps: {
      analyticsModalName: 'package-compare-v2',
      usePageScroll: false,
      modalWidth: '1000px',
      modalHeight: '80%',
      headerText: 'Sling Channels',
      subheaderText: 'Don’t see a channel you like? More channels are available in add-ons.',
      slingComboAuthoredName: 'Get Both',
      monthText: ' ',
      compareIconURLBase: '/aemedge/icons/channels',
      hideFooterCTA: true,
      footerCtaLink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2',
      footerCtaText: 'Try Us Today',
      targetWindow: '_self',
      mobileStickyCTATextColor: 'White',
      orangeServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=domestic',
      blueServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=sling-mss',
      comboServiceCTALink: '/cart/magento/account?classification=us&plan=one-month&plan_offer=extra-stair-step-2&sb=sling-combo',
      orangeServiceCTAText: 'Add Orange',
      blueServiceCTAText: 'Add Blue',
      comboServiceCTAText: 'Add Both',
      orangeServiceTitleText: 'Orange',
      blueServiceTitleText: 'Blue',
      comboServiceTitleText: 'Orange & Blue',
      servicesCompareToolBlueCtaText: 'Select',
      servicesCompareToolOrangeCtaText: 'Select',
      servicesCompareToolComboCtaText: 'Select',
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

  const container = createTag('div', { id: 'app', 'data-sling-props': JSON.stringify(slingProps) });
  block.append(container);
  observer.observe(block);
}
