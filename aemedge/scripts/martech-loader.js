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

const isConsentGiven = updateUserConsent({
  collect: true,
  marketing: {
    preferred: 'email',
    any: false,
    email: true,
    push: false,
    sms: true,
  },
  personalize: true,
  share: true,
});

const DEFAULT_ALLOY_CONFIG = {
  orgId: '9425401053CD40810A490D4C@AdobeOrg',

  // FIXME: remove this once OneTrust is implemented
  defaultConsent: 'in',

  onBeforeEventSend: (payload) => {
    // ACDL is initialized in the lazy phase, so fetching from the JS array as a fallback during
    // the eager phase
    const dlState = window.adobeDataLayer.getState
      ? window.adobeDataLayer.getState()
      : window.adobeDataLayer[0];

    payload.xdm = {
      ...payload.xdm,
      ...dlState,
    };
    if (payload.xdm.eventType === 'decisioning.propositionFetch'
        && dlState._maruti.carInfo !== undefined
        && dlState._maruti.carInfo.model !== undefined
        && !Object.keys(payload.data.__adobe.target).length) {
      payload.data.__adobe.target['user.categoryId'] = dlState._maruti.carInfo.model;
    }
  },
  edgeConfigOverrides: {
  },
};

const martechLoadedPromise = initMartech(
  { ...DEFAULT_ALLOY_CONFIG, datastreamId: 'b854d2aa-518d-4a36-9ff1-856c71d83ce2' },
  // The library config
  {
    analytics: true, // whether to track data in Adobe Analytics (AA)
    alloyInstanceName: 'alloy', // the name of the global WebSDK instance
    dataLayer: true, // whether to use the Adobe Client Data Layer (ACDL)
    dataLayerInstanceName: 'adobeDataLayer', // the name of the global ACDL instance
    includeDataLayerState: true, // whether to include the whole data layer state on every event sent
    launchUrls: ['https://assets.adobedtm.com/f4211b096882/1811238be96f/launch-088c475bb1c3-development.min.js'], // the list of Launch containers to load
    personalization: true && isConsentGiven, // whether to apply page personalization from Adobe Target (AT) or Adobe Journey Optimizer (AJO)
    performanceOptimized: true, // whether to use the agressive performance optimized approach or more traditional
    personalizationTimeout: 1000, // the amount of time to wait (in ms) before bailing out and continuing page rendering
  },
);

// Integrating OneTrsut consent management with the internal Adobe consent model
function consentEventHandler(ev) {
  const collect = ev.detail.categories.includes('CC_ANALYTICS') || true;
  const marketing = ev.detail.categories.includes('CC_MARKETING') || true;
  const personalize = ev.detail.categories.includes('CC_TARGETING') || true;
  const share = ev.detail.categories.includes('CC_SHARING') || true;
  updateUserConsent({
    collect, marketing, personalize, share,
  });
}
window.addEventListener('consent', consentEventHandler);
export {
  martechLoadedPromise,
  martechEager,
  martechLazy,
  martechDelayed,
};
