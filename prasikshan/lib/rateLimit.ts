import { getRedis } from '@/lib/redis';
import { NextRequest } from 'next/server';

export async function checkRateLimit(req: NextRequest, email: string) {
  try {
    const redis = await getRedis();
    
    // Get IP in Next.js app directory
    let ip = req.headers.get('x-forwarded-for');
    if (ip) {
      ip = ip.split(',')[0].trim();
    } else {
      ip = req.headers.get('x-real-ip') || '127.0.0.1';
    }
    
    // 1. IP-Based Sliding Window Rate Limiting
    const ipKey = `rate_limit:ip:${ip}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    // Remove older timestamps
    await redis.zRemRangeByScore(ipKey, 0, now - windowMs);
    
    // Count remaining attempts in window
    const currentAttempts = await redis.zCard(ipKey);
    const maxIpAttempts = 10;
    
    if (currentAttempts >= maxIpAttempts) {
      return { 
        success: false, 
        message: 'Too many requests from this IP. Please try again after a minute.',
        status: 429
      };
    }
    
    // Log IP attempt with unique member string (timestamp + random string)
    const member = `${now}-${Math.random().toString(36).substring(2, 9)}`;
    await redis.zAdd(ipKey, [{ score: now, value: member }]);
    await redis.expire(ipKey, 60);

    // 2. Account-Based Lockout
    if (email) {
      const emailKey = `rate_limit:email:${email.toLowerCase()}`;
      const maxEmailAttempts = 5;
      
      const emailAttemptsStr = await redis.get(emailKey);
      const currentEmailAttempts = parseInt(emailAttemptsStr || '0', 10);
      
      if (currentEmailAttempts >= maxEmailAttempts) {
        return { 
          success: false, 
          message: 'Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes.',
          status: 429
        };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open if Redis is down, so legitimate users can still login
    return { success: true };
  }
}

export async function recordFailedLogin(email: string) {
  try {
    const redis = await getRedis();
    if (!email) return;

    const emailKey = `rate_limit:email:${email.toLowerCase()}`;
    const lockoutSeconds = 15 * 60; // 15 mins lock or tracking period
    
    const currentEmailAttempts = await redis.incr(emailKey);
    
    if (currentEmailAttempts >= 5) {
      // Lock account for 15 minutes when it hits 5
      await redis.expire(emailKey, lockoutSeconds);
    } else if (currentEmailAttempts === 1) {
      // Set initial expiration for the first failed attempt
      await redis.expire(emailKey, lockoutSeconds);
    }
  } catch (error) {
    console.error('Record failed login error:', error);
  }
}

export async function clearFailedLogin(email: string) {
  try {
    const redis = await getRedis();
    if (!email) return;
    
    const emailKey = `rate_limit:email:${email.toLowerCase()}`;
    await redis.del(emailKey);
  } catch (error) {
    console.error('Clear failed login error:', error);
  }
}
