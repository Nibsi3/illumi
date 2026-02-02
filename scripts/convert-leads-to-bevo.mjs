// Convert pasted lead lists into Bevo import CSV
// Usage:
//   node scripts/convert-leads-to-bevo.mjs ./leads.txt > leads-bevo.csv
//   node scripts/convert-leads-to-bevo.mjs ./leads.txt --tsv > leads-bevo.tsv
//
// Input: any text. Each lead line must contain an email address.
// Output CSV columns:
//   CONTACT_ID,EMAIL,FIRSTNAME,LASTNAME,COMPANY,LOCATION

import fs from 'fs'

const inputPath = process.argv[2]
const useTsv = process.argv.includes('--tsv')
if (!inputPath) {
    console.error('Missing input file. Example: node scripts/convert-leads-to-bevo.mjs ./leads.txt > leads-bevo.csv')
    process.exit(1)
}

const raw = fs.readFileSync(inputPath, 'utf8')

const EMAIL_RE = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i

/**
 * Heuristic parser:
 * - Find email in the line
 * - Left side = company/practice name
 * - Right side = location (may be multiple words)
 */
function parseLine(line) {
    const m = line.match(EMAIL_RE)
    if (!m) return null

    const email = m[1].trim()
    const idx = line.indexOf(email)
    const left = line.slice(0, idx).trim()
    const right = line.slice(idx + email.length).trim()

    const company = left.replace(/\s+/g, ' ').trim()
    const location = right.replace(/\s+/g, ' ').trim()

    if (!company || !email) return null

    return { email, company, location }
}

const seen = new Set()
const leads = []

for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Skip obvious instructional lines
    const lower = trimmed.toLowerCase()
    if (lower.startsWith('business name')) continue
    if (lower.startsWith('practice/doctor name')) continue
    if (lower.startsWith('company name')) continue
    if (lower.startsWith('agency name')) continue
    if (lower.startsWith('firm name')) continue
    if (lower.startsWith('pain point')) continue

    const parsed = parseLine(trimmed)
    if (!parsed) continue

    const key = parsed.email.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    leads.push(parsed)
}

const sep = useTsv ? '\t' : ','

// Output header
process.stdout.write(['CONTACT_ID', 'EMAIL', 'FIRSTNAME', 'LASTNAME', 'COMPANY', 'LOCATION'].join(sep) + '\n')

let id = 1
for (const lead of leads) {
    // Basic CSV escaping for commas/quotes
    const esc = (v) => {
        const s = String(v ?? '')
        if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
        return s
    }

    const row = [
        id,
        useTsv ? lead.email : esc(lead.email),
        '',
        '',
        useTsv ? lead.company : esc(lead.company),
        useTsv ? lead.location : esc(lead.location),
    ]

    process.stdout.write(row.join(sep) + '\n')

    id++
}
