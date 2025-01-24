import { createTag } from '../../scripts/utils.js';

async function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    script.onload = resolve;
    script.onerror = reject;
    document.querySelector('.chat.block').append(script);
  });
}

function toPropName(name) {
  return typeof name === 'string'
    ? name
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

async function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div:not([id])').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toPropName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

export default async function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      const config = await readBlockConfig(block);
      const slingProps = {
        chatId: `${config.chatId}` || 'chat-bot-help',
        env: 'prod',
        appId: `${config.appId}` || '80ce3ed3-5387-498a-bea3-e000f1e33371',
        hideChat: false,
        displayNextToFeedback: false,
        autoLaunch: false,
        enableBorderColor: false,
      };

      // const container = createTag('div');
      const container = createTag('div', { 'data-sling-props': JSON.stringify(slingProps), id: 'chat-app' });
      block.append(container);
      loadScript('../../../aemedge/scripts/sling-react/chat-build.js');
    }
  }, { threshold: 0 });
  observer.observe(block);
}
