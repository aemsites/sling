import { fetchPlaceholders, readBlockConfig } from '../../scripts/aem.js';
import { GQL_QUERIES, fetchGQL } from '../../scripts/gql-utils.js';

export default async function decorate(block) {
  window.zipCode = '90210';
  const blockConfig = await readBlockConfig(block);
  const placeholders = await fetchPlaceholders();
  const planIdentifier = blockConfig['plan-identifier'] || placeholders.planIdentifier || 'one-month';
  const planOfferIdentifier = blockConfig['plan-offer-identifier'] || placeholders.planOfferIdentifier || 'extra-stair-step-2';
  const packageType = blockConfig['package-type'] || placeholders.packageType || 'base_linear';
  const isChannelRequired = blockConfig['is-channel-required'] || placeholders.isChannelRequired || 'true';
  const tagIn = blockConfig['tag-in'] || placeholders.tagIn || 'us';
  const zipCode = window.zipCode || placeholders.defaultZipCode;
  block.innerHTML = '';
  const planOfferJson = await fetchGQL(
    GQL_QUERIES.getPackage.query,
    GQL_QUERIES.getPackage.variables(
      packageType,
      isChannelRequired,
      tagIn,
      zipCode,
      planOfferIdentifier,
      planIdentifier,
    ),
    GQL_QUERIES.getPackage.operationName,
  );
  console.log(planOfferJson);
}
