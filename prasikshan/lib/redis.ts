import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Global cache to reuse connection across hot reloads (Next.js dev mode)
const globalForRedis = global as unknown as {
  redisClient: ReturnType<typeof createClient> | undefined;
  redisConnectPromise: Promise<void> | undefined;
};

function createRedisClient() {
  const client = createClient({ url: REDIS_URL });
  client.on('error', (err) => console.error('❌ Redis Error:', err));
  client.on('connect', () => console.log('✅ Redis connected'));
  return client;
}

// Get a connected Redis client — always awaited before use
export async function getRedis() {
  if (!globalForRedis.redisClient) {
    globalForRedis.redisClient = createRedisClient();
  }

  const client = globalForRedis.redisClient;

  if (!client.isOpen) {
    if (!globalForRedis.redisConnectPromise) {
      globalForRedis.redisConnectPromise = client.connect().then(() => {
        globalForRedis.redisConnectPromise = undefined;
      }).catch((err) => {
        globalForRedis.redisConnectPromise = undefined;
        throw err;
      });
    }
    await globalForRedis.redisConnectPromise;
  }

  return client;
}
