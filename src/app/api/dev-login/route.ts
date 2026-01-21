import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
    void req
    return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 })
}
