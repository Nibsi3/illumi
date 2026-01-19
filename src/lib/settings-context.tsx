"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface SettingsContextType {
    currency: string
    setCurrency: (currency: string) => void
    taxRate: number
    setTaxRate: (rate: number) => void
    dateFormat: string
    setDateFormat: (format: string) => void
    fromEmail: string
    setFromEmail: (email: string) => void
    logo: string | null
    setLogo: (logo: string | null) => void
    companyName: string
    setCompanyName: (name: string) => void
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
    const [currency, setCurrency] = useState("ZAR")
    const [taxRate, setTaxRate] = useState(15)
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
    const [fromEmail, setFromEmail] = useState("hello@illumi.co.za")
    const [logo, setLogo] = useState<string | null>(null)
    const [companyName, setCompanyName] = useState("Illumi Professional")
    const [companyAddress, setCompanyNameAddress] = useState("")
    const [country, setCountry] = useState("South Africa")
    const [activePaymentProvider, setActivePaymentProvider] = useState<string | null>("payfast")
    const [connectedProviders, setConnectedProviders] = useState<string[]>(["payfast"])
    const [providerKeys, setProviderKeys] = useState<Record<string, any>>({})
    const [billingMethods, setBillingMethods] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

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
                const storedSettings = localStorage.getItem("illumi_settings")
                if (storedSettings) {
                    const parsed = JSON.parse(storedSettings)
                    if (parsed.currency) setCurrency(parsed.currency)
                    if (parsed.taxRate !== undefined) setTaxRate(parsed.taxRate)
                    if (parsed.dateFormat) setDateFormat(parsed.dateFormat)
                    if (parsed.fromEmail) setFromEmail(parsed.fromEmail)
                    if (parsed.logo) setLogo(parsed.logo)
                    if (parsed.companyName) setCompanyName(parsed.companyName)
                    if (parsed.companyAddress) setCompanyNameAddress(parsed.companyAddress)
                    if (parsed.country) setCountry(parsed.country)
                    if (parsed.activePaymentProvider) setActivePaymentProvider(parsed.activePaymentProvider)
                    if (parsed.connectedProviders) setConnectedProviders(parsed.connectedProviders)
                    if (parsed.providerKeys) setProviderKeys(parsed.providerKeys)
                    if (parsed.billingMethods) setBillingMethods(parsed.billingMethods)
                }
            } catch (e) {
                console.error("Failed to load settings", e)
            } finally {
                setIsLoaded(true)
            }
        }
        loadSettings()
    }, [])

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (!isLoaded) return
        const settings = {
            currency,
            taxRate,
            dateFormat,
            fromEmail,
            logo,
            companyName,
            companyAddress,
            country,
            activePaymentProvider,
            connectedProviders,
            providerKeys,
            billingMethods
        }
        localStorage.setItem("illumi_settings", JSON.stringify(settings))
    }, [currency, taxRate, dateFormat, fromEmail, logo, companyName, companyAddress, country, activePaymentProvider, connectedProviders, providerKeys, billingMethods, isLoaded])

    return (
        <SettingsContext.Provider value={{
            currency, setCurrency,
            taxRate, setTaxRate,
            dateFormat, setDateFormat,
            fromEmail, setFromEmail,
            logo, setLogo,
            companyName, setCompanyName,
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
