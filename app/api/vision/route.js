export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.image) {
    return new Response(JSON.stringify({ error: "missing image" }), { status: 400 });
  }
  const key = process.env.GOOGLE_VISION_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "Vision API key not configured" }), { status: 500 });
  }
  try {
    const visionRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: body.image },
            features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      }),
    });
    const data = await visionRes.json();
    const text =
      data?.responses?.[0]?.fullTextAnnotation?.text ||
      data?.responses?.[0]?.textAnnotations?.[0]?.description ||
      "";
    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
