// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
// const loadScript = async (url, attrs) => {
//  const head = document.querySelector('head');
//  const script = document.createElement('script');
//  script.src = url;
//  if (attrs) {
//    // eslint-disable-next-line no-restricted-syntax, guard-for-in
//    for (const attr in attrs) {
//      script.setAttribute(attr, attrs[attr]);
//    }
//  }
//  head.append(script);
//  return script;
// };
// await loadScript('/aemedge/scripts/sling-martech/analytics-lib.js');

// if (window.location.host.startsWith('localhost')) {
//  await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-b69ac51c7dcd-development.min.js');
// } else if (window.location.host.startsWith('www.sling.com') || window.location.host.endsWith('.live')) {
//  await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-c846c0e0cbc6.min.js');
// } else if (window.location.host.endsWith('.page')) {
//  await loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-6367a8aeb307-staging.min.js');
// }
