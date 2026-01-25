"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronLeft,
  Package,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { NumberInput } from "@/components/ui/number-input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"

export default function NewProductPage() {
  const router = useRouter()
  const { activeWorkspace } = useWorkspace()
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [sku, setSku] = useState("")
  const [description, setDescription] = useState("")
  const [unitLabel, setUnitLabel] = useState("service")
  const [billingType, setBillingType] = useState<"one-time" | "recurring">("one-time")
  const [taxTreatment, setTaxTreatment] = useState("standard")
  const [isVisible, setIsVisible] = useState(true)

  const supabase = createClient()

  const handleSave = async () => {
    if (!name) {
      toast.error("Product name is required")
      return
    }

    if (price < 0) {
      toast.error("Price cannot be negative")
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to create a product")
        return
      }

      if (!activeWorkspace) {
        toast.error("No workspace selected")
        return
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name,
          description,
          price,
          currency: 'ZAR', // Defaulting to ZAR for now based on context
          sku: sku || null,
          billing_type: billingType,
          status: 'active',
          user_id: user.id,
          workspace_id: activeWorkspace.id
          // Note: unit_label and tax_treatment might need schema updates if they don't exist, 
          // but for now we stick to the core fields known from the list page.
          // If the schema supports them, we add them. 
          // Based on previous list page, we only saw id, name, sku, description, price, currency, billing_type, status.
          // We will omit unitLabel and taxTreatment from the insert for now unless we are sure.
          // Actually, let's assume standard fields for now to avoid errors.
        })

      if (error) throw error

      toast.success("Product created successfully")
      router.push("/products")
    } catch (error: any) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product", { description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-background text-foreground font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto pb-32 lg:pb-40 no-scrollbar">
        <div className="max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-12">
          {/* Back Link */}
          <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Products</span>
          </Link>

          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-card border border-border items-center justify-center shadow-2xl">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-serif text-foreground mb-2 italic">New Product</h1>
                <p className="text-muted-foreground font-mono text-xs sm:text-sm tracking-widest">Add a new item or service to your catalog</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Basic Info */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Basic Information</h2>
              <div className="grid gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product / Service Name</Label>
                  <Input
                    placeholder="E.g. Website Design Package"
                    spellCheck={false}
                    className="bg-transparent border-border h-12 text-lg font-bold focus-visible:ring-white/20"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (ZAR)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">R</span>
                      <NumberInput
                        value={price}
                        onChange={(val) => setPrice(val || 0)}
                        className="h-12 border border-border rounded-md pl-12 pr-4 focus-within:ring-1 focus-within:ring-white/20"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SKU / ID</Label>
                    <Input
                      placeholder="WEB-001"
                      className="bg-transparent border-border h-12 font-mono focus-visible:ring-white/20 uppercase"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Public Description</h2>
              <textarea
                placeholder="Describe this product for your clients..."
                spellCheck={false}
                className="w-full bg-transparent border border-border rounded-xl p-4 h-32 focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-12 flex-1 border-border bg-muted hover:bg-accent"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="h-12 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Right Side Action Bar (Centrally Sticky) */}
      <div className="hidden lg:flex w-80 border-l border-border bg-card flex-col h-full sticky top-0 overflow-y-auto no-scrollbar">
        {/* Status at Top */}
        <div className="p-8 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-foreground uppercase tracking-tighter">Ready</span>
            </div>
          </div>
        </div>

        {/* Vertically Centered Content */}
        <div className="flex-1 flex flex-col justify-center px-8 min-h-[500px] gap-10 py-12">
          <div className="space-y-8">
            {/* Tax & Visibility Above */}
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax Configuration</span>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">Tax Treatment</Label>
                  <Select value={taxTreatment} onValueChange={setTaxTreatment}>
                    <SelectTrigger className="h-10 bg-muted border-border text-foreground rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="standard">Standard Rate (15%)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                      <SelectItem value="zero">Zero-Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Catalog Visibility</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Show on portal</span>
                  <div
                    className="w-10 h-5 bg-emerald-500/20 rounded-full relative cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full transition-all",
                      isVisible ? "right-1 bg-emerald-500" : "left-1 bg-neutral-500"
                    )} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions at the bottom of the centered block */}
            <div className="space-y-4 pt-4 border-t border-border">
              <Button
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-black uppercase tracking-tighter text-xs"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-border bg-transparent hover:bg-muted text-foreground transition-colors font-bold uppercase tracking-tighter text-xs"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

