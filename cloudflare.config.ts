import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "bazi-calculator",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-06",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      ASTRO_API_KEY: bindings.secret(),
      MISTRAL_API_KEY: bindings.secret(),
      IMAGES: bindings.images(),
    },
  }),
});
