
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    SERVICE: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_ADDRESS: string;
    EMAIL_PASSWORD: string;
    JWT_LIFETIME: string;
    CLIENT_URL: string;
  }
}
