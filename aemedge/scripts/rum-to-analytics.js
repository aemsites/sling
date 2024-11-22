import { initRumTracking, pushEventToDataLayer } from '@adobe/aem-martech/src/index.js';
import { sampleRUM } from './aem.js';

// Define RUM tracking function
const track = initRumTracking(sampleRUM, { withRumEnhancer: true });

// Track page views when the page is fully rendered
// The data will be automatically enriched with applied propositions for personalization use cases
track('lazy', () => {
  pushEventToDataLayer(
    'web.webpagedetails.pageViews',
    {
      web: {
        webPageDetails: {
          pageViews: { value: 1 },
          isHomePage: window.location.pathname === '/',
        },
      },
    },
    {
      __adobe: {
        analytics: {
          // see documentation at https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/data-var-mapping
        },
      },
    },
  );
});

track('click', ({ source, target }) => {
  pushEventToDataLayer('web.webinteraction.linkClicks', {
    web: {
      webInteraction: {
        URL: target,
        name: source,
        linkClicks: { value: 1 },
        type: target && new URL(target).origin !== window.location.origin
          ? 'exit'
          : 'other',
      },
    },
  });
});

// see documentation at https://www.aem.live/developer/rum#checkpoints for other events you can track
