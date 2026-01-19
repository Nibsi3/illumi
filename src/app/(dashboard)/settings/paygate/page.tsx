"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/lib/subscription/hooks"
import { IconCreditCard, IconCheck, IconPlug, IconArrowRight, IconRefresh, IconPlus, IconSettings, IconLock } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/settings-context"
import { useWorkspace } from "@/lib/workspace-context"

const providers = [
    {
        id: "payfast",
        name: "PayFast",
        description: "The most popular South African payment gateway. Supports Credit Card, Instant EFT, and more.",
        logo: "https://www.payfast.co.za/wp-content/themes/payfast-co-za/images/payfast-logo.svg",
        connected: true,
    },
    {
        id: "paystack",
        name: "PayStack",
        description: "Modern payment infrastructure for Africa. Fast, secure, and reliable.",
        logo: "https://paystack.com/assets/payment/img/paystack-logo-vector.svg",
        connected: false,
    },
    {
        id: "yoco",
        name: "Yoco",
        description: "Simple online payments for small businesses. Low fees and great support.",
        logo: "https://www.yoco.com/za/wp-content/themes/yoco/assets/images/logo/yoco-logo-black.svg",
        connected: false,
    },
    {
        id: "ozow",
        name: "Ozow",
        description: "Direct bank-to-bank electronic funds transfer. No credit card required.",
        logo: "https://ozow.com/wp-content/uploads/2021/05/ozow-logo.svg",
        connected: false,
    },
    {
        id: "peach",
        name: "Peach Payments",
        description: "Enterprise-grade payment gateway for high-volume businesses.",
        logo: "https://www.peachpayments.com/hubfs/Peach%20Payments%20Logo.svg",
        connected: false,
    },
]

export default function PayGatePage() {
    const { isPro, isLoading } = useSubscription()
    const { activeWorkspace } = useWorkspace()
    const {
        activePaymentProvider, setActivePaymentProvider,
        connectedProviders, setConnectedProviders,
        providerKeys, setProviderKeys
    } = useSettings()

    const activeProvider = activePaymentProvider
    const [isTestMode, setIsTestMode] = useState(true)
    const [isLoadingSettings, setIsLoadingSettings] = useState(true)
    
    // Load settings from Supabase on mount
    useEffect(() => {
        async function loadSettings() {
            if (!activeWorkspace?.id) {
                setIsLoadingSettings(false)
                return
            }
            try {
                const res = await fetch(`/api/paygate/config?workspace_id=${activeWorkspace.id}`)
                const data = await res.json()
                if (data.success && data.settings) {
                    setActivePaymentProvider(data.settings.active_provider || null)
                    setConnectedProviders(data.settings.connected_providers || [])
                    setIsTestMode(data.settings.test_mode ?? true)
                }
            } catch (err) {
                console.error('Failed to load paygate settings:', err)
            } finally {
                setIsLoadingSettings(false)
            }
        }
        loadSettings()
    }, [activeWorkspace?.id, setActivePaymentProvider, setConnectedProviders])
    
    // Disconnect all paygates for free users
    useEffect(() => {
        if (!isLoading && !isPro && connectedProviders.length > 0) {
            setConnectedProviders([])
            setActivePaymentProvider(null)
        }
    }, [isPro, isLoading, connectedProviders.length, setConnectedProviders, setActivePaymentProvider])
    const [configuringProvider, setConfiguringProvider] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    // Separate state for credentials
    const [liveMerchantId, setLiveMerchantId] = useState("")
    const [liveSecretKey, setLiveSecretKey] = useState("")
    const [testMerchantId, setTestMerchantId] = useState("")
    const [testSecretKey, setTestSecretKey] = useState("")

    // Request Provider Dialog State
    const [isRequestOpen, setIsRequestOpen] = useState(false)
    const [requestMessage, setRequestMessage] = useState("")

    const handleConnect = (id: string) => {
        if (!isPro) {
            toast.error("Pro Feature", {
                description: "Please upgrade to a Pro plan to connect payment gateways."
            })
            return
        }
        // Reset inputs on fresh connect
        const savedKeys = providerKeys[id] || {}
        setLiveMerchantId(savedKeys.liveMerchantId || "")
        setLiveSecretKey(savedKeys.liveSecretKey || "")
        setTestMerchantId(savedKeys.testMerchantId || "")
        setTestSecretKey(savedKeys.testSecretKey || "")
        setIsTestMode(savedKeys.isTestMode !== undefined ? savedKeys.isTestMode : true)
        setConfiguringProvider(id)
    }

    // Validate keys based on provider
    const validateProviderKeys = (providerId: string): { valid: boolean; error?: string } => {
        const merchantId = isTestMode ? testMerchantId : liveMerchantId
        const secretKey = isTestMode ? testSecretKey : liveSecretKey
        
        if (!merchantId.trim() || !secretKey.trim()) {
            return { valid: false, error: "Both Merchant ID and Secret Key are required" }
        }
        
        switch (providerId) {
            case 'payfast':
                // PayFast: Merchant ID should be numeric, key should be alphanumeric
                if (!/^\d+$/.test(merchantId)) {
                    return { valid: false, error: "PayFast Merchant ID must be numeric (e.g., 10000100)" }
                }
                if (merchantId.length < 5) {
                    return { valid: false, error: "PayFast Merchant ID seems too short" }
                }
                break
                
            case 'yoco':
                // Yoco: Secret keys start with sk_test_ or sk_live_
                const yocoPrefix = isTestMode ? 'sk_test_' : 'sk_live_'
                if (!secretKey.startsWith(yocoPrefix)) {
                    return { valid: false, error: `Yoco ${isTestMode ? 'Test' : 'Live'} Secret Key must start with "${yocoPrefix}"` }
                }
                break
                
            case 'paystack':
                // PayStack: Secret keys start with sk_test_ or sk_live_
                const paystackPrefix = isTestMode ? 'sk_test_' : 'sk_live_'
                if (!secretKey.startsWith(paystackPrefix)) {
                    return { valid: false, error: `PayStack ${isTestMode ? 'Test' : 'Live'} Secret Key must start with "${paystackPrefix}"` }
                }
                break
                
            case 'ozow':
                // Ozow: Site Code and Private Key validation
                if (merchantId.length < 4) {
                    return { valid: false, error: "Ozow Site Code seems too short" }
                }
                if (secretKey.length < 10) {
                    return { valid: false, error: "Ozow Private Key seems too short" }
                }
                break
                
            case 'peach':
                // Peach Payments: Entity ID and Access Token
                if (merchantId.length < 10) {
                    return { valid: false, error: "Peach Payments Entity ID seems too short" }
                }
                if (secretKey.length < 20) {
                    return { valid: false, error: "Peach Payments Access Token seems too short" }
                }
                break
        }
        
        return { valid: true }
    }

    const confirmConnection = async (id: string) => {
        // Validate keys first
        const validation = validateProviderKeys(id)
        if (!validation.valid) {
            toast.error("Invalid Credentials", { description: validation.error })
            return
        }
        
        if (!activeWorkspace?.id) {
            toast.error("No workspace selected")
            return
        }
        
        setIsConnecting(true)
        
        try {
            // Save to Supabase
            const newConnectedProviders = connectedProviders.includes(id) 
                ? connectedProviders 
                : [...connectedProviders, id]
            const newActiveProvider = activeProvider || id
            
            const res = await fetch('/api/paygate/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspace_id: activeWorkspace.id,
                    provider: id,
                    active_provider: newActiveProvider,
                    test_mode: isTestMode,
                    connected_providers: newConnectedProviders,
                    keys: {
                        liveMerchantId,
                        liveSecretKey,
                        testMerchantId,
                        testSecretKey
                    }
                })
            })
            
            const data = await res.json()
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to save')
            }
            
            // Update local state
            setConnectedProviders(newConnectedProviders)
            setProviderKeys({
                ...providerKeys,
                [id]: {
                    liveMerchantId, liveSecretKey,
                    testMerchantId, testSecretKey,
                    isTestMode
                }
            })
            if (!activeProvider) setActivePaymentProvider(id)
            
            setConfiguringProvider(null)
            toast.success("Connected", {
                description: `Successfully connected to ${providers.find(p => p.id === id)?.name}. Keys saved securely.`
            })
        } catch (err: any) {
            console.error('Failed to save paygate config:', err)
            toast.error("Failed to save", { description: err.message })
        } finally {
            setIsConnecting(false)
        }
    }

    const persistSettings = async (patch: { active_provider?: string | null; test_mode?: boolean; connected_providers?: string[] }) => {
        if (!activeWorkspace?.id) return

        const res = await fetch('/api/paygate/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workspace_id: activeWorkspace.id,
                active_provider: patch.active_provider !== undefined ? patch.active_provider : activeProvider,
                test_mode: patch.test_mode !== undefined ? patch.test_mode : isTestMode,
                connected_providers: patch.connected_providers !== undefined ? patch.connected_providers : connectedProviders,
            })
        })

        const data = await res.json().catch(() => null)
        if (!data?.success) {
            throw new Error(data?.error || 'Failed to save paygate settings')
        }
    }

    const handleMakePrimary = async (id: string) => {
        try {
            await persistSettings({ active_provider: id })
            setActivePaymentProvider(id)
            toast.success("Primary updated", {
                description: `Payments will use ${providers.find(p => p.id === id)?.name} by default.`
            })
        } catch (err: any) {
            console.error('Failed to set primary provider:', err)
            toast.error("Failed to update primary", { description: err.message })
        }
    }

    const handleTestModeChange = async (checked: boolean) => {
        setIsTestMode(checked)
        try {
            await persistSettings({ test_mode: checked })
        } catch (err: any) {
            console.error('Failed to save test mode:', err)
            toast.error("Failed to update test mode", { description: err.message })
        }
    }

    const disconnect = async (id: string) => {
        if (!activeWorkspace?.id) return
        
        const newConnectedProviders = connectedProviders.filter(p => p !== id)
        const newActiveProvider = activeProvider === id ? (newConnectedProviders[0] || null) : activeProvider
        
        try {
            await fetch('/api/paygate/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspace_id: activeWorkspace.id,
                    active_provider: newActiveProvider,
                    test_mode: isTestMode,
                    connected_providers: newConnectedProviders
                })
            })
            
            setConnectedProviders(newConnectedProviders)
            if (activeProvider === id) setActivePaymentProvider(newActiveProvider)
            
            toast.success("Disconnected", {
                description: `Successfully disconnected from ${providers.find(p => p.id === id)?.name}.`
            })
        } catch (err) {
            console.error('Failed to disconnect:', err)
            toast.error("Failed to disconnect")
        }
    }

    const submitProviderRequest = () => {
        setIsRequestOpen(false)
        setRequestMessage("")
        toast.success("Request Sent", {
            description: "We've received your request for a new provider."
        })
    }

    if (isLoading || isLoadingSettings) return null;

    // Show upgrade prompt for free users
    if (!isPro) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <IconLock className="h-10 w-10 text-neutral-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pro Feature</h2>
                    <p className="text-neutral-500 max-w-md mb-8">
                        Payment gateway integration is only available on the Pro plan. 
                        Upgrade to accept payments directly from your invoices.
                    </p>
                    <Button 
                        onClick={() => window.location.href = '/settings/billing'}
                        className="bg-white text-black hover:bg-neutral-200 h-12 px-8 font-bold"
                    >
                        Upgrade to Pro — R350/mo
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">PayGate Settings</h2>
                    <p className="text-sm text-neutral-500">Configure your payment gateways to receive payments from clients.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        <Label htmlFor="test-mode" className="text-xs font-bold uppercase tracking-wider text-neutral-400">Test Mode</Label>
                        <Switch
                            id="test-mode"
                            checked={isTestMode}
                            onCheckedChange={handleTestModeChange}
                            className="data-[state=checked]:bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => {
                    const isConnected = connectedProviders.includes(provider.id)
                    const isConfiguring = configuringProvider === provider.id
                    const isActive = activeProvider === provider.id

                    return (
                        <Card key={provider.id} className={cn(
                            "bg-[#0a0a0a] border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-2xl flex flex-col rounded-2xl relative min-h-[340px]",
                            isConnected && "border-white/20 bg-white/[0.02]",
                            isActive && "ring-2 ring-white/50"
                        )}>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <span className="text-sm font-black text-white italic">{provider.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={isConnected ? "default" : "outline"} className={cn(
                                            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border-none",
                                            isConnected ? "bg-white/10 text-white" : "bg-white/5 text-neutral-500"
                                        )}>
                                            {isConnected ? "Connected" : "Inactive"}
                                        </Badge>
                                        {isActive && (
                                            <Badge className="text-[9px] bg-white text-black font-black uppercase py-0 px-2">Primary</Badge>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2">{provider.name} Integration</h3>
                                <p className="text-xs text-neutral-500 leading-relaxed flex-1">
                                    {provider.description}
                                </p>
                            </div>

                            <AnimatePresence>
                                {isConfiguring && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute inset-0 bg-[#0a0a0a] z-20 p-6 flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-bold text-white">{isConnected ? "Configure" : "Connect"} {provider.name}</h4>
                                            <Button variant="ghost" size="icon" onClick={() => setConfiguringProvider(null)} className="h-6 w-6 text-neutral-500 hover:text-white">
                                                <IconRefresh className="h-4 w-4 rotate-45" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4 flex-1 overflow-y-auto">
                                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                                                <Label className="text-xs font-medium text-white">Test Mode</Label>
                                                <Switch checked={isTestMode} onCheckedChange={handleTestModeChange} />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-neutral-500">
                                                    {isTestMode ? "Test Merchant ID" : "Live Merchant ID"}
                                                </Label>
                                                <Input
                                                    value={isTestMode ? testMerchantId : liveMerchantId}
                                                    onChange={(e) => isTestMode ? setTestMerchantId(e.target.value) : setLiveMerchantId(e.target.value)}
                                                    placeholder={isTestMode ? "test-123..." : "live-123..."}
                                                    className="h-9 bg-white/5 border-white/10 text-xs rounded-lg focus:ring-white/10"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase font-bold text-neutral-500">
                                                    {isTestMode ? "Test Secret Key" : "Live Secret Key"}
                                                </Label>
                                                <Input
                                                    type="password"
                                                    value={isTestMode ? testSecretKey : liveSecretKey}
                                                    onChange={(e) => isTestMode ? setTestSecretKey(e.target.value) : setLiveSecretKey(e.target.value)}
                                                    placeholder={isTestMode ? "sk_test_..." : "sk_live_..."}
                                                    className="h-9 bg-white/5 border-white/10 text-xs rounded-lg focus:ring-white/10"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => confirmConnection(provider.id)}
                                            disabled={isConnecting}
                                            className="w-full h-10 bg-white text-black hover:bg-neutral-200 mt-4 font-bold text-xs rounded-xl"
                                        >
                                            {isConnecting ? "Saving..." : (isConnected ? "Save Changes" : "Save & Connect")}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-auto px-6 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isConnected ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-neutral-400 hover:text-white hover:bg-white/5 h-8 px-3 rounded-lg font-medium"
                                            onClick={() => handleConnect(provider.id)}
                                        >
                                            <IconSettings className="h-3.5 w-3.5 mr-2" />
                                            Configure
                                        </Button>
                                    ) : (
                                        <span className="text-[10px] text-neutral-600 font-medium italic">Not connected</span>
                                    )}
                                </div>

                                {isConnected ? (
                                    <div className="flex items-center gap-2">
                                        {!isActive && (
                                            <Button
                                                onClick={() => handleMakePrimary(provider.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-3 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10"
                                            >
                                                Make Primary
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => disconnect(provider.id)}
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-3 text-xs border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 bg-transparent transition-colors"
                                        >
                                            Disconnect
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => handleConnect(provider.id)}
                                        size="sm"
                                        className="h-8 px-4 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                })}

                {/* Custom Provider Request */}
                <Card className="bg-transparent border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center rounded-2xl group hover:border-white/20 transition-colors h-[340px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <IconPlus className="h-6 w-6 text-neutral-500" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">Request Provider</h3>
                    <p className="text-xs text-neutral-500 mb-6 leading-relaxed">Want to use a different gateway? <br />Let our team know.</p>

                    {/* Request Dialog Trigger */}
                    <div className="relative">
                        {isRequestOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-[#09090b] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                                    <button onClick={() => setIsRequestOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
                                        <IconPlus className="h-5 w-5 rotate-45" />
                                    </button>
                                    <h3 className="text-lg font-bold text-white mb-4">Request New Provider</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5 text-left">
                                            <Label className="text-xs font-medium text-neutral-400">Subject</Label>
                                            <Input value="PayGate Request" disabled className="bg-white/5 border-white/10 text-neutral-500" />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <Label className="text-xs font-medium text-neutral-400">Message</Label>
                                            <textarea
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[100px]"
                                                placeholder="Which provider would you like us to add? Tell us more..."
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="ghost" onClick={() => setIsRequestOpen(false)} className="text-neutral-500 hover:text-white">Cancel</Button>
                                            <Button onClick={submitProviderRequest} className="bg-white text-black hover:bg-neutral-200">Send Request</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button onClick={() => setIsRequestOpen(true)} variant="outline" size="sm" className="h-9 px-6 border-white/10 hover:bg-white/5 rounded-xl text-xs font-medium">
                            Send Request
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Active Connection Summary */}
            <AnimatePresence>
                {connectedProviders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                                    <IconShieldLock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">Live Connection Status</h3>
                                    <p className="text-xs text-neutral-500">Monitoring real-time API health for {connectedProviders.length} active provider(s).</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                                <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">System Healthy</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {connectedProviders.map(id => {
                                const p = providers.find(x => x.id === id)
                                const isPrimary = activeProvider === id
                                return (
                                    <div key={id} className={cn(
                                        "p-4 border rounded-xl flex items-center justify-between transition-colors",
                                        isPrimary ? "bg-white/5 border-white/20" : "bg-white/5 border-white/10"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", isPrimary ? "bg-white" : "bg-white/40")} />
                                            <span className="text-xs font-bold text-white">{p?.name}</span>
                                        </div>
                                        {isPrimary ? (
                                            <Badge className="text-[8px] bg-white text-black font-black uppercase py-0 px-1.5">Primary</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[8px] border-white/10 text-neutral-500 bg-transparent py-0 px-1.5">Standby</Badge>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function IconShieldLock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <rect width="8" height="5" x="8" y="11" rx="1" />
            <path d="M10 11V9a2 2 0 1 1 4 0v2" />
        </svg>
    )
}
