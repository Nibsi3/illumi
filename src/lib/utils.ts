import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    let url = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL

    // Prioritize browser origin if available (fixes issues with dynamic ports like 3001)
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
