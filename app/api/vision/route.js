// Reads text off a book-cover photo with Google Cloud Vision and reports how big
// each piece of text is, so the app can tell the title (biggest lettering) from
// review quotes and taglines (small print).

function wordText(word) {
  return (word.symbols || []).map((s) => s.text).join("");
}

// Height of a word's bounding box (works even if the photo is slightly rotated).
function wordHeight(word) {
  const v = word.boundingBox?.vertices || [];
  if (v.length < 4) return 0;
  const d = (a, b) => Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0));
  return (d(v[0], v[3]) + d(v[1], v[2])) / 2;
}

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
    const first = data?.responses?.[0];

    // Surface real Vision errors (API not enabled, billing, bad key...) instead of pretending the photo was blank.
    const apiError = data?.error?.message || first?.error?.message;
    if (!visionRes.ok || apiError) {
      return new Response(JSON.stringify({ error: `Vision API: ${apiError || visionRes.status}` }), { status: 502 });
    }

    const text = first?.fullTextAnnotation?.text || first?.textAnnotations?.[0]?.description || "";

    const paragraphs = [];
    for (const page of first?.fullTextAnnotation?.pages || []) {
      for (const block of page.blocks || []) {
        for (const para of block.paragraphs || []) {
          const words = para.words || [];
          const ptext = words.map(wordText).join(" ").trim();
          const heights = words.map(wordHeight).filter((h) => h > 0).sort((a, b) => a - b);
          const size = heights.length ? heights[Math.floor(heights.length / 2)] : 0; // median letter height
          const ys = (para.boundingBox?.vertices || []).map((v) => v.y || 0);
          const y = ys.length ? Math.min(...ys) : 0;
          if (ptext) paragraphs.push({ text: ptext, size: Math.round(size), y });
        }
      }
    }

    return new Response(JSON.stringify({ text, paragraphs }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
