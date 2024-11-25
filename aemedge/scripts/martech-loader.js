import { getMetadata } from './aem.js';
/* eslint-disable no-underscore-dangle */
import {
  initMartech,
  updateUserConsent,
  martechEager,
  martechLazy,
  martechDelayed,
  // eslint-disable-next-line import/no-relative-packages, import/no-unresolved
} from '../plugins/martech/src/index.js';

const DEFAULT_ALLOY_CONFIG = {
  orgId: 'BC401D6765FB06150A495FF7@AdobeOrg',

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
  // The WebSDK config
  // Documentation: https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview#configure-js
  { ...DEFAULT_ALLOY_CONFIG, datastreamId: window.hlx?.alloyConfig?.profileEnabledDataStreamId },
  // The library config
  {
    personalization: getMetadata('target'),
  },
);

// Integrating OneTrsut consent management with the internal Adobe consent model
function consentEventHandler(ev) {
  const groups = ev.detail;
  const collect = groups.includes('C0002'); // Performance Cookies
  const personalize = groups.includes('C0003'); // Functional Cookies
  const share = groups.includes('C0008'); // Targeted Advertising and Selling/Sharing of Personal Information
  updateUserConsent({ collect, personalize, share });
}
window.addEventListener('consent.onetrust', consentEventHandler);
export {
  martechLoadedPromise,
  martechEager,
  martechLazy,
  martechDelayed,
};
