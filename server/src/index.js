import 'dotenv/config';
import dns from 'node:dns';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

// Local dev workaround for an IPv4-only network's failure to resolve the
// mongodb+srv:// DNS SRV record. Skipped in production: overriding DNS to
// public resolvers has been observed to break SRV resolution inside
// Render's own network instead of fixing it.
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    dns.setDefaultResultOrder('ipv4first');
  } catch (err) {
    console.warn('Could not override DNS servers:', err.message);
  }
}

const PORT = process.env.PORT || 3001;

// Bind the port immediately instead of awaiting the DB connection first: if
// Mongo is slow, unreachable, or blocked (e.g. Atlas Network Access not yet
// covering this host), the whole API - including /api/health - must not
// stay completely unreachable while that resolves. connectDB() logs its own
// success/failure; dbStatus() reflects the live connection state.
const app = createApp();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB();
