// Small wrapper so the rest of the app can keep calling storage.get/set
// exactly like it did with Claude's built-in artifact storage.
export const storage = {
  async get(key) {
    const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (res.status === 404) {
      throw new Error("not_found");
    }
    if (!res.ok) {
      throw new Error("storage_error");
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
