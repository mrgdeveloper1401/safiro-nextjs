// utils/config.ts

import { NextResponse } from "next/server";

export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1'

export const isDev = process.env.NODE_ENV === 'development';

// export const isDev = false;
// export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.safiro.ir/v1'

export const DOMAIN_URL = process.env.DOMAIN_URL || 'https://safiro.ir'

export const response = NextResponse;

export const mapKey = process.env.MAP_KEY || 'web.0ac6f7f9df6c4789922dd64b213f6372'