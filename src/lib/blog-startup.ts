import { randomUUID } from 'node:crypto';
import { readStoredPosts } from './blog-store';

// The page cache lives inside the container, so a deploy or a restart brings back the pages
// as they were built, without the posts in the data volume. Right after start the server
// calls its own refresh route once to mark the post lists stale. The key exists only in
// this process's memory, so nobody outside can trigger the route.
type StartupGlobal = typeof globalThis & { __blogRefreshKey?: string };

export function blogRefreshKey() {
  return (globalThis as StartupGlobal).__blogRefreshKey;
}

export async function scheduleBlogRefresh() {
  if ((await readStoredPosts()).length === 0) return;

  const key = randomUUID();
  (globalThis as StartupGlobal).__blogRefreshKey = key;
  const url = `http://127.0.0.1:${process.env.PORT || 3000}/api/blog/refresh`;

  for (let attempt = 1; attempt <= 15; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'x-refresh-key': key } });
      if (response.ok) return;
    } catch {
      // The server isn't listening yet.
    }
  }
  console.error('Blog: could not refresh the post lists after start.');
}
