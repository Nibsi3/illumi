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
        <div className="bg-background grainy-gradient">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 pt-32 md:pt-40 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-background" />
                    <div className="absolute inset-0 bg-white dark:bg-black/60" />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 justify-center">
                        <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground">Client File Vault</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        Store invoices and files,<br />
                        <span className="text-muted-foreground">organised per client</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
                        Store every client invoice and supporting file in one place.
                        Keep invoices organised per customer so you can track each client easily.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-primary text-primary-foreground hover:bg-white/90 rounded-full px-8 h-12"
                        >
                            <Link href="/login">
                                Start Organizing
                                <IconArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted"
                        >
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* File Manager Mockup */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="border border-border rounded-3xl bg-card dark:bg-black/50 overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
                                    <IconFolder className="h-4 w-4" />
                                    All Files
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                                <IconSearch className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Search files...</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
                            {/* Folders Sidebar */}
                            <div className="p-4 space-y-2">
                                {folders.map((folder, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <IconFolder className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm text-foreground">{folder.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{folder.count}</span>
                                    </div>
                                ))}
                            </div>

                            {/* File List */}
                            <div className="lg:col-span-3 p-4">
                                <div className="space-y-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                                                    <IconFile className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{file.size}</div>
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
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4">All your client invoices in one place</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-12">
                        No more searching through email threads. Keep invoices and client documents organised and accessible.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-3xl font-serif font-bold text-foreground mb-2">∞</div>
                            <div className="text-sm text-muted-foreground">Unlimited storage</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-3xl font-serif font-bold text-foreground mb-2">256-bit</div>
                            <div className="text-sm text-muted-foreground">Encryption</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-3xl font-serif font-bold text-foreground mb-2">99.9%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Feature */}
            <section className="py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">Find what you need faster</h2>
                            <p className="text-muted-foreground mb-8">
                                Search your invoices and files by name and date, so you can pull up what you need in seconds.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                                    <IconSearch className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Full-text search</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-border rounded-3xl bg-card dark:bg-black/50 p-6">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border mb-4">
                                <IconSearch className="h-5 w-5 text-muted-foreground" />
                                <span className="text-foreground">tax certificate 2023</span>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 rounded-xl bg-muted/50 flex items-center gap-3">
                                    <IconFile className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-foreground">Tax_Certificate_2023.pdf</div>
                                        <div className="text-xs text-muted-foreground">Tax Documents • 320 KB</div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50 flex items-center gap-3">
                                    <IconFile className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm text-foreground">Tax_Return_2023_Draft.pdf</div>
                                        <div className="text-xs text-muted-foreground">Tax Documents • 1.2 MB</div>
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
