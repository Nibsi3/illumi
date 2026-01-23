import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white grainy-gradient flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center">
                <div className="text-xs uppercase tracking-widest text-white/50 font-bold">404</div>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Page not found</h1>
                <p className="mt-4 text-white/60">
                    The page you’re looking for doesn’t exist (or it may have been moved). Try one of these links:
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Home
                    </Link>
                    <Link href="/pricing" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Pricing
                    </Link>
                    <Link href="/resources" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Resources
                    </Link>
                    <Link href="/docs" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Documentation
                    </Link>
                    <Link href="/contact" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Contact
                    </Link>
                    <Link href="/site-map" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                        Sitemap
                    </Link>
                </div>

                <div className="mt-10 text-sm text-white/50">
                    If you followed a broken link, please let us know via the contact page.
                </div>
            </div>
        </div>
    )
}
