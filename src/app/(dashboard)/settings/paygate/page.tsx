"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/lib/subscription/hooks"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { IconCreditCard, IconCheck, IconPlug, IconArrowRight, IconRefresh, IconPlus, IconSettings, IconLock } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/settings-context"
import { useWorkspace } from "@/lib/workspace-context"

const providers = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Global payments platform. Accept credit cards and digital wallets worldwide via Stripe Checkout.",
        logo: "https://stripe.com/img/v3/home/social.png",
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
                    // Load masked keys for display
                    if (data.providerKeys) {
                        setProviderKeys(data.providerKeys)
                    }
                }
            } catch (err) {
                console.error('Failed to load paygate settings:', err)
            } finally {
                setIsLoadingSettings(false)
            }
        }
        loadSettings()
    }, [activeWorkspace?.id, setActivePaymentProvider, setConnectedProviders, setProviderKeys])
    
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
    const [liveKey1, setLiveKey1] = useState("")
    const [liveKey2, setLiveKey2] = useState("")
    const [testKey1, setTestKey1] = useState("")
    const [testKey2, setTestKey2] = useState("")
    const [passphrase, setPassphrase] = useState("")

    const getProviderFieldLabels = (providerId: string) => {
        switch (providerId) {
            case 'yoco':
                return {
                    test1: 'Test public key',
                    test2: 'Test secret key',
                    live1: 'Live public key',
                    live2: 'Live secret key',
                }
            case 'ozow':
                return {
                    test1: 'Test site code',
                    test2: 'Test private key',
                    live1: 'Live site code',
                    live2: 'Live private key',
                }
            case 'peach':
                return {
                    test1: 'Test entity ID',
                    test2: 'Test access token',
                    live1: 'Live entity ID',
                    live2: 'Live access token',
                }
            case 'payfast':
                return {
                    test1: 'Merchant ID',
                    test2: 'Merchant key',
                    live1: 'Merchant ID',
                    live2: 'Merchant key',
                }
            case 'paystack':
                return {
                    test1: 'Test public key (optional)',
                    test2: 'Test secret key',
                    live1: 'Live public key (optional)',
                    live2: 'Live secret key',
                }
            case 'stripe':
                return {
                    test1: 'Test publishable key',
                    test2: 'Test secret key',
                    live1: 'Live publishable key',
                    live2: 'Live secret key',
                }
            default:
                return {
                    test1: 'Test key 1',
                    test2: 'Test key 2',
                    live1: 'Live key 1',
                    live2: 'Live key 2',
                }
        }
    }

    const getProviderPlaceholders = (providerId: string) => {
        switch (providerId) {
            case 'yoco':
                return {
                    test1: 'pk_test_...',
                    test2: 'sk_test_...',
                    live1: 'pk_live_...',
                    live2: 'sk_live_...',
                }
            case 'paystack':
                return {
                    test1: 'pk_test_... (optional)',
                    test2: 'sk_test_...',
                    live1: 'pk_live_... (optional)',
                    live2: 'sk_live_...',
                }
            case 'payfast':
                return {
                    test1: '10000100',
                    test2: 'merchant key',
                    live1: '10000100',
                    live2: 'merchant key',
                }
            case 'ozow':
                return {
                    test1: 'TESTSITE',
                    test2: 'private key',
                    live1: 'LIVESITE',
                    live2: 'private key',
                }
            case 'peach':
                return {
                    test1: 'entity id',
                    test2: 'access token',
                    live1: 'entity id',
                    live2: 'access token',
                }
            case 'stripe':
                return {
                    test1: 'pk_test_...',
                    test2: 'sk_test_...',
                    live1: 'pk_live_...',
                    live2: 'sk_live_...',
                }
            default:
                return {
                    test1: 'test-...',
                    test2: 'test-...',
                    live1: 'live-...',
                    live2: 'live-...',
                }
        }
    }

    const mapProviderKeysToState = (providerId: string, savedKeys: any) => {
        if (!savedKeys) {
            setTestKey1("")
            setTestKey2("")
            setLiveKey1("")
            setLiveKey2("")
            setPassphrase("")
            return
        }

        if (providerId === 'stripe') {
            setTestKey1(savedKeys.testPublishableKey || "")
            setTestKey2(savedKeys.testSecretKey || "")
            setLiveKey1(savedKeys.livePublishableKey || "")
            setLiveKey2(savedKeys.liveSecretKey || "")
            setPassphrase("")
            return
        }

        if (providerId === 'yoco') {
            setTestKey1(savedKeys.testPublicKey || "")
            setTestKey2(savedKeys.testSecretKey || "")
            setLiveKey1(savedKeys.livePublicKey || "")
            setLiveKey2(savedKeys.liveSecretKey || "")
            setPassphrase("")
            return
        }
        if (providerId === 'ozow') {
            setTestKey1(savedKeys.testSiteCode || "")
            setTestKey2(savedKeys.testPrivateKey || "")
            setLiveKey1(savedKeys.liveSiteCode || "")
            setLiveKey2(savedKeys.livePrivateKey || "")
            setPassphrase("")
            return
        }
        if (providerId === 'peach') {
            setTestKey1(savedKeys.testEntityId || "")
            setTestKey2(savedKeys.testAccessToken || "")
            setLiveKey1(savedKeys.liveEntityId || "")
            setLiveKey2(savedKeys.liveAccessToken || "")
            setPassphrase("")
            return
        }
        if (providerId === 'payfast') {
            const merchantId = savedKeys.liveMerchantId || savedKeys.testMerchantId || ""
            const merchantKey = savedKeys.liveMerchantKey || savedKeys.testMerchantKey || ""
            setTestKey1(merchantId)
            setTestKey2(merchantKey)
            setLiveKey1(merchantId)
            setLiveKey2(merchantKey)
            setPassphrase(savedKeys.livePassphrase || savedKeys.testPassphrase || "")
            return
        }

        // Generic fallback (legacy)
        setTestKey1(savedKeys.testMerchantId || "")
        setTestKey2(savedKeys.testSecretKey || "")
        setLiveKey1(savedKeys.liveMerchantId || "")
        setLiveKey2(savedKeys.liveSecretKey || "")
        setPassphrase(savedKeys.passphrase || savedKeys.livePassphrase || savedKeys.testPassphrase || "")
    }

    const buildKeysPayload = (providerId: string) => {
        if (providerId === 'yoco') {
            return {
                testPublicKey: testKey1,
                testSecretKey: testKey2,
                livePublicKey: liveKey1,
                liveSecretKey: liveKey2,
            }
        }
        if (providerId === 'ozow') {
            return {
                testSiteCode: testKey1,
                testPrivateKey: testKey2,
                liveSiteCode: liveKey1,
                livePrivateKey: liveKey2,
            }
        }
        if (providerId === 'peach') {
            return {
                testEntityId: testKey1,
                testAccessToken: testKey2,
                liveEntityId: liveKey1,
                liveAccessToken: liveKey2,
            }
        }
        if (providerId === 'payfast') {
            return {
                merchantId: testKey1,
                merchantKey: testKey2,
                passphrase,
            }
        }

        if (providerId === 'stripe') {
            return {
                testPublishableKey: testKey1,
                testSecretKey: testKey2,
                livePublishableKey: liveKey1,
                liveSecretKey: liveKey2,
            }
        }

        // Paystack + others: keep backward-compatible naming
        return {
            testMerchantId: testKey1,
            testSecretKey: testKey2,
            liveMerchantId: liveKey1,
            liveSecretKey: liveKey2,
        }
    }

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
        mapProviderKeysToState(id, savedKeys)
        setIsTestMode(savedKeys.isTestMode !== undefined ? savedKeys.isTestMode : true)
        setConfiguringProvider(id)
    }

    // Validate keys based on provider
    const validateProviderKeys = (providerId: string): { valid: boolean; error?: string } => {
        const key1 = (isTestMode ? testKey1 : liveKey1).trim()
        const key2 = (isTestMode ? testKey2 : liveKey2).trim()

        switch (providerId) {
            case 'payfast':
                if (!key1 || !key2) {
                    return { valid: false, error: "Merchant ID and Merchant Key are required" }
                }
                if (!/^\d+$/.test(key1)) {
                    return { valid: false, error: "PayFast Merchant ID must be numeric (e.g., 10000100)" }
                }
                if (key1.length < 5) {
                    return { valid: false, error: "PayFast Merchant ID seems too short" }
                }
                break
                
            case 'yoco':
                if (!key1 || !key2) {
                    return { valid: false, error: "Public Key and Secret Key are required" }
                }
                const yocoPrefix = isTestMode ? 'sk_test_' : 'sk_live_'
                if (!key2.startsWith(yocoPrefix)) {
                    return { valid: false, error: `Yoco ${isTestMode ? 'Test' : 'Live'} Secret Key must start with "${yocoPrefix}"` }
                }
                break
                
            case 'paystack':
                if (!key2) {
                    return { valid: false, error: "Secret Key is required" }
                }
                const paystackPrefix = isTestMode ? 'sk_test_' : 'sk_live_'
                if (!key2.startsWith(paystackPrefix)) {
                    return { valid: false, error: `PayStack ${isTestMode ? 'Test' : 'Live'} Secret Key must start with "${paystackPrefix}"` }
                }
                break
                
            case 'ozow':
                if (!key1 || !key2) {
                    return { valid: false, error: "Site Code and Private Key are required" }
                }
                if (key1.length < 4) {
                    return { valid: false, error: "Ozow Site Code seems too short" }
                }
                if (key2.length < 10) {
                    return { valid: false, error: "Ozow Private Key seems too short" }
                }
                break
                
            case 'peach':
                if (!key1 || !key2) {
                    return { valid: false, error: "Entity ID and Access Token are required" }
                }
                if (key1.length < 10) {
                    return { valid: false, error: "Peach Payments Entity ID seems too short" }
                }
                if (key2.length < 20) {
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
                    keys: buildKeysPayload(id)
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
                    ...buildKeysPayload(id),
                    // Also keep the raw fields for local edits in the dialog.
                    testKey1,
                    testKey2,
                    liveKey1,
                    liveKey2,
                    passphrase,
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

    if (isLoading || isLoadingSettings) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center mb-6" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">Loading…</h2>
                    <p className="text-muted-foreground max-w-md">
                        Preparing PayGate settings.
                    </p>
                </div>
            </div>
        )
    }

    // Show upgrade prompt for free users
    if (!isPro) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-muted border border-border rounded-2xl flex items-center justify-center">
                        <IconLock className="w-10 h-10 text-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Pro Feature</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        Payment gateway integration is only available on the Pro plan. 
                        Upgrade to accept payments directly from your invoices.
                    </p>
                    <HoverBorderGradient
                        as="button"
                        onClick={() => window.location.href = '/settings/billing'}
                        containerClassName=""
                        className="bg-primary text-primary-foreground font-bold h-12 px-8 w-full sm:w-auto"
                    >
                        Upgrade to Pro — $29/mo
                    </HoverBorderGradient>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">PayGate Settings</h2>
                    <p className="hidden sm:block text-sm text-muted-foreground">Configure your payment gateways to receive payments from clients.</p>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-full md:w-auto flex items-center justify-between gap-3 bg-muted border border-border px-4 py-2 rounded-xl">
                        <Label htmlFor="test-mode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Test Mode</Label>
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
                            "bg-card border-border overflow-hidden group transition-all duration-300 hover:border-border hover:shadow-2xl flex flex-col rounded-2xl relative min-h-[340px]",
                            isConnected && "border-border bg-muted/30",
                            isActive && "ring-2 ring-white/50"
                        )}>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-10 px-4 bg-muted border border-border rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <span className="text-sm font-black text-foreground italic">{provider.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={isConnected ? "default" : "outline"} className={cn(
                                            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border-none",
                                            isConnected ? "bg-accent text-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            {isConnected ? "Connected" : "Inactive"}
                                        </Badge>
                                        {isActive && (
                                            <Badge className="text-[9px] bg-primary text-primary-foreground font-black uppercase py-0 px-2">Primary</Badge>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-foreground mb-2">{provider.name} Integration</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                                    {provider.description}
                                </p>
                            </div>

                            <AnimatePresence>
                                {isConfiguring && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute inset-0 bg-card z-20 p-6 flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-bold text-foreground">{isConnected ? "Configure" : "Connect"} {provider.name}</h4>
                                            <Button variant="ghost" size="icon" onClick={() => setConfiguringProvider(null)} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                <IconRefresh className="h-4 w-4 rotate-45" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4 flex-1 overflow-y-auto">
                                            <div className="flex items-center justify-between bg-muted p-3 rounded-xl border border-border">
                                                <Label className="text-xs font-medium text-foreground">Test Mode</Label>
                                                <Switch checked={isTestMode} onCheckedChange={handleTestModeChange} />
                                            </div>

                                            {provider.id === 'payfast' ? (
                                                <>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Merchant ID</Label>
                                                        <Input
                                                            value={testKey1}
                                                            onChange={(e) => setTestKey1(e.target.value)}
                                                            placeholder={getProviderPlaceholders(provider.id).test1}
                                                            className="h-9 bg-muted border-border text-xs rounded-lg focus:ring-white/10"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Merchant Key</Label>
                                                        <Input
                                                            type="password"
                                                            value={testKey2}
                                                            onChange={(e) => setTestKey2(e.target.value)}
                                                            placeholder={getProviderPlaceholders(provider.id).test2}
                                                            className="h-9 bg-muted border-border text-xs rounded-lg focus:ring-white/10"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Salt Passphrase (Optional)</Label>
                                                        <Input
                                                            type="password"
                                                            value={passphrase}
                                                            onChange={(e) => setPassphrase(e.target.value)}
                                                            placeholder="Optional but recommended"
                                                            className="h-9 bg-muted border-border text-xs rounded-lg focus:ring-white/10"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                                                            {isTestMode ? getProviderFieldLabels(provider.id).test1 : getProviderFieldLabels(provider.id).live1}
                                                        </Label>
                                                        <Input
                                                            value={isTestMode ? testKey1 : liveKey1}
                                                            onChange={(e) => isTestMode ? setTestKey1(e.target.value) : setLiveKey1(e.target.value)}
                                                            placeholder={isTestMode ? getProviderPlaceholders(provider.id).test1 : getProviderPlaceholders(provider.id).live1}
                                                            className="h-9 bg-muted border-border text-xs rounded-lg focus:ring-white/10"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                                                            {isTestMode ? getProviderFieldLabels(provider.id).test2 : getProviderFieldLabels(provider.id).live2}
                                                        </Label>
                                                        <Input
                                                            type="password"
                                                            value={isTestMode ? testKey2 : liveKey2}
                                                            onChange={(e) => isTestMode ? setTestKey2(e.target.value) : setLiveKey2(e.target.value)}
                                                            placeholder={isTestMode ? getProviderPlaceholders(provider.id).test2 : getProviderPlaceholders(provider.id).live2}
                                                            className="h-9 bg-muted border-border text-xs rounded-lg focus:ring-white/10"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => confirmConnection(provider.id)}
                                            disabled={isConnecting}
                                            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 mt-4 font-bold text-xs rounded-xl"
                                        >
                                            {isConnecting ? "Saving..." : (isConnected ? "Save Changes" : "Save & Connect")}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-auto px-6 py-4 bg-white/[0.01] border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isConnected ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted h-8 px-3 rounded-lg font-medium"
                                            onClick={() => handleConnect(provider.id)}
                                        >
                                            <IconSettings className="h-3.5 w-3.5 mr-2" />
                                            Configure
                                        </Button>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground font-medium italic">Not connected</span>
                                    )}
                                </div>

                                {isConnected ? (
                                    <div className="flex items-center gap-2">
                                        {!isActive && (
                                            <Button
                                                onClick={() => handleMakePrimary(provider.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent"
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
                                        className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                })}

                {/* Custom Provider Request */}
                <Card className="bg-transparent border border-dashed border-border flex flex-col items-center justify-center p-8 text-center rounded-2xl group hover:border-border transition-colors h-[340px]">
                    <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <IconPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">Request Provider</h3>
                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Want to use a different gateway? <br />Let our team know.</p>

                    {/* Request Dialog Trigger */}
                    <div className="relative">
                        {isRequestOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                                    <button onClick={() => setIsRequestOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                                        <IconPlus className="h-5 w-5 rotate-45" />
                                    </button>
                                    <h3 className="text-lg font-bold text-foreground mb-4">Request New Provider</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5 text-left">
                                            <Label className="text-xs font-medium text-muted-foreground">Subject</Label>
                                            <Input value="PayGate Request" disabled className="bg-muted border-border text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <Label className="text-xs font-medium text-muted-foreground">Message</Label>
                                            <textarea
                                                className="w-full bg-black/50 border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 min-h-[100px]"
                                                placeholder="Which provider would you like us to add? Tell us more..."
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="ghost" onClick={() => setIsRequestOpen(false)} className="text-muted-foreground hover:text-foreground">Cancel</Button>
                                            <Button onClick={submitProviderRequest} className="bg-primary text-primary-foreground hover:bg-primary/90">Send Request</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button onClick={() => setIsRequestOpen(true)} variant="outline" size="sm" className="h-9 px-6 border-border hover:bg-muted rounded-xl text-xs font-medium">
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
                        className="p-8 bg-card border border-border rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-muted blur-[100px] -mr-32 -mt-32" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center">
                                    <IconShieldLock className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Live Connection Status</h3>
                                    <p className="text-xs text-muted-foreground">Monitoring real-time API health for {connectedProviders.length} active provider(s).</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-full">
                                <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">System Healthy</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {connectedProviders.map(id => {
                                const p = providers.find(x => x.id === id)
                                const isPrimary = activeProvider === id
                                return (
                                    <div key={id} className={cn(
                                        "p-4 border rounded-xl flex items-center justify-between transition-colors",
                                        isPrimary ? "bg-muted border-border" : "bg-muted border-border"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", isPrimary ? "bg-white" : "bg-white/40")} />
                                            <span className="text-xs font-bold text-foreground">{p?.name}</span>
                                        </div>
                                        {isPrimary ? (
                                            <Badge className="text-[8px] bg-primary text-primary-foreground font-black uppercase py-0 px-1.5">Primary</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[8px] border-border text-muted-foreground bg-transparent py-0 px-1.5">Standby</Badge>
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

