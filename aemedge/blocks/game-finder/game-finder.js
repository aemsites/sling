import {
  loadScript,
  loadCSS,
} from '../../scripts/aem.js';

// async function loadReactLib(src, attrs) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script');
//     script.src = src;
//     if (attrs) {
//       // eslint-disable-next-line no-restricted-syntax, guard-for-in
//       for (const attr in attrs) {
//         script.setAttribute(attr, attrs[attr]);
//       }
//     }
//     script.onload = resolve;
//     script.onerror = reject;
//     document.querySelector('.game-finder.block').append(script);
//   });
// }

export default async function decorate(block) {
  block.innerHTML = '<div class="js-react js-react-gamefinder"></div>';
  // // window.slingUtils.apollo = apolloClientConfig;
  // // await loadReactLib('../../../aemedge/scripts/reactlibs/apolloClientConfig.js');
  // await loadReactLib('../../../aemedge/scripts/reactlibs/utils.js');

  // await loadReactLib('../../../aemedge/scripts/reactlibs/launch-utils.js');
  // await loadReactLib('../../../aemedge/scripts/reactlibs/gamefinder-react.js');

  // // await loadReactLib('https://www.sling.com/etc.clientlibs/sling-tv/clientlibs/reactlibs/utils.min.34a064826b6e68471391de72a19a262f.js');
  // // await loadReactLib('https://www.sling.com/etc.clientlibs/sling-tv/clientlibs/main.min.bb5232ec39d28034ed21652b78c0a156.js');

  // // await loadReactLib('https://www.sling.com/etc.clientlibs/sling-tv/clientlibs/reactlibs/gamefinder-adobe-commerce.34a064826b6e68471391de72a19a262f.js');
  // loadScript('../../../aemedge/scripts/preact/index-BBtLxv_Q.js');
  // loadCSS('../../../aemedge/scripts/preact/index-CLfp0uDy.css');
  // block.innerHTML = '<div id="app"></div>';

  loadScript('../../../aemedge/scripts/preact/index-DybPTDOv.js');
}
