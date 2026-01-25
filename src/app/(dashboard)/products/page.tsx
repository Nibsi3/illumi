"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/hooks/use-cached-data"
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
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

  // Cached product fetching with React Query
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: queryKeys.products(activeWorkspace?.id || ""),
    queryFn: async () => {
      if (!activeWorkspace) return []
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!activeWorkspace?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const handleArchiveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived' })
        .eq('id', productId)

      if (error) throw error

      refetch()
      toast.success("Product archived")
    } catch (error: any) {
      toast.error("Failed to archive product", { description: error.message })
    }
  }

  const openEdit = (product: Product) => {
    setEditing({ ...product })
    setIsEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editing) return
    setIsSavingEdit(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editing.name,
          sku: editing.sku || null,
          description: editing.description || null,
          price: Number(editing.price) || 0,
        })
        .eq('id', editing.id)

      if (error) throw error
      refetch()
      setIsEditOpen(false)
      setEditing(null)
      toast.success('Product updated')
    } catch (error: any) {
      toast.error('Failed to update product', { description: error.message })
    } finally {
      setIsSavingEdit(false)
    }
  }

  const duplicateProduct = async (product: Product) => {
    if (!activeWorkspace) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in')
        return
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          sku: product.sku || null,
          description: product.description || null,
          price: product.price,
          currency: product.currency,
          billing_type: product.billing_type,
          status: 'active',
          user_id: user.id,
          workspace_id: activeWorkspace.id,
        })
        .select('*')
        .single()

      if (error) throw error
      refetch()
      toast.success('Product duplicated')
    } catch (error: any) {
      toast.error('Failed to duplicate product', { description: error.message })
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
        <h1 className="text-2xl sm:text-4xl font-serif text-foreground tracking-tight italic">
          Products
        </h1>
        <p className="hidden sm:block text-muted-foreground mt-1 max-w-2xl">
          Manage reusable products and services you invoice for. These can be
          attached to any invoice or recurring schedule.
        </p>
      </div>

      {/* Filters / Actions */}
      <div className="md:static md:bg-transparent md:border-0 sticky top-16 z-20 bg-background/95 backdrop-blur border-y border-border py-3 -mx-4 px-4 md:py-0 md:mx-0 md:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 sm:max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-transparent border-border focus-visible:ring-offset-0 focus-visible:ring-white/10 rounded-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden md:inline-flex h-11 border-border bg-transparent hover:bg-muted transition-colors rounded-none"
              >
                <Filter className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-background border-border rounded-none"
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
                  className="focus:bg-muted focus:text-foreground rounded-none"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/products/new">
            <Button className="h-11 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold rounded-none">
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="border border-border bg-background p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create reusable products to quickly add them to your invoices.
          </p>
          <Link href="/products/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Product
            </Button>
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!isLoading && products.length > 0 && (
        <div className="border border-border bg-background overflow-hidden shadow-2xl">
          {/* Mobile list */}
          <div className="md:hidden divide-y divide-border">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground shrink-0">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{product.sku || 'No SKU'}</div>
                      </div>
                    </div>
                  </div>

                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0",
                    product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                  )}>
                    {product.status}
                  </span>
                </div>

                <div className="mt-2 text-xs text-muted-foreground truncate">
                  {product.description || 'No description'}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{product.billing_type === 'recurring' ? 'Recurring' : 'One-time'}</span>
                  <span className="text-sm font-bold text-foreground">{formatPrice(product.price, product.currency)}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                    onClick={() => openEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 flex-1 border-border bg-muted hover:bg-accent rounded-lg"
                    onClick={() => duplicateProduct(product)}
                  >
                    Duplicate
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-5 py-3 w-10 border-r border-border">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-sm border border-border flex items-center justify-center cursor-pointer hover:border-border transition-colors",
                        selectedIds.length > 0 && selectedIds.length === filteredProducts.length && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        if (selectedIds.length === filteredProducts.length) {
                          setSelectedIds([])
                        } else {
                          setSelectedIds(filteredProducts.map(p => p.id))
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {selectedIds.length > 0 && selectedIds.length === filteredProducts.length && <Package className="h-3 w-3" />}
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Product</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">SKU</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border">Status</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground border-r border-border text-right">Price</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-widest text-muted-foreground text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors border-b border-border group last:border-0">
                    <td className="px-5 py-4 border-r border-border">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-sm border border-border transition-all flex items-center justify-center cursor-pointer group-hover:border-border",
                          selectedIds.includes(product.id) && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => {
                          setSelectedIds(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id])
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {selectedIds.includes(product.id) && <Package className="h-3 w-3" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-r border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground tracking-tight">{product.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{product.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 border-r border-border text-muted-foreground">
                      {product.sku || '-'}
                    </td>
                    <td className="px-5 py-4 border-r border-border">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                      )}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-r border-border text-right text-foreground font-bold text-sm">
                      {formatPrice(product.price, product.currency)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-background border-border rounded-xl shadow-2xl p-1">
                          <DropdownMenuItem
                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                            onClick={() => openEdit(product)}
                          >
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-muted focus:text-foreground rounded-lg cursor-pointer px-3 py-2 text-xs"
                            onClick={() => duplicateProduct(product)}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-accent mx-1" />
                          <DropdownMenuItem
                            onClick={() => handleArchiveProduct(product.id)}
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Product</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="bg-background border-border h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</label>
                  <Input
                    value={String(editing.price ?? 0)}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    inputMode="decimal"
                    className="bg-background border-border h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SKU</label>
                  <Input
                    value={editing.sku || ''}
                    onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
                    className="bg-background border-border h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Input
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="bg-background border-border h-11"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="border-border bg-muted hover:bg-accent"
              onClick={() => setIsEditOpen(false)}
              disabled={isSavingEdit}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={saveEdit}
              disabled={isSavingEdit || !editing}
            >
              {isSavingEdit ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




