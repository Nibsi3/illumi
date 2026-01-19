"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useWorkspace } from "@/lib/workspace-context"
import { useSettings } from "@/lib/settings-context"

type Product = {
  id: string
  name: string
  sku?: string
  description?: string
  price: number
  currency: string
  billing_type: "one-time" | "recurring"
  status: "active" | "archived"
  created_at: string
}

const productColumns = [
  { id: "name", label: "Name" },
  { id: "sku", label: "SKU" },
  { id: "price", label: "Price" },
  { id: "billingType", label: "Billing" },
  { id: "status", label: "Status" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "sku",
    "price",
    "billingType",
    "status",
  ])
  const supabase = createClient()
  const { activeWorkspace } = useWorkspace()
  const { currency } = useSettings()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!activeWorkspace) return

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('workspace_id', activeWorkspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error: any) {
        toast.error("Failed to load products", { description: error.message })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [supabase])

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      setProducts(prev => prev.filter(p => p.id !== productId))
      toast.success("Product deleted")
    } catch (error: any) {
      toast.error("Failed to delete product", { description: error.message })
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatPrice = (price: number, itemCurrency: string) => {
    return `${currency || itemCurrency || 'ZAR'} ${price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="flex flex-col gap-y-10 font-sans pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif text-white tracking-tight italic">
          Products
        </h1>
        <p className="text-neutral-500 mt-1 max-w-2xl">
          Manage reusable products and services you invoice for. These can be
          attached to any invoice or recurring schedule.
        </p>
      </div>

      {/* Filters / Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-transparent border-white/5 focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 border-white/5 bg-transparent hover:bg-white/5 transition-colors rounded-none"
              >
                <Filter className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-black border-white/10 rounded-none"
            >
              {productColumns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={visibleColumns.includes(col.id)}
                  onCheckedChange={(checked) => {
                    setVisibleColumns((prev) =>
                      checked
                        ? [...prev, col.id]
                        : prev.filter((c) => c !== col.id),
                    )
                  }}
                  className="focus:bg-white/5 focus:text-white rounded-none"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/products/new">
            <Button className="h-11 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold rounded-none">
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="border border-white/10 bg-black p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No products yet</h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            Create reusable products to quickly add them to your invoices.
          </p>
          <Link href="/products/new">
            <Button className="bg-white text-black hover:bg-neutral-200 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Product
            </Button>
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && products.length > 0 && (
        <div className="border border-white/10 bg-black overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-white/2 border-b border-white/10">
                  <th className="px-5 py-3 w-10 border-r border-white/10">
                    <div className="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors" />
                  </th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Product</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">SKU</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10">Status</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] border-r border-white/10 text-right">Price</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-[#878787] text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/2 transition-colors border-b border-white/10 group last:border-0">
                    <td className="px-5 py-4 border-r border-white/10">
                      <div className="w-4 h-4 rounded-sm border border-white/20 transition-all flex items-center justify-center cursor-pointer group-hover:border-white/40" />
                    </td>
                    <td className="px-5 py-4 border-r border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#878787]">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#fafafa] tracking-tight">{product.name}</span>
                          <span className="text-[10px] text-[#878787] truncate max-w-[200px]">{product.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 border-r border-white/10 text-[#878787]">
                      {product.sku || '-'}
                    </td>
                    <td className="px-5 py-4 border-r border-white/10">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-neutral-400 border-white/10'
                      )}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-r border-white/10 text-right text-white font-bold text-sm">
                      {formatPrice(product.price, product.currency)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 rounded-xl shadow-2xl p-1">
                          <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Edit Product</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-white/5 focus:text-white rounded-lg cursor-pointer px-3 py-2 text-xs">Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10 mx-1" />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="focus:bg-red-500/10 focus:text-red-500 text-red-500 rounded-lg cursor-pointer px-3 py-2 text-xs"
                          >
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}



