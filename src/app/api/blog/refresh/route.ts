import { revalidateBlog } from '@/lib/blog-revalidate';
import { blogRefreshKey } from '@/lib/blog-startup';

// Called once by the server itself after start (see src/lib/blog-startup.ts).
export async function POST(request: Request) {
  const key = blogRefreshKey();
  if (!key || request.headers.get('x-refresh-key') !== key) return Response.json({ error: 'Not found.' }, { status: 404 });

  revalidateBlog();
  return new Response(null, { status: 204 });
}
