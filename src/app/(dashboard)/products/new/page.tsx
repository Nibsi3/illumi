"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, X, Package } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save then return to list
    setTimeout(() => {
      setIsSaving(false)
      router.push("/products")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans pb-20">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-[#0d0d0d]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Product
            </span>
            <span className="text-sm font-medium">New product</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-neutral-400 hover:text-white font-medium"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black hover:bg-neutral-200 transition-colors font-semibold px-8 rounded-lg"
          >
            {isSaving ? "Saving..." : "Save product"}
          </Button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto mt-12 px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-neutral-900 border border-white/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-neutral-400" />
            </div>
            <h1 className="text-3xl font-serif italic text-white">
              Create Product
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          <section className="border border-white/5 bg-[#09090b] rounded-xl p-6 space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Name
                </Label>
                <Input
                  placeholder="Website design package"
                  className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    SKU
                  </Label>
                  <Input
                    placeholder="WEB-DESIGN-01"
                    className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Default price
                  </Label>
                  <Input
                    placeholder="5000"
                    className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Currency
                  </Label>
                  <Input
                    placeholder="ZAR"
                    className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Billing
                  </Label>
                  <Input
                    placeholder="One-time / Recurring"
                    className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Description
                </Label>
                <textarea
                  placeholder="Short internal description of what this product or service includes."
                  className="w-full bg-transparent border border-white/10 rounded-lg p-3 h-28 focus:ring-1 focus:ring-white/10 transition-all text-sm resize-none outline-none"
                />
              </div>
            </div>
          </section>

          <section className="border border-white/5 bg-[#09090b] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Accounting
            </h2>
            <p className="text-xs text-neutral-500 max-w-md">
              Optional details that help you and your customer understand how
              this product appears on invoices. No accountant jargon.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Unit label
                </Label>
                <Input
                  placeholder="Hours, months, seats..."
                  className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Tax treatment
                </Label>
                <Input
                  placeholder="Standard / Exempt"
                  className="bg-transparent border-white/10 h-11 focus-visible:ring-white/10"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


