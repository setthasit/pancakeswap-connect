declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // APP
      APP_PORT: number;
      // Pancakeswap
      WEB3_HTTP_PROVIDER_URL: string;
      MASTERCHEF_ADDRESS: string;
    }
  }
}

export {};
