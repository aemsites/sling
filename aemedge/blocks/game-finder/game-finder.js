import { createTag } from '../../scripts/utils.js';
import { loadScript } from '../../scripts/aem.js';

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
      const defultProps = {
        showFilter: false,
        filterOnlyFirstTwoPosition: false,
        showDetailsModal: false,
        agentView: false,
        packageFilterDefault: 'All Games',
        matchupImgFormat: 'png',
      };
      const config = await readBlockConfig(block);
      if (config.leagueList) {
        config.leagueList = config.leagueList.split(',');
      }
      if (config.numberOfDays) {
        config.numberOfDays = parseInt(config.numberOfDays, 10);
      }
      const slingProps = { ...config, ...defultProps };
      const container = createTag('div', { id: 'app', 'data-sling-props': JSON.stringify(slingProps) });
      block.append(container);
      loadScript('../../../aemedge/scripts/sling-react/gamefinder-build.js');
      observer.unobserve(block);
    }
  }, { threshold: 0 });
  observer.observe(block);
}
