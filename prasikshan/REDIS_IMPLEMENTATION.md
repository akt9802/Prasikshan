# Redis Implementation — Prasikshan

MongoDB stays as-is. Redis is added **on top** only for refresh token storage.

---

## What Changes

| File | Change |
|---|---|
| `lib/redis.ts` | New file — Redis client |
| `app/api/auth/signin/route.ts` | Save refresh token to Redis (not MongoDB) |
| `app/api/auth/refresh-token/route.ts` | Read/write refresh token from Redis (not MongoDB) |
| `app/api/auth/logout/route.ts` | Delete refresh token from Redis (not MongoDB) |

MongoDB still handles: users, questions, tests, rankings — everything else.

---

## Step 1 — Install Redis Client

```bash
npm install redis
```

---

## Step 2 — Add to `.env`

```env
REDIS_URL=redis://localhost:6379
```

---

## Step 3 — Run Redis Locally

### Option A: Docker (Recommended)
```bash
docker run -d --name prasikshan-redis -p 6379:6379 redis:alpine
```

Stop it:
```bash
docker stop prasikshan-redis
```

Start again:
```bash
docker start prasikshan-redis
```

### Option B: Homebrew (Mac)
```bash
brew install redis
brew services start redis
```

Stop it:
```bash
brew services stop redis
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

---

## Step 4 — Create `lib/redis.ts`

```ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Error:', err));

if (!client.isOpen) {
  client.connect();
}

export default client;
```

---

## Step 5 — Update `signin/route.ts`

Remove:
```ts
await User.findByIdAndUpdate(
  existingUser._id,
  { $set: { refreshToken: refreshToken } },
  { strict: false }
);
```

Add:
```ts
import redis from '@/lib/redis';

await redis.setEx(
  `refreshToken:${existingUser._id.toString()}`,
  7 * 24 * 60 * 60, // 7 days
  refreshToken
);
```

---

## Step 6 — Update `refresh-token/route.ts`

Remove:
```ts
const user = await User.findById(decoded.userId).select('+refreshToken');

if (user.refreshToken !== refreshToken) {
  await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: "" } }, { strict: false });
  return NextResponse.json({ success: false, message: 'Refresh token reuse detected.' }, { status: 403 });
}

await User.findByIdAndUpdate(user._id, { $set: { refreshToken: newRefreshToken } }, { strict: false });
```

Add:
```ts
import redis from '@/lib/redis';

const stored = await redis.get(`refreshToken:${decoded.userId}`);

if (!stored || stored !== refreshToken) {
  await redis.del(`refreshToken:${decoded.userId}`);
  return NextResponse.json({ success: false, message: 'Refresh token reuse detected.' }, { status: 403 });
}

// Still fetch user from MongoDB for email/username (needed for new access token payload)
const user = await User.findById(decoded.userId).select('email username');

await redis.setEx(
  `refreshToken:${decoded.userId}`,
  7 * 24 * 60 * 60,
  newRefreshToken
);
```

---

## Step 7 — Update `logout/route.ts`

Remove:
```ts
await connectDB();
await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
```

Add:
```ts
import redis from '@/lib/redis';

await redis.del(`refreshToken:${decoded.userId}`);
```

---

## What Redis Stores

```
Key                          Value            TTL
─────────────────────────────────────────────────────
refreshToken:userId123   →  eyJhbGci...      7 days (auto-deleted)
refreshToken:userId456   →  eyJhbGci...      5 days (auto-deleted)
```

Tokens auto-delete after 7 days of inactivity. No cleanup needed.

---

## Production (Upstash — Free Redis Cloud)

For deployment, use [Upstash](https://upstash.com) (free tier, no server needed):

1. Create account at upstash.com
2. Create a Redis database
3. Copy the `REDIS_URL` they give you
4. Add to your production `.env`:

```env
REDIS_URL=rediss://default:password@your-endpoint.upstash.io:6379
```

No other code changes needed.
