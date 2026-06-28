import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const owner = searchParams.get('owner') || 'Nitheesh0217';

  if (!repo) {
    return new Response('Missing repo parameter', { status: 400 });
  }

  try {
    const url = `https://github.com/${owner}/${repo}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return new Response(`Failed to fetch from GitHub: ${res.statusText}`, { status: res.status });
    }

    let html = await res.text();

    // Inject <base href="https://github.com/"> right after <head> to fix all relative assets
    // so stylesheets, scripts, and images load correctly from GitHub.
    html = html.replace('<head>', '<head><base href="https://github.com/">');

    // Return the HTML with framing allowed
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
