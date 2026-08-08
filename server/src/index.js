import 'dotenv/config';
import dns from 'node:dns';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const PORT = process.env.PORT || 3001;

await connectDB();

const app = createApp();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
