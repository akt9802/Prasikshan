import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('❌ Redis Error:', err));
client.on('connect', () => console.log('✅ Redis connected'));

if (!client.isOpen) {
  client.connect();
}

export default client;
