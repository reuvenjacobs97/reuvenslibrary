import { Redis } from "@upstash/redis";

// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env vars.
// These are set automatically if you connect the Upstash integration in
// the Vercel dashboard (see README.md).
const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 400 });
  }

  const value = await redis.get(key);
  if (value === null || value === undefined) {
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ key, value }), { status: 200 });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 400 });
  }
  await redis.set(body.key, body.value);
  return new Response(JSON.stringify({ key: body.key, value: body.value }), { status: 200 });
}
