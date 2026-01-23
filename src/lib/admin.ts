export function getAdminEmails(): string[] {
    const raw = process.env.ADMIN_EMAILS || ''
    return raw
        .split(',')
        .map((e) => e.toLowerCase().trim())
        .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
    const normalized = (email || '').toLowerCase().trim()
    if (!normalized) return false
    const allowlist = getAdminEmails()
    if (allowlist.length === 0) return false
    return allowlist.includes(normalized)
}
