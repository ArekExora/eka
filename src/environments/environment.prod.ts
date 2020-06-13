const port = 4000;

export const environment = {
  production: true,
  port,
  apiUrl: `http://localhost:${port}/api`,
  cacheTime: '1y'
};
