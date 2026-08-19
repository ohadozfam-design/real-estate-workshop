/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** Fallback Stripe Payment Link for the base workshop ticket ($97). */
  readonly VITE_STRIPE_PAYMENT_URL_BASE?: string;
  /** Fallback Stripe Payment Link for ticket + order bump ($124). */
  readonly VITE_STRIPE_PAYMENT_URL_BUMP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
