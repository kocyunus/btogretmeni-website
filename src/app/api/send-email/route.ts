import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { message, subject, to } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Email gönderilemedi' },
      { status: 500 }
    );
  }
} 