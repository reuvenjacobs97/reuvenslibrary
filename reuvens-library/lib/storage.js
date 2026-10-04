// Small wrapper so the rest of the app can keep calling storage.get/set
// exactly like it did with Claude's built-in artifact storage.
//
// IMPORTANT: get() throws an Error whose .message is exactly "not_found"
// when the key has genuinely never been set (safe to seed fresh data),
// and anything else for a real failure (network error, 500, timeout —
// never safe to treat as "empty" and overwrite).
export const storage = {
  async get(key) {
    const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (res.status === 404) {
      throw new Error("not_found");
    }
    if (!res.ok) {
      throw new Error(`storage_error_${res.status}`);
    }
    const data = await res.json();
    return { key, value: data.value };
  },

  async set(key, value) {
    const res = await fetch("/api/kv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { key, value: data.value };
  },
};
