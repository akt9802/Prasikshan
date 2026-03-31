# Redis-Backed Dual-Layer Rate Limiting

## Overview
This document explains the implementation and effects of a **Dual-Layer Rate Limiter** using Redis to protect authentication endpoints (e.g., login) from both targeted and distributed brute-force attacks.

A dual-layer approach is the industry standard for secure applications. It combines:
1. **IP-Based Sliding Window:** Blocks repetitive, rapid requests from the same machine (e.g., max 10 attempts per minute per IP).
2. **Account-Based Lockout (Email):** Protects a specific user account from distributed attacks (botnets) by locking the email after too many failed attempts originating from *any* IP (e.g., max 5 failed attempts per 15 minutes per email).

## How to Implement This

### 1. IP-Based Sliding Window Rate Limiting (Using Redis Sorted Sets)
We use the Redis **Sorted Set (`ZSET`)** to keep a continuous, rolling measure of requests for each IP address.

1. **Construct the Key:** Use the client's IP to form a unique Redis key (e.g., `rate_limit:ip:<IP_ADDRESS>`).
2. **Check & Clean:** Whenever a new request arrives, run `ZREMRANGEBYSCORE` to remove all timestamps older than 60 seconds.
3. **Count & Limit:** Use `ZCARD` to count remaining timestamps. If it's `>= 10`, immediately return `429 Too Many Requests`. If it's `< 10`, allow the request, add the new timestamp with `ZADD`, and update the TTL (`EXPIRE`) to 60 seconds.

### 2. Account-Based Lockout (Using Redis Counter & TTL)
We use a simple Redis **String with `INCR`** to track failed login attempts for a specific email address.

1. **Construct the Key:** Use the requested email to form a unique Redis key (e.g., `rate_limit:email:<EMAIL>`).
2. **Check Lockout (Pre-Login Check):** Before verifying the password against the database, check if the email key exists and its value is `>= 5`. If so, abort the request and return `429 Too Many Requests` (e.g., "Account temporarily locked due to multiple failed attempts.").
3. **Increment on Failure:** If the password verification fails (the `bcrypt` check fails), use `INCR` to increase the counter for that email. If it hits `5`, set the `EXPIRE` time to 15 minutes.
4. **Reset on Success:** If the user logs in successfully, delete the key (`DEL`) so their failed attempt counter drops back to zero.

### 3. Integration into the Auth Endpoint
- Run the **IP-based check** at the very top of your `/api/auth/login` handler. This stops naive flood scripts immediately before *any* database queries occur.
- Run the **Account-based check** right before executing the computationally expensive `bcrypt.compare()` step. Record failures (`INCR`) or clear the tracker (`DEL`) based on the password verification result.

## Effects of Implementation

### Technical & Security Benefits
1. **Comprehensive Brute-Force Prevention:** 
   - **IP Limiting** stops "loud" attacks from a single script or machine.
   - **Account Limiting** stops "quiet" distributed attacks where an attacker uses thousands of completely different IP addresses to slowly guess a single user's password.
2. **CPU & Database Protection:** Hashing algorithms (`bcrypt`) burn CPU intentionally. Blocking malicious bursts before hashing protects your server from slowing down or crashing during an attack.
3. **Distributed Accuracy:** Because Redis is an external datastore, rate limits and account lockouts instantly sync across all your load-balanced server instances.

### Resume / Career Impact
This makes for an elite backend engineering bullet point: 
> *"Implemented dual-layer Redis rate limiting (Sliding Window IP tracking & Account Lockout) to prevent distributed brute-force attacks and protect DB/CPU resources."*

**Why Interviewers Love It:**
- Demonstrates **Defense-in-Depth**, showing that you anticipate complex edge cases (like botnets bypassing basic IP filters).
- Proves you know when to use advanced Redis structures (**ZSET** for sliding windows) vs. simple structures (**Strings/INCR** for counters/lockouts).
- Highlights that you optimize system performance by catching the bad traffic *before* it hits expensive database calls or CPU operations.
