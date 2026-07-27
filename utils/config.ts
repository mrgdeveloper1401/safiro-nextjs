// utils/config.ts
import { NextResponse } from "next/server";

export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/'

export const isDev = process.env.NODE_ENV === 'development';

// export const isDev = false;
// export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.safiro.ir/v1'

export const DOMAIN_URL = process.env.DOMAIN_URL || 'https://safiro.ir'

export const response = NextResponse;

export const mapKey = process.env.MAP_KEY || 'web.e86a5f1c2bc549629d6a31a402e7c950'