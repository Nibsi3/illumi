import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_URL ??
        'http://localhost:3000'

    // Ensure it has a protocol and no trailing slash
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
    return url
}
