import { Redis } from "@upstash/redis";

// Vercel's Upstash integration has used a couple of different env var
// naming conventions over time — check both so this works regardless
// of which one your project ended up with.
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Redis credentials not found. Check that a Redis database is connected to this project in Vercel's Storage tab."
    );
  }
  return new Redis({ url, token });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 400 });
  }

  try {
    const redis = getRedis();
    const value = await redis.get(key);
    if (value === null || value === undefined) {
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ key, value }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 400 });
  }
  try {
    const redis = getRedis();
    await redis.set(body.key, body.value);
    return new Response(JSON.stringify({ key: body.key, value: body.value }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
