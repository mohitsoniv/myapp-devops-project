// Basic Node.js/Express app with Datadog + Bugsnag hooks
// Start dd-trace early (no-op if DD_API_KEY is not set on agent side)
try {
  require('dd-trace').init({
    // these can be overridden by env vars
    logInjection: true,
    runtimeMetrics: false
  });
} catch (e) {
  console.warn('dd-trace init skipped:', e.message);
}

const express = require('express');
const morgan = require('morgan');
const Bugsnag = require('@bugsnag/js');

if (process.env.BUGSNAG_API_KEY) {
  Bugsnag.start({ apiKey: process.env.BUGSNAG_API_KEY });
  console.log('Bugsnag initialized');
} else {
  console.log('Bugsnag not initialized (no BUGSNAG_API_KEY set)');
}

const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Hello from myapp-devops-starter 🚀' });
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

// Endpoint that intentionally throws to test error tracking
app.get('/error', (_req, _res) => {
  throw new Error('Intentional test error for Bugsnag/Datadog');
});

// Error handler (Bugsnag will auto-capture unhandled exceptions if initialized)
app.use((err, _req, res, _next) => {
  console.error('Error handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
});
