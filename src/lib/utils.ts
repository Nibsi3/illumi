import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    // 1. Prioritize Environment Variable (from Build/Cloud settings)
    let url = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL

    // 2. If no environment variable, try browser origin
    if (!url && typeof window !== 'undefined') {
        url = window.location.origin
    }

    // 3. Last resort fallback (avoid 0.0.0.0)
    url = url || 'http://localhost:3000'

    // Ensure it has a protocol
    if (!url.startsWith('http')) {
        url = `https://${url}`
    }

    // Remove trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url
}
