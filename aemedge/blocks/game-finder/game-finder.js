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
    document.querySelector('.game-finder.block').append(script);
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

function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const name = toPropName(cols[0].textContent);
        const value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

export default async function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      const defultProps = {
        showFilter: false,
        filterOnlyFirstTwoPosition: false,
        showDetailsModal: false,
        agentView: false,
        packageFilterDefault: 'All Games',
        matchupImgFormat: 'png',
      };
      const config = readBlockConfig(block);
      if (config.leagueList) {
        config.leagueList = config.leagueList.split(',');
      }
      if (config.numberOfDays) {
        config.numberOfDays = parseInt(config.numberOfDays, 10);
      }
      const slingProps = { ...config, ...defultProps };
      const container = createTag('div', { id: 'app', 'data-sling-props': JSON.stringify(slingProps) });
      block.append(container);
      loadScript('../../../aemedge/scripts/sling-react/bundle.js');
    }
  }, { threshold: 0 });
  observer.observe(block);
}
