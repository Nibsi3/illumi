"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useWorkspace } from "@/lib/workspace-context"

interface SettingsContextType {
    currency: string
    setCurrency: (currency: string) => void
    taxRate: number
    setTaxRate: (rate: number) => void
    dateFormat: string
    setDateFormat: (format: string) => void
    fromEmail: string
    setFromEmail: (email: string) => void
    sendInvoiceCopyToSelf: boolean
    setSendInvoiceCopyToSelf: (enabled: boolean) => void
    logo: string | null
    setLogo: (logo: string | null) => void
    companyName: string
    setCompanyName: (name: string) => void
    companyWebsite: string
    setCompanyWebsite: (website: string) => void
    companyAddress: string
    setCompanyNameAddress: (address: string) => void
    country: string
    setCountry: (country: string) => void
    activePaymentProvider: string | null
    setActivePaymentProvider: (providerId: string | null) => void
    connectedProviders: string[]
    setConnectedProviders: (providers: string[]) => void
    providerKeys: Record<string, any>
    setProviderKeys: (keys: Record<string, any>) => void
    billingMethods: any[]
    setBillingMethods: (methods: any[]) => void
}

const VAT_RATES: Record<string, number> = {
    "South Africa": 15,
    "Nigeria": 7.5,
    "Egypt": 14,
    "Algeria": 19,
    "Morocco": 20,
    "Ethiopia": 15,
    "Kenya": 16,
    "Tanzania": 18,
    "Ghana": 15,
    "Angola": 14
}

const COUNTRY_CURRENCIES: Record<string, string> = {
    "South Africa": "ZAR",
    "Nigeria": "NGN",
    "Egypt": "EGP",
    "Algeria": "DZD",
    "Morocco": "MAD",
    "Ethiopia": "ETB",
    "Kenya": "KES",
    "Tanzania": "TZS",
    "Ghana": "GHS",
    "Angola": "AOA"
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { activeWorkspace } = useWorkspace()
    const [currency, setCurrency] = useState("ZAR")
    const [taxRate, setTaxRate] = useState(15)
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
    const [fromEmail, setFromEmail] = useState("hello@illumi.co.za")
    const [sendInvoiceCopyToSelf, setSendInvoiceCopyToSelf] = useState(false)
    const [logo, setLogo] = useState<string | null>(null)
    const [companyName, setCompanyName] = useState("Illumi Professional")
    const [companyWebsite, setCompanyWebsite] = useState("")
    const [companyAddress, setCompanyNameAddress] = useState("")
    const [country, setCountry] = useState("South Africa")
    const [activePaymentProvider, setActivePaymentProvider] = useState<string | null>("payfast")
    const [connectedProviders, setConnectedProviders] = useState<string[]>(["payfast"])
    const [providerKeys, setProviderKeys] = useState<Record<string, any>>({})
    const [billingMethods, setBillingMethods] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isBillingLoaded, setIsBillingLoaded] = useState(false)

    const storageKey = activeWorkspace?.id
        ? `illumi_settings_${activeWorkspace.id}`
        : "illumi_settings"

    const handleSetCountry = (newCountry: string) => {
        setCountry(newCountry)
        const rate = VAT_RATES[newCountry]
        if (rate !== undefined) {
            setTaxRate(rate)
        }
        const curr = COUNTRY_CURRENCIES[newCountry]
        if (curr) {
            setCurrency(curr)
        }
    }

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            try {
                const storedSettings = localStorage.getItem(storageKey)
                if (storedSettings) {
                    const parsed = JSON.parse(storedSettings)
                    if (parsed.currency) setCurrency(parsed.currency)
                    if (parsed.taxRate !== undefined) setTaxRate(parsed.taxRate)
                    if (parsed.dateFormat) setDateFormat(parsed.dateFormat)
                    if (parsed.fromEmail) setFromEmail(parsed.fromEmail)
                    if (parsed.sendInvoiceCopyToSelf !== undefined) setSendInvoiceCopyToSelf(Boolean(parsed.sendInvoiceCopyToSelf))
                    if (parsed.logo) setLogo(parsed.logo)
                    if (parsed.companyName) setCompanyName(parsed.companyName)
                    if (parsed.companyWebsite !== undefined) setCompanyWebsite(parsed.companyWebsite)
                    if (parsed.companyAddress) setCompanyNameAddress(parsed.companyAddress)
                    if (parsed.country) setCountry(parsed.country)
                    if (parsed.activePaymentProvider) setActivePaymentProvider(parsed.activePaymentProvider)
                    if (parsed.connectedProviders) setConnectedProviders(parsed.connectedProviders)
                }
            } catch (e) {
                console.error("Failed to load settings", e)
            } finally {
                setIsLoaded(true)
            }
        }
        loadSettings()
    }, [storageKey])

    useEffect(() => {
        try {
            const stored = localStorage.getItem("illumi_billing")
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed.billingMethods)) {
                    setBillingMethods(parsed.billingMethods)
                }
            }
        } catch (e) {
            console.error("Failed to load billing", e)
        } finally {
            setIsBillingLoaded(true)
        }
    }, [])

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (!isLoaded) return
        const settings = {
            currency,
            taxRate,
            dateFormat,
            fromEmail,
            sendInvoiceCopyToSelf,
            logo,
            companyName,
            companyWebsite,
            companyAddress,
            country,
            activePaymentProvider,
            connectedProviders,
        }
        localStorage.setItem(storageKey, JSON.stringify(settings))
    }, [currency, taxRate, dateFormat, fromEmail, sendInvoiceCopyToSelf, logo, companyName, companyWebsite, companyAddress, country, activePaymentProvider, connectedProviders, isLoaded, storageKey])

    useEffect(() => {
        if (!isBillingLoaded) return
        localStorage.setItem("illumi_billing", JSON.stringify({ billingMethods }))
    }, [billingMethods, isBillingLoaded])

    return (
        <SettingsContext.Provider value={{
            currency, setCurrency,
            taxRate, setTaxRate,
            dateFormat, setDateFormat,
            fromEmail, setFromEmail,
            sendInvoiceCopyToSelf, setSendInvoiceCopyToSelf,
            logo, setLogo,
            companyName, setCompanyName,
            companyWebsite, setCompanyWebsite,
            companyAddress, setCompanyNameAddress,
            country, setCountry: handleSetCountry,
            activePaymentProvider, setActivePaymentProvider,
            connectedProviders, setConnectedProviders,
            providerKeys, setProviderKeys,
            billingMethods, setBillingMethods
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}
