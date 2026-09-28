import { Resource } from '@/constants/types';
import { getNumericID } from './fomatShopifyId';
import { ADMIN_LINK, ADMIN_RESOURCE_TITLES } from '@/constants/constants';

export const getShopifyLink = (
  domain: string,
  id: string | number,
  resource: Resource,
) => {
  const numericID = getNumericID(id);

  const shopifyLink = `${ADMIN_LINK}/${domain}/${ADMIN_RESOURCE_TITLES[resource]}/${numericID}`;

  return shopifyLink;
};
