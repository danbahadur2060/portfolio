/// <reference types="vite/client" />

// Provide minimal process.env typing for client-side code that accesses
// environment variables (avoid adding @types/node just for this).
// Vite exposes client env vars via import.meta.env but some files still
// read process.env — this declaration prevents TS errors during build.

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_BACKEND_URL?: string;
    NODE_ENV?: "development" | "production" | "test";
    VERCEL?: "1";
    VERCEL_URL?: string;
    [key: string]: string | undefined;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
