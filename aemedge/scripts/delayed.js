// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

// Core Web Vitals RUM collection
sampleRUM('cwv');

// adding launch.js to all but prod so as not to interfere with prod statistics
// if they need it, uncomment it after go live.

if (window.location.host.startsWith('localhost')) {
  // loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-b69ac51c7dcd-development.min.js');
} else if (window.location.host.startsWith('www.sling.com') || window.location.host.endsWith('.live')) {
  loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-c846c0e0cbc6.min.js');
} else if (window.location.host.endsWith('.page')) {
  loadScript('https://assets.adobedtm.com/f4211b096882/26f71ad376c4/launch-6367a8aeb307-staging.min.js');
}

const showBlocks = ({ detail: payload }) => {
  console.log('a custom event happened', payload);
  const blocks = document.querySelectorAll('div.block');

  blocks.forEach((block) => {
    block.classList.toggle('highlight');
    let blockName = block.parentElement.querySelector('.blockname');
    if (!blockName) blockName = document.createElement('span');
    if (block.classList.contains('highlight')) {
      blockName.classList.add('blockname');
      // eslint-disable-next-line prefer-destructuring
      blockName.innerText = block.className.split(' ')[0];
      blockName.classList.toggle('show');
      block.parentElement.prepend(blockName);
    } else {
      blockName.remove();
    }
  });

  const sections = document.querySelectorAll('div.section');
  sections.forEach((section) => section.classList.toggle('highlight'));
};

const sk = document.querySelector('helix-sidekick');
if (sk) {
  // sidekick already loaded
  sk.addEventListener('custom:showblocks', showBlocks);
} else {
  // wait for sidekick to be loaded
  document.addEventListener('sidekick-ready', () => {
    // sidekick now loaded
    document.querySelector('helix-sidekick')
      .addEventListener('custom:showblocks', showBlocks);
  }, { once: true });
}
