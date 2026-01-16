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
    const [isLoaded, setIsLoaded] = useState(false)

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
            companyAddress
        }
        localStorage.setItem("illumi_settings", JSON.stringify(settings))
    }, [currency, taxRate, dateFormat, fromEmail, logo, companyName, companyAddress, isLoaded])

    return (
        <SettingsContext.Provider value={{
            currency, setCurrency,
            taxRate, setTaxRate,
            dateFormat, setDateFormat,
            fromEmail, setFromEmail,
            logo, setLogo,
            companyName, setCompanyName,
            companyAddress, setCompanyNameAddress
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
