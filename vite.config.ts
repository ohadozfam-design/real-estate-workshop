import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import Stripe from "stripe";
import { buildLineItems } from "./server/lineItems";

/**
 * Dev-only middleware that mirrors the production /api/create-checkout-session
 * serverless function, so `npm run dev` can create real (test-mode) Checkout
 * sessions. The secret key is read on the server and never exposed to the client.
 */
function stripeCheckoutApi(secretKey: string | undefined): Plugin {
  return {
    name: "stripe-checkout-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || req.url.split("?")[0] !== "/api/create-checkout-session") {
          return next();
        }

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (req.method !== "POST") return send(405, { error: "Method Not Allowed" });
        if (!secretKey) {
          return send(500, {
            error: "Stripe is not configured (STRIPE_SECRET_KEY missing in .env).",
          });
        }

        try {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          const { hasOrderBump, name = "", phone = "", email = "" } = raw ? JSON.parse(raw) : {};
          const origin = (req.headers.origin as string) || "http://localhost:5173";

          const stripe = new Stripe(secretKey);
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: buildLineItems(Boolean(hasOrderBump)),
            ...(email ? { customer_email: String(email).trim() } : {}),
            metadata: {
              name: String(name).trim(),
              phone: String(phone).trim(),
              email: String(email).trim(),
            },
            success_url: `${origin}/?checkout=success`,
            cancel_url: `${origin}/?checkout=cancel`,
          });

          send(200, { url: session.url });
        } catch (err) {
          send(500, { error: err instanceof Error ? err.message : "Checkout failed" });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all env vars (empty prefix) so the server can read STRIPE_SECRET_KEY.
  // Only VITE_* vars are ever exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), stripeCheckoutApi(env.STRIPE_SECRET_KEY)],
  };
});
