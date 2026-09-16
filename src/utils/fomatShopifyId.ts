type Resource = 'user' | 'order';

const globalTemplate = 'gid://shopify/';
const resourceTitles = {
  user: 'Customer',
  order: 'Order',
};

export const getGID = (id: string | number, resource: Resource) => {
  if (typeof id === 'number' && !id.toString().startsWith('gid')) {
    return globalTemplate + resourceTitles[resource] + '/' + id.toString();
  }

  return id.toString();
};
