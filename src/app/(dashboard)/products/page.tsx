"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreHorizontal, Package } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  name: string
  sku?: string
  description?: string
  price: string
  currency: string
  billingType: "One-time" | "Recurring"
  status: "Active" | "Archived"
}

const initialProducts: Product[] = [
  {
    id: "PROD-0001",
    name: "Retainer Package",
    sku: "RET-5000",
    description: "Monthly consulting retainer",
    price: "ZAR 5,000.00",
    currency: "ZAR",
    billingType: "Recurring",
    status: "Active",
  },
  {
    id: "PROD-0002",
    name: "Implementation Project",
    sku: "IMP-ONCE",
    description: "Implementation and onboarding once-off",
    price: "ZAR 12,500.00",
    currency: "ZAR",
    billingType: "One-time",
    status: "Active",
  },
]

const productColumns = [
  { id: "name", label: "Name" },
  { id: "sku", label: "SKU" },
  { id: "price", label: "Price" },
  { id: "billingType", label: "Billing" },
  { id: "status", label: "Status" },
]

export default function ProductsPage() {
  const [products] = useState<Product[]>(initialProducts)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "sku",
    "price",
    "billingType",
    "status",
  ])

  return (
    <div className="flex flex-col gap-y-10 font-sans px-6 max-w-7xl mx-auto pb-20">
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

      {/* Products table */}
      <div className="rounded-none border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/[0.01] text-neutral-500 uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4 w-10">
                <div className="w-4 h-4 rounded-none border border-white/10" />
              </th>
              {productColumns
                .filter((c) => visibleColumns.includes(c.id))
                .map((col) => (
                  <th key={col.id} className="px-6 py-4">
                    {col.label}
                  </th>
                ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <td className="px-6 py-5">
                  <div className="w-4 h-4 rounded-none border border-white/10 group-hover:border-white/30 transition-colors" />
                </td>

                {visibleColumns.includes("name") && (
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-none bg-neutral-900 border border-white/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-neutral-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {product.name}
                        </span>
                        {product.description && (
                          <span className="text-xs text-neutral-500">
                            {product.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                )}

                {visibleColumns.includes("sku") && (
                  <td className="px-6 py-5 text-neutral-500">
                    {product.sku ?? "—"}
                  </td>
                )}

                {visibleColumns.includes("price") && (
                  <td className="px-6 py-5 text-white font-medium">
                    {product.price}
                  </td>
                )}

                {visibleColumns.includes("billingType") && (
                  <td className="px-6 py-5 text-neutral-400">
                    {product.billingType}
                  </td>
                )}

                {visibleColumns.includes("status") && (
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider",
                        product.status === "Active"
                          ? "bg-white/10 text-white"
                          : "bg-white/5 text-neutral-500",
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                )}

                <td className="px-6 py-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-500 hover:text-white transition-colors rounded-none"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-black border-white/10 rounded-none shadow-2xl"
                    >
                      <DropdownMenuCheckboxItem
                        checked={false}
                        className="focus:bg-white/5 focus:text-white rounded-none cursor-pointer"
                      >
                        Edit
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


