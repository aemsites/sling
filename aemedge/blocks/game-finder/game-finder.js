import { createTag, readBlockConfig } from '../../scripts/utils.js';

export default async function decorate(block) {
  const defultProps = {
    showFilter: false,
    channelsLogoPath: '/aemedge/icons/channels/AllLOBLogos/color',
    modalChannelsLogoPath: '/aemedge/icons/application-assets/shared/web/logos/black',
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
  const container = createTag('div', { id: 'gmfinder-app', 'data-sling-props': JSON.stringify(slingProps) });
  block.append(container);
}
