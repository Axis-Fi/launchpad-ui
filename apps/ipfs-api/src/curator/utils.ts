const resolveTwitterShortUrl = async (url?: string) => {
  try {
    if (url == null) return null;

    const resolved = await fetch(url, { method: "HEAD", redirect: "follow" });

    return resolved.url;
  } catch (e) {
    console.error("Error resolving Twitter short URL:", e);
    return null;
  }
};

export { resolveTwitterShortUrl };
