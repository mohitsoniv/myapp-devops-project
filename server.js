// Initialize Datadog APM (no-op if Agent not reachable)
try {
  require('dd-trace').init({
    logInjection: true
  });
  console.log('Datadog tracing initialized');
} catch (e) {
  console.warn('dd-trace init skipped:', e && e.message);
}

const express = require('express');
const morgan = require('morgan');
const Bugsnag = require('@bugsnag/js');

// Initialize Bugsnag if API key provided
const BUGSNAG_API_KEY = process.env.BUGSNAG_API_KEY;
if (BUGSNAG_API_KEY) {
  Bugsnag.start({ apiKey: BUGSNAG_API_KEY });
  console.log('Bugsnag initialized');
} else {
  console.log('Bugsnag not initialized (no BUGSNAG_API_KEY set)');
}

const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Hello from CI/CD DevOps Starter App with Datadog & Bugsnag!' });
});

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Intentionally throw for error tracking demo
app.get('/error', (_req, _res) => {
  throw new Error('Intentional test error for Bugsnag/Datadog');
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Error handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
});
