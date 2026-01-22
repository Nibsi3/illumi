"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Input } from "@/components/ui/input"
import { IconSearch, IconFile, IconUser, IconArrowUpRight, IconDownload, IconCopy } from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SearchResult {
    id: string
    type: 'vault' | 'customer'
    title: string
    subtitle?: string
    url?: string
}

interface SearchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    
    const supabase = createClient()
    const { activeWorkspace } = useWorkspace()

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim() || !activeWorkspace) {
            setResults([])
            return
        }

        setLoading(true)
        try {
            const searchResults: SearchResult[] = []

            // Search vault files
            const { data: vaultFiles } = await supabase
                .from('vault_files')
                .select('id, file_name, file_url')
                .eq('workspace_id', activeWorkspace.id)
                .ilike('file_name', `%${searchQuery}%`)
                .limit(5)

            if (vaultFiles) {
                vaultFiles.forEach(file => {
                    searchResults.push({
                        id: file.id,
                        type: 'vault',
                        title: file.file_name,
                        url: file.file_url
                    })
                })
            }

            // Search customers/clients
            const { data: clients } = await supabase
                .from('customers')
                .select('id, name, email')
                .eq('workspace_id', activeWorkspace.id)
                .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
                .limit(5)

            if (clients) {
                clients.forEach(client => {
                    searchResults.push({
                        id: client.id,
                        type: 'customer',
                        title: client.name,
                        subtitle: client.email
                    })
                })
            }

            setResults(searchResults)
            setSelectedIndex(0)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }, [activeWorkspace, supabase])

    useEffect(() => {
        const debounce = setTimeout(() => {
            search(query)
        }, 200)
        return () => clearTimeout(debounce)
    }, [query, search])

    useEffect(() => {
        if (!open) {
            setQuery("")
            setResults([])
            setSelectedIndex(0)
        }
    }, [open])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault()
            handleSelect(results[selectedIndex])
        }
    }

    const handleSelect = (result: SearchResult) => {
        if (result.type === 'vault' && result.url) {
            window.open(result.url, '_blank')
        } else if (result.type === 'customer') {
            window.location.href = `/clients?id=${result.id}`
        }
        onOpenChange(false)
    }

    const groupedResults = {
        vault: results.filter(r => r.type === 'vault'),
        customer: results.filter(r => r.type === 'customer')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 bg-popover border border-border rounded-xl overflow-hidden gap-0">
                <VisuallyHidden>
                    <DialogTitle>Search</DialogTitle>
                </VisuallyHidden>
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <IconSearch className="h-5 w-5 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        autoFocus
                    />
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {loading && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            Searching...
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No results found
                        </div>
                    )}

                    {!loading && !query && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            Start typing to search vault files and clients...
                        </div>
                    )}

                    {/* Vault Results */}
                    {groupedResults.vault.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-medium text-amber-500">
                                Vault
                            </div>
                            {groupedResults.vault.map((result, index) => {
                                const globalIndex = index
                                return (
                                    <div
                                        key={result.id}
                                        onClick={() => handleSelect(result)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors",
                                            selectedIndex === globalIndex ? "bg-accent" : "hover:bg-accent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconFile className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-foreground">{result.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (result.url) navigator.clipboard.writeText(result.url)
                                                }}
                                                className="p-1.5 hover:bg-accent rounded transition-colors"
                                            >
                                                <IconCopy className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (result.url) window.open(result.url, '_blank')
                                                }}
                                                className="p-1.5 hover:bg-accent rounded transition-colors"
                                            >
                                                <IconDownload className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (result.url) window.open(result.url, '_blank')
                                                }}
                                                className="p-1.5 hover:bg-accent rounded transition-colors"
                                            >
                                                <IconArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            <Link 
                                href="/vault" 
                                onClick={() => onOpenChange(false)}
                                className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <IconArrowUpRight className="h-3 w-3" />
                                View vault
                            </Link>
                        </div>
                    )}

                    {/* Customer Results */}
                    {groupedResults.customer.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-medium text-amber-500">
                                Clients
                            </div>
                            {groupedResults.customer.map((result, index) => {
                                const globalIndex = groupedResults.vault.length + index
                                return (
                                    <div
                                        key={result.id}
                                        onClick={() => handleSelect(result)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                                            selectedIndex === globalIndex ? "bg-accent" : "hover:bg-accent"
                                        )}
                                    >
                                        <IconUser className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-foreground">{result.title}</span>
                                            {result.subtitle && (
                                                <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border">
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground">↑</kbd>
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground">↓</kbd>
                        <span className="text-[10px] text-muted-foreground ml-1">navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground">↵</kbd>
                        <span className="text-[10px] text-muted-foreground ml-1">select</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
