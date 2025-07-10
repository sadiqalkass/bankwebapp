import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0c6b5a5f1f27ee6ccbd7349ac729b5f3@o4509633755807744.ingest.us.sentry.io/4509633761574912",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});