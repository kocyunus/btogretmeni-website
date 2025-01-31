import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { Game } from '@/types/game';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const gamesFilePath = path.join(process.cwd(), 'src/data/games.json');

// Yetkilendirme kontrolü
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    return false;
  }

  try {
    verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Oyunları dosyadan oku
async function readGames(): Promise<Game[]> {
  try {
    const content = await fs.readFile(gamesFilePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Oyunları dosyaya yaz
async function writeGames(games: Game[]): Promise<void> {
  try {
    await fs.writeFile(gamesFilePath, JSON.stringify(games, null, 2));
  } catch {
    return;
  }
}

// Tüm oyunları getir
export async function GET() {
  const games = await readGames();
  return NextResponse.json(games);
}

// Yeni oyun ekle
export async function POST(request: Request) {
  const isAuthorized = await checkAuth();
  
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim' },
      { status: 401 }
    );
  }

  try {
    const game = await request.json();
    game.id = `game-${Date.now()}`;
    
    const games = await readGames();
    games.push(game);
    await writeGames(games);
    
    return NextResponse.json(game);
  } catch {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

// Oyun güncelle
export async function PUT(request: Request) {
  const isAuthorized = await checkAuth();
  
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim' },
      { status: 401 }
    );
  }

  try {
    const updatedGame = await request.json();
    const games = await readGames();
    const index = games.findIndex(game => game.id === updatedGame.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Oyun bulunamadı' },
        { status: 404 }
      );
    }

    games[index] = updatedGame;
    await writeGames(games);
    
    return NextResponse.json(updatedGame);
  } catch {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

// Oyun sil
export async function DELETE(request: Request) {
  const isAuthorized = await checkAuth();
  
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      );
    }

    const games = await readGames();
    const updatedGames = games.filter(game => game.id !== id);
    
    if (games.length === updatedGames.length) {
      return NextResponse.json(
        { error: 'Oyun bulunamadı' },
        { status: 404 }
      );
    }

    await writeGames(updatedGames);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
} 