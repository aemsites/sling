export const GRAPHQL_ENDPOINT = 'https://www.slingcommerce.com/graphql';

export const GQL_QUERIES = {
  zipcodeAddressVerificationV2: {
    operationName: 'zipcodeAddressVerificationV2',
    query: `
      query zipcodeAddressVerificationV2($zipcode: String!) {
        zipcodeAddressVerificationV2(zipcode: $zipcode) {
          zipcode_matched
          zipcode
          dma
          latitude
          longitude
          city
          state
          __typename
        }
      }
    `,
    variables: (zipCode) => `{"zipcode":"${zipCode}"}`,
  },
  packagesPerZipCode: {
    operationName: 'packagesPerZipCode',
    query: `
      query packagesPerZipcode($zipcode: String!) {
        packagesPerZipcode(zipcode: $zipcode) {
          id
          identifier
          name
          guid
          sku
          package_type
          csr_required
          amount
          description
          migrated_to
          enabled
          priority
          __typename
        }
      }
    `,
    variables: (zipCode) => `{"zipcode":"${zipCode}"}`,
  },
  getPackage: {
    operationName: 'getPackage',
    query: `
      query GetPackage($filter: PackageAttributeFilterInput) {
        packages(filter: $filter) {
          items {
            plan {
              plan_code
              plan_identifier
              plan_name
              __typename
            }
            planOffer {
              plan_offer_identifier
              discount
              discount_type
              plan_offer_name
              offer_identifier
              description
              __typename
            }
            package {
              name
              base_price
              sku
              channels {
                identifier
                call_sign
                name
                __typename
              }
              plan_offer_price
              canonical_identifier
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `,
    variables: (packageType, isChannelRequired, tagIn, zipCode, planOfferIdentifier, planIdentifier) => `{"filter":{"pck_type":{"in":["${packageType}"]},"is_channel_required":{"eq":${isChannelRequired}},"tag":{"in":["${tagIn}"]},"zipcode":{"eq":"${zipCode}"},"plan_offer_identifier":{"eq":"${planOfferIdentifier}"},"plan_identifier":{"eq":"${planIdentifier}"}}}`,
  },
};

export function cleanGQLParam(param) {
  return param.replace(/\s+/g, ' ').trim();
}

/** Make GraphQL query to fetch data */
/**
 * Fetches data from the GraphQL endpoint
 * @param {*} query GraphQL Query
 * @returns JSON response from the GraphQL endpoint
 */
export async function fetchGQL(query, variables, operationName) {
  if (!query || !variables || !operationName) return null;
  const params = new URLSearchParams({
    query: cleanGQLParam(query),
    variables: cleanGQLParam(variables),
    operationName: cleanGQLParam(operationName),
  });
  const res = await fetch(`${GRAPHQL_ENDPOINT}?${params}`);
  const gqlResponse = await res.json();
  return gqlResponse;
}
