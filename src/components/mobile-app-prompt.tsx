"use client"

import { useState, useEffect } from "react"
import { X, Smartphone, Download, Apple, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PROMPT_DELAY_MS = 45000 // 45 seconds
const DISMISS_KEY = "illumi_mobile_prompt_dismissed"
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function MobileAppPrompt() {
    const [isVisible, setIsVisible] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isAndroid, setIsAndroid] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstalling, setIsInstalling] = useState(false)

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return

        // Check if on mobile
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent)
        
        if (!isMobile) return

        // Check platform
        const ios = /iphone|ipad|ipod/i.test(userAgent)
        const android = /android/i.test(userAgent)
        setIsIOS(ios)
        setIsAndroid(android)

        // Check if already installed as PWA
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches
        if (isStandalone) return

        // Check if dismissed recently
        const dismissedAt = localStorage.getItem(DISMISS_KEY)
        if (dismissedAt) {
            const dismissedTime = parseInt(dismissedAt, 10)
            if (Date.now() - dismissedTime < DISMISS_DURATION_MS) {
                return
            }
        }

        // Listen for the beforeinstallprompt event (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

        // Show prompt after delay
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, PROMPT_DELAY_MS)

        return () => {
            clearTimeout(timer)
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem(DISMISS_KEY, Date.now().toString())
    }

    const handleInstall = async () => {
        if (deferredPrompt) {
            setIsInstalling(true)
            try {
                await deferredPrompt.prompt()
                const choice = await deferredPrompt.userChoice
                if (choice.outcome === "accepted") {
                    handleDismiss()
                }
            } catch (err) {
                console.error("Install prompt error:", err)
            } finally {
                setIsInstalling(false)
                setDeferredPrompt(null)
            }
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                onClick={handleDismiss}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-6 pt-8">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Smartphone className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-center mb-2">
                        Get the Illumi App
                    </h2>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        Create and manage invoices faster with our mobile app. Works offline and sends you notifications.
                    </p>

                    {/* iOS Instructions */}
                    {isIOS && (
                        <div className="bg-muted/50 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
                                    <Apple className="h-4 w-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium mb-1">Install on iPhone/iPad</p>
                                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside text-xs">
                                        <li>Tap the <Share className="h-3 w-3 inline mx-0.5" /> Share button below</li>
                                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                                        <li>Tap <strong>"Add"</strong> in the top right</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Android Install Button */}
                    {isAndroid && deferredPrompt && (
                        <Button
                            onClick={handleInstall}
                            disabled={isInstalling}
                            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2"
                        >
                            <Download className="h-5 w-5" />
                            {isInstalling ? "Installing..." : "Install App"}
                        </Button>
                    )}

                    {/* Android fallback instructions */}
                    {isAndroid && !deferredPrompt && (
                        <div className="bg-muted/50 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
                                    <Smartphone className="h-4 w-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium mb-1">Install on Android</p>
                                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside text-xs">
                                        <li>Tap the menu <strong>(⋮)</strong> in your browser</li>
                                        <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                                        <li>Follow the prompts to install</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Maybe later button */}
                    <Button
                        variant="ghost"
                        onClick={handleDismiss}
                        className="w-full mt-3 text-muted-foreground hover:text-foreground"
                    >
                        Maybe later
                    </Button>

                    {/* Features list */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="text-xs">
                                <div className="text-lg mb-1">📱</div>
                                <span className="text-muted-foreground">Works Offline</span>
                            </div>
                            <div className="text-xs">
                                <div className="text-lg mb-1">🔔</div>
                                <span className="text-muted-foreground">Notifications</span>
                            </div>
                            <div className="text-xs">
                                <div className="text-lg mb-1">⚡</div>
                                <span className="text-muted-foreground">Fast & Light</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
