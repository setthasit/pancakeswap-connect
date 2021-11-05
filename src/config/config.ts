// import dotenv so env variables load before the app start
import 'dotenv/config';

export const configuration = {
  app: {
    port: process.env.APP_PORT || 8888,
  },
  pancakeswap: {
    httpProvider: process.env.WEB3_HTTP_PROVIDER_URL,
    masterchefAddress: process.env.MASTERCHEF_ADDRESS,
  },
};
