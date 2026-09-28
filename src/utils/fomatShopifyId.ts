import { GLOBAL_TEMPLATE, GID_RESOURCE_TITLES } from '@/constants/constants';
import { Resource } from '@/constants/types';

export const getGID = (id: string | number, resource: Resource) => {
  if (typeof id === 'number' && !id.toString().startsWith('gid')) {
    return (
      GLOBAL_TEMPLATE + GID_RESOURCE_TITLES[resource] + '/' + id.toString()
    );
  }

  return id.toString();
};

export const getNumericID = (id: string | number) => {
  if (typeof id !== 'number' && id.toString().startsWith('gid')) {
    return id.split('/').pop();
  }

  return id;
};
