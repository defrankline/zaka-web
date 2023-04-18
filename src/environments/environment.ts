import {config} from './config';

export const environment = {
  production: true,
  api: config.server + '/api/v1',
  page: 0,
  size: 5,
  maxSize: 5,
  perPageOptions: [5, 20, 25, 50, 100, 200]
};
