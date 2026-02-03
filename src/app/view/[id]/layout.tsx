import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  const base = (
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://www.illumi.co.za'
  ).replace(/\/$/, '')

  try {
    const res = await fetch(`${base}/api/invoices/public?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    })
    const json = await res.json().catch(() => null)

    const invoice = json?.invoice
    const workspaceName = invoice?.workspace?.name || 'Invoice'
    const invoiceNumber = invoice?.invoice_number || id

    const logoUrl = invoice?.logo_url || invoice?.workspace?.logo_url || null
    const ogImage = typeof logoUrl === 'string' && logoUrl.trim() ? logoUrl : '/logo.png'

    return {
      metadataBase: new URL(base),
      title: `${workspaceName} | ${invoiceNumber}`,
      description: `View invoice ${invoiceNumber}.`,
      openGraph: {
        title: `${workspaceName} | ${invoiceNumber}`,
        description: `View invoice ${invoiceNumber}.`,
        type: 'website',
        images: [{ url: ogImage }],
      },
      twitter: {
        card: 'summary',
        title: `${workspaceName} | ${invoiceNumber}`,
        description: `View invoice ${invoiceNumber}.`,
        images: [ogImage],
      },
    }
  } catch {
    return {}
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
