/**
 * @see https://javascript.plainenglish.io/using-env-variables-and-autocomplete-with-node-js-and-typescript-46b5b4a769d8
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      APP_PORT: string;
      LEDGER_ID: string;
      LEDGER_URL: string;
      LEDGER_ORGANIZATION_ID: string;
      LEDGER_CLIENT_ID: string;
      LEDGER_SECRET_ID: string;
    }
  }
}
export {};
