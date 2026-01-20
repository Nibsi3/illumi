import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    // In the browser, always prefer the actual origin when running locally.
    // This prevents auth redirects to production when NEXT_PUBLIC_URL is set.
    if (typeof window !== 'undefined' && window.location?.origin) {
        const hostname = (window.location.hostname || '').toLowerCase()
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return window.location.origin.replace(/\/$/, '')
        }
    }

    let url = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL

    // If env isn't set (or in preview environments), fall back to browser origin.
    if (!url && typeof window !== 'undefined' && window.location.origin) {
        url = window.location.origin
    }

    url = url || 'http://localhost:3001'

    // Ensure it has a protocol
    if (!url.startsWith('http')) {
        url = `https://${url}`
    }

    // Remove trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url
}
