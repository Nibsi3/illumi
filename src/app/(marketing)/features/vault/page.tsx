import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconFolder, IconFile, IconSearch } from "@tabler/icons-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Invoice File Vault for Clients | Illumi",
    description: "Store every client invoice and supporting file in one place. Keep invoices organised per customer so South African businesses can track clients easily.",
    keywords: ["invoice file storage", "client invoice vault", "invoice documents", "South Africa invoicing", "file organisation"],
}

const files = [
    { name: "Invoice_2024_Q1.pdf", type: "PDF", size: "245 KB", date: "Jan 15, 2024" },
    { name: "Contract_Acme_Corp.pdf", type: "PDF", size: "1.2 MB", date: "Jan 10, 2024" },
    { name: "Receipt_Office_Supplies.jpg", type: "Image", size: "856 KB", date: "Jan 8, 2024" },
    { name: "Tax_Certificate_2023.pdf", type: "PDF", size: "320 KB", date: "Jan 5, 2024" },
    { name: "Bank_Statement_Dec.pdf", type: "PDF", size: "445 KB", date: "Jan 2, 2024" },
]

const folders = [
    { name: "Invoices", count: 42 },
    { name: "Contracts", count: 15 },
    { name: "Receipts", count: 128 },
    { name: "Tax Documents", count: 23 },
    { name: "Bank Statements", count: 12 },
]

export default function VaultFeaturePage() {
    return (
        <div className="bg-black grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-black" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-white/50 mb-6 justify-center">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">Client File Vault</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Store invoices and files,<br />
                        <span className="text-white/50">organised per client</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg mb-8">
                        Store every client invoice and supporting file in one place.
                        Keep invoices organised per customer so you can track each client easily.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Organizing
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/5"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* File Manager Mockup */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="border border-white/10 rounded-3xl bg-black/50 overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-white/70">
                                    <IconFolder className="h-4 w-4" />
                                    All Files
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                                <IconSearch className="h-4 w-4 text-white/50" />
                                <span className="text-sm text-white/50">Search files...</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                            {/* Folders Sidebar */}
                            <div className="p-4 space-y-2">
                                {folders.map((folder, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <IconFolder className="h-5 w-5 text-white/50" />
                                            <span className="text-sm text-white">{folder.name}</span>
                                        </div>
                                        <span className="text-xs text-white/40">{folder.count}</span>
                                    </div>
                                ))}
                            </div>

                            {/* File List */}
                            <div className="lg:col-span-3 p-4">
                                <div className="space-y-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/2 hover:bg-white/5 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <IconFile className="h-5 w-5 text-white/50" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white truncate">{file.name}</div>
                                                    <div className="text-xs text-white/40 mt-1">{file.size}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All in One Place */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">All your client invoices in one place</h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-12">
                        No more searching through email threads. Keep invoices and client documents organised and accessible.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-3xl font-serif font-bold text-white mb-2">∞</div>
                            <div className="text-sm text-white/50">Unlimited storage</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-3xl font-serif font-bold text-white mb-2">256-bit</div>
                            <div className="text-sm text-white/50">Encryption</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                            <div className="text-3xl font-serif font-bold text-white mb-2">99.9%</div>
                            <div className="text-sm text-white/50">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Feature */}
            <section className="py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Find what you need faster</h2>
                            <p className="text-white/50 mb-8">
                                Search your invoices and files by name and date, so you can pull up what you need in seconds.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                    <IconSearch className="h-4 w-4 text-white/50" />
                                    <span className="text-sm text-white/50">Full-text search</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-white/10 rounded-3xl bg-black/50 p-6">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
                                <IconSearch className="h-5 w-5 text-white/50" />
                                <span className="text-white">tax certificate 2023</span>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 rounded-xl bg-white/2 flex items-center gap-3">
                                    <IconFile className="h-5 w-5 text-white/50" />
                                    <div>
                                        <div className="text-sm text-white">Tax_Certificate_2023.pdf</div>
                                        <div className="text-xs text-white/40">Tax Documents • 320 KB</div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/2 flex items-center gap-3">
                                    <IconFile className="h-5 w-5 text-white/50" />
                                    <div>
                                        <div className="text-sm text-white">Tax_Return_2023_Draft.pdf</div>
                                        <div className="text-xs text-white/40">Tax Documents • 1.2 MB</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
