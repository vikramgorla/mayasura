import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug } from '@/lib/db';
import { Brand } from '@/lib/types';

// Returns a JavaScript snippet that creates an embeddable chatbot widget
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug) as Brand | undefined;

  if (!brand) {
    return new NextResponse('// Brand not found', {
      status: 404,
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const origin = request.nextUrl.origin;

  const widgetScript = `
(function() {
  if (window.__mayasura_widget_loaded) return;
  window.__mayasura_widget_loaded = true;

  var slug = ${JSON.stringify(slug)};
  var brandName = ${JSON.stringify(brand.name)};
  var accentColor = ${JSON.stringify(brand.accent_color)};
  var primaryColor = ${JSON.stringify(brand.primary_color)};
  var origin = ${JSON.stringify(origin)};

  // Create floating button
  var btn = document.createElement('div');
  btn.id = 'mayasura-chat-btn';
  btn.innerHTML = '💬';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:' + accentColor + ';color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:24px;box-shadow:0 4px 24px rgba(0,0,0,0.2);z-index:99999;transition:transform 0.2s;';
  btn.onmouseenter = function() { btn.style.transform = 'scale(1.1)'; };
  btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; };

  // Create iframe container
  var container = document.createElement('div');
  container.id = 'mayasura-chat-container';
  container.style.cssText = 'position:fixed;bottom:96px;right:24px;width:380px;height:560px;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.15);z-index:99999;display:none;';
  
  var iframe = document.createElement('iframe');
  iframe.src = origin + '/chat/' + slug;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  container.appendChild(iframe);

  document.body.appendChild(btn);
  document.body.appendChild(container);

  var open = false;
  btn.onclick = function() {
    open = !open;
    container.style.display = open ? 'block' : 'none';
    btn.innerHTML = open ? '✕' : '💬';
  };
})();
`.trim();

  return new NextResponse(widgetScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
