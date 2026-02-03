"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/workspace-context"
import {
    Upload,
    Trash2,
    AlertTriangle
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useSettings } from "@/lib/settings-context"
import { useSubscription } from "@/lib/subscription/hooks"
import { toast } from "sonner"

export default function GeneralSettings() {
    const { isPro } = useSubscription()
    const router = useRouter()
    const { activeWorkspace, refreshWorkspaces } = useWorkspace()
    const {
        logo, setLogo,
        hideIllumiBranding, setHideIllumiBranding,
        companyName, setCompanyName,
        companyWebsite, setCompanyWebsite,
        companyAddress, setCompanyNameAddress,
        bankName, setBankName,
        accountName, setAccountName,
        accountNumber, setAccountNumber,
        branchCode, setBranchCode,
        fromEmail, setFromEmail,
        sendInvoiceCopyToSelf, setSendInvoiceCopyToSelf,
        currency, setCurrency,
        dateFormat, setDateFormat,
        country, setCountry,
        taxRate
    } = useSettings()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isUploadingLogo, setIsUploadingLogo] = useState(false)

    const handleLogoUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e: any) => {
            const file = e.target.files[0]
            if (file && activeWorkspace?.id) {
                setIsUploadingLogo(true)
                try {
                    const supabase = createClient()

                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('workspaceId', activeWorkspace.id)
                    formData.append('folder', 'logos')

                    const uploadRes = await fetch('/api/storage/upload', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    })

                    const uploadJson = await uploadRes.json().catch(() => null)
                    if (!uploadRes.ok || !uploadJson?.success || !uploadJson?.url) {
                        throw new Error(uploadJson?.error || 'Logo upload failed')
                    }

                    const logoUrl = uploadJson.url as string

                    const { error: wsError } = await supabase
                        .from('workspaces')
                        .update({ logo_url: logoUrl })
                        .eq('id', activeWorkspace.id)

                    if (wsError) {
                        throw new Error(wsError.message)
                    }

                    setLogo(logoUrl)
                    try {
                        await refreshWorkspaces(true)
                    } catch {
                        // ignore
                    }
                    toast.success('Logo uploaded successfully')
                } catch (err: any) {
                    console.error('Logo upload error:', err)
                    toast.error('Failed to upload logo', { description: err?.message || 'Please try again.' })
                } finally {
                    setIsUploadingLogo(false)
                }
            } else if (file) {
                // No workspace, use base64 (temporary)
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setLogo(event.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    const handleSave = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            const workspaceId = activeWorkspace?.id

            if (user && workspaceId) {
                let { error: updateError } = await supabase
                    .from('invoices')
                    .update({
                        send_copy_to_self: Boolean(sendInvoiceCopyToSelf),
                        hide_illumi_branding: Boolean(isPro && hideIllumiBranding),
                    } as any)
                    .eq('workspace_id', workspaceId)
                    .eq('user_id', user.id)
                    .or('status.eq.scheduled,is_recurring.eq.true')

                if (updateError && (updateError as any).code === 'PGRST204') {
                    await supabase
                        .from('invoices')
                        .update({
                            send_copy_to_self: Boolean(sendInvoiceCopyToSelf),
                        } as any)
                        .eq('workspace_id', workspaceId)
                        .eq('user_id', user.id)
                        .or('status.eq.scheduled,is_recurring.eq.true')
                }

                // Only set from_email on templates that don't already have a per-invoice override.
                await supabase
                    .from('invoices')
                    .update({
                        from_email: fromEmail,
                    } as any)
                    .eq('workspace_id', workspaceId)
                    .eq('user_id', user.id)
                    .or('status.eq.scheduled,is_recurring.eq.true')
                    .is('from_email', null)

                // Best-effort: update company_website (older DBs may not have this column)
                try {
                    await supabase
                        .from('invoices')
                        .update({
                            company_website: companyWebsite || null,
                        } as any)
                        .eq('workspace_id', workspaceId)
                        .eq('user_id', user.id)
                        .or('status.eq.scheduled,is_recurring.eq.true')
                } catch {
                    // ignore
                }

                // Best-effort: update banking details (older DBs may not have these columns)
                try {
                    await supabase
                        .from('invoices')
                        .update({
                            bank_name: bankName || null,
                            account_name: accountName || null,
                            account_number: accountNumber || null,
                            branch_code: branchCode || null,
                        } as any)
                        .eq('workspace_id', workspaceId)
                        .eq('user_id', user.id)
                        .or('status.eq.scheduled,is_recurring.eq.true')
                } catch {
                    // ignore
                }
            }

            toast.success("Settings saved successfully")
        } catch (err: any) {
            toast.error("Failed to save settings", { description: err?.message || "Please try again." })
        }
    }

    return (
        <div className="space-y-12 pb-24 md:pb-0">
            {/* Logo Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-foreground">Default Logo</h3>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        This logo will be displayed on all your invoices and client communications by default.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                    <div
                        onClick={isUploadingLogo ? undefined : handleLogoUpload}
                        className={`w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-background hover:border-border transition-all flex flex-col items-center justify-center group overflow-hidden ${isUploadingLogo ? 'opacity-50' : 'cursor-pointer'}`}
                    >
                        {isUploadingLogo ? (
                            <div className="animate-spin h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full" />
                        ) : logo ? (
                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-muted-foreground group-hover:scale-110 transition-all mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground">Upload</span>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="h-9 border-border bg-muted hover:bg-accent"
                            onClick={handleLogoUpload}
                            disabled={isUploadingLogo}
                        >
                            {isUploadingLogo ? 'Uploading...' : 'Replace Logo'}
                        </Button>
                        <Button variant="ghost" className="h-9 text-muted-foreground hover:text-red-500" onClick={() => setLogo(null)} disabled={isUploadingLogo}>
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            {/* Branding Section */}
            <div className="space-y-8 pt-10 border-t border-border">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-foreground">Invoice Branding</h3>
                        {!isPro && <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">PRO</span>}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Remove “Powered by Illumi” from the bottom of invoices.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-medium text-foreground">Hide Illumi branding</h4>
                        <p className="text-xs text-muted-foreground max-w-xl">
                            Pro feature. Free invoices will always include Illumi branding.
                        </p>
                    </div>
                    <Switch
                        checked={Boolean(hideIllumiBranding) && Boolean(isPro)}
                        onCheckedChange={(checked) => {
                            if (!isPro) {
                                router.push('/settings/billing')
                                return
                            }
                            setHideIllumiBranding(Boolean(checked))
                        }}
                    />
                </div>
            </div>

            {/* Profile Section */}
            <div className="space-y-8 pt-10 border-t border-border">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-foreground">Organization Profile</h3>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Update your company details used for invoicing and billing.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Name</Label>
                        <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="My Professional Co."
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Address</Label>
                        <textarea
                            value={companyAddress}
                            onChange={(e) => setCompanyNameAddress(e.target.value)}
                            placeholder="Street address\nCity, Postal Code\nCountry"
                            spellCheck={false}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[120px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bank Name</Label>
                        <Input
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="FNB"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Name</Label>
                        <Input
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="My Company (Pty) Ltd"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number</Label>
                        <Input
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="123456789"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Branch Code</Label>
                        <Input
                            value={branchCode}
                            onChange={(e) => setBranchCode(e.target.value)}
                            placeholder="250655"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</Label>
                        <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger className="bg-background border-border h-11 focus:ring-white/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                <SelectItem value="South Africa">South Africa</SelectItem>
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="Egypt">Egypt</SelectItem>
                                <SelectItem value="Algeria">Algeria</SelectItem>
                                <SelectItem value="Morocco">Morocco</SelectItem>
                                <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                                <SelectItem value="Tanzania">Tanzania</SelectItem>
                                <SelectItem value="Ghana">Ghana</SelectItem>
                                <SelectItem value="Angola">Angola</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">Current VAT Rate: {taxRate}%</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date Format</Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                            <SelectTrigger className="bg-background border-border h-11 focus:ring-white/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Support Email</Label>
                        <Input
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                            placeholder="support@myco.com"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Website</Label>
                        <Input
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            placeholder="https://yourcompany.com"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Currency</Label>
                        <div className="h-11 flex items-center px-3 bg-card border border-border rounded-md text-sm text-muted-foreground">
                            {currency} (Auto-set)
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border">
                    <div className="flex items-start sm:items-center justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-medium text-foreground">Send yourself a copy</h4>
                            <p className="text-xs text-muted-foreground max-w-xl">
                                When an invoice email is sent to a client, also send a copy to your support email.
                            </p>
                        </div>
                        <Switch
                            checked={sendInvoiceCopyToSelf}
                            onCheckedChange={(checked) => setSendInvoiceCopyToSelf(Boolean(checked))}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="hidden md:flex justify-end pt-10 border-t border-border">
                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-semibold rounded-lg">
                    Save everything
                </Button>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur p-3">
                <div className="max-w-4xl mx-auto">
                    <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold rounded-lg">
                        Save everything
                    </Button>
                </div>
            </div>

            {/* Danger Zone - Delete Account */}
            <div className="space-y-6 pt-12 mt-12 border-t border-red-500/20">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 text-red-500 h-11 px-6 font-semibold"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                </Button>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-center text-xl text-foreground">Delete Account?</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            This action is <span className="text-red-400 font-semibold">permanent</span> and cannot be undone. 
                            All your data, including invoices, clients, products, and settings will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 my-4">
                        <p className="text-sm text-red-400 text-center">
                            You will lose access to all workspaces and data associated with this account.
                        </p>
                    </div>
                    <DialogFooter className="flex gap-3 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 border-border hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                setIsDeleting(true)
                                // In a real implementation, this would call an API to delete the account
                                toast.error("Account deletion is currently disabled", {
                                    description: "Please contact support@illumi.co.za to delete your account."
                                })
                                setIsDeleting(false)
                                setIsDeleteDialogOpen(false)
                            }}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-foreground"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

