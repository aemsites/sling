/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import {
  initMartech,
  updateUserConsent,
  martechEager,
  martechLazy,
  martechDelayed,
  // eslint-disable-next-line import/no-relative-packages, import/no-unresolved
} from '../plugins/martech/src/index.js';

const martechLoadedPromise = initMartech(
  {
    datastreamId: 'b854d2aa-518d-4a36-9ff1-856c71d83ce2',
    orgId: '9425401053CD40810A490D4C@AdobeOrg',
    onBeforeEventSend: (payload) => {
      payload.data.__adobe.target ||= {};
      payload.data.__adobe.analytics ||= {};
    },
  },
  // The library config
  {
    analytics: true, // whether to track data in Adobe Analytics (AA)
    alloyInstanceName: 'alloy', // the name of the global WebSDK instance
    dataLayer: true, // whether to use the Adobe Client Data Layer (ACDL)
    dataLayerInstanceName: 'adobeDataLayer', // the name of the global ACDL instance
    includeDataLayerState: true, // whether to include the whole data layer state on every event sent
    launchUrls: ['https://assets.adobedtm.com/f4211b096882/1811238be96f/launch-088c475bb1c3-development.min.js'], // the list of Launch containers to load
    personalization: true, // whether to apply page personalization from Adobe Target (AT) or Adobe Journey Optimizer (AJO)
    performanceOptimized: true, // whether to use the agressive performance optimized approach or more traditional
    personalizationTimeout: 1000, // the amount of time to wait (in ms) before bailing out and continuing page rendering
  },
);

// Integrating OneTrsut consent management with the internal Adobe consent model
function consentEventHandler(ev) {
  const collect = ev.detail.categories.includes('CC_ANALYTICS');
  const marketing = ev.detail.categories.includes('CC_MARKETING');
  const personalize = ev.detail.categories.includes('CC_TARGETING');
  const share = ev.detail.categories.includes('CC_SHARING');
  // updateUserConsent({ collect, personalize, share });
  updateUserConsent({
    collect,
    personalize,
    marketing,
    share,
  });
}
window.addEventListener('consent', consentEventHandler);
export {
  martechLoadedPromise,
  martechEager,
  martechLazy,
  martechDelayed,
};
