// src/app/api/openapi/[[...slug]]/route.ts
import { NextResponse } from 'next/server';
import openapi from '@/app/openapi.json';

export async function GET() {
  return NextResponse.json(openapi);
}
