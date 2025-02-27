// eslint-disable-next-line import/no-cycle

import { loadScript, getMetadata } from './aem.js';

const isTarget = getMetadata('target');
if (!isTarget) {
  await loadScript('/aemedge/scripts/sling-martech/analytics-lib.js');
  if (window.location.host.startsWith('localhost')) {
    await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-b69ac51c7dcd-development.min.js');
  } else if (window.location.host.startsWith('www.sling.com') || window.location.host.endsWith('.live')) {
    await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-c846c0e0cbc6.min.js');
  } else if (window.location.host.endsWith('.page')) {
    await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-6367a8aeb307-staging.min.js');
  }
}
