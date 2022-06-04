const SERVER = 'https://mwengeparish.co.tz:8080';
/*const SERVER = 'http://localhost:8080';*/
export const ApiConfig = {
  server: SERVER,
  url: SERVER + '/api/v1',
  page: 0,
  size: 10,
  perPageOptions: [10, 25, 50, 100, 200, 250, 400, 500, 1000, 2000, 2500, 5000, 10000],
  crudActions: [
    {label: 'Edit', action: 'form', icon: 'edit', color: 'primary'},
    {label: 'Delete', action: 'delete', icon: 'delete', color: 'accent'},
  ],
  headerActions: [
    {label: 'Create', action: 'form', icon: 'add', color: 'primary'},
  ],
  dialogActions: [{label: 'Close', action: 'close', icon: 'close', color: 'warn'}]
};
