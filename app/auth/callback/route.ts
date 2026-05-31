import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Bypasses Server-side token exchange. 
  // Client-side Supabase SDK automatically parses OAuth tokens from the hash fragment upon redirecting.
  return NextResponse.redirect(new URL('/app', request.url));
}
