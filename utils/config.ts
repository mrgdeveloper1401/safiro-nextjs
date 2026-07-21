import { NextResponse } from "next/server";

// export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/'
// export const isDev = process.env.NODE_ENV === 'development';

export const isDev = false;
export const V1_PUBlIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.safiro.ir/v1'

export const response = NextResponse;
