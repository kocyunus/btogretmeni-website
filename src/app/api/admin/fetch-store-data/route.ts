import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { parse } from 'node-html-parser';

async function checkAuth(cookieStore: ReadonlyRequestCookies): Promise<boolean> {
  const adminToken = cookieStore.get('admin_token')?.value;
  return adminToken === process.env.ADMIN_TOKEN;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthorized = await checkAuth(cookieStore);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, type } = await request.json();
    console.log('İstek alındı:', { url, type });

    if (!url) {
      return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
    }

    if (type === 'playstore') {
      console.log('Play Store\'dan veri çekiliyor...');
      const response = await fetch(url);
      const html = await response.text();
      console.log('HTML içeriği alındı, uzunluk:', html.length);
      
      const root = parse(html);
      
      const data = {
        title: root.querySelector('h1')?.text?.trim() || '',
        description: root.querySelector('[data-g-id="description"]')?.text?.trim() || '',
        imageUrl: root.querySelector('img[alt*="icon"]')?.getAttribute('src') || '',
        screenshots: root.querySelectorAll('img[alt*="screenshot"]').map(el => el.getAttribute('src')).filter(Boolean),
        rating: parseFloat(root.querySelector('[aria-label*="rating"]')?.text || '0'),
        downloads: root.querySelector('[aria-label*="downloads"]')?.text?.trim() || '',
      };

      console.log('Çekilen veriler:', data);
      return NextResponse.json(data);
    } else if (type === 'appstore') {
      const appId = url.match(/id(\d+)/)?.[1];
      if (!appId) {
        return NextResponse.json({ error: 'Geçersiz App Store URL' }, { status: 400 });
      }

      console.log('App Store\'dan veri çekiliyor, appId:', appId);
      const response = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
      const data = await response.json();
      const app = data.results[0];

      if (!app) {
        return NextResponse.json({ error: 'Uygulama bulunamadı' }, { status: 404 });
      }

      const appData = {
        title: app.trackName,
        description: app.description,
        imageUrl: app.artworkUrl512 || app.artworkUrl100,
        screenshots: app.screenshotUrls,
        rating: app.averageUserRating || 0,
        downloads: 'App Store\'da gösterilmiyor',
      };

      console.log('Çekilen veriler:', appData);
      return NextResponse.json(appData);
    }

    return NextResponse.json({ error: 'Desteklenmeyen mağaza tipi' }, { status: 400 });
  } catch (error) {
    console.error('Mağaza verisi çekme hatası:', error);
    return NextResponse.json({ 
      error: 'Mağaza verisi çekilemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 