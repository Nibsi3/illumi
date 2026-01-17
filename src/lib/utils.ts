import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    // 1. If we're in the browser, window.location.origin is the absolute source of truth
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    // 2. If we're on the server (SSG/SSR), use env vars
    let url =
        process?.env?.NEXT_PUBLIC_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Next.js on Vercel
        'http://localhost:3000'

    // Ensure it has a protocol
    if (!url.startsWith('http')) {
        url = `https://${url}`
    }
    // Remove trailing slash
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
    return url
}
