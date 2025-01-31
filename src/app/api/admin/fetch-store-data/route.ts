import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import * as cheerio from 'cheerio';

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
      
      const $ = cheerio.load(html);
      
      // Play Store'un güncel HTML yapısına göre seçicileri güncelliyorum
      const data = {
        title: $('h1').first().text().trim(),
        description: $('[data-g-id="description"]').text().trim(),
        imageUrl: $('img[alt*="icon"]').first().attr('src'),
        screenshots: $('img[alt*="screenshot"]').map((_, el) => $(el).attr('src')).get(),
        rating: parseFloat($('[aria-label*="rating"]').first().text()) || 0,
        downloads: $('[aria-label*="downloads"]').first().text().trim(),
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