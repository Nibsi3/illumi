"use client"

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'
type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    themePreference: ThemePreference
    setTheme: (theme: ThemePreference) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    themePreference: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
})

export function useTheme() {
    return useContext(ThemeContext)
}

function getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const storageKey = 'illumi_theme'
    const [themePreference, setThemePreference] = useState<ThemePreference>('dark')
    const [resolvedTheme, setResolvedTheme] = useState<Theme>('dark')

    const applyThemeClass = useCallback((nextTheme: Theme) => {
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark')
            document.documentElement.style.colorScheme = 'dark'
        } else {
            document.documentElement.classList.remove('dark')
            document.documentElement.style.colorScheme = 'light'
        }
    }, [])

    const resolveTheme = useCallback((preference: ThemePreference): Theme => {
        if (preference === 'system') {
            return getSystemTheme()
        }
        return preference
    }, [])

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(storageKey) as ThemePreference | null
            const preference: ThemePreference = stored === 'light' || stored === 'dark' || stored === 'system' 
                ? stored 
                : 'dark'
            setThemePreference(preference)
            const resolved = resolveTheme(preference)
            setResolvedTheme(resolved)
            applyThemeClass(resolved)
        } catch {
            const resolved = resolveTheme('dark')
            setResolvedTheme(resolved)
            applyThemeClass(resolved)
        }
    }, [applyThemeClass, resolveTheme])

    useEffect(() => {
        if (themePreference !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light'
            setResolvedTheme(newTheme)
            applyThemeClass(newTheme)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [themePreference, applyThemeClass])

    const setTheme = useCallback((nextPreference: ThemePreference) => {
        setThemePreference(nextPreference)
        const resolved = resolveTheme(nextPreference)
        setResolvedTheme(resolved)
        applyThemeClass(resolved)
        try {
            window.localStorage.setItem(storageKey, nextPreference)
        } catch {
            // ignore
        }
    }, [applyThemeClass, resolveTheme])

    const toggleTheme = useCallback(() => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
    }, [resolvedTheme, setTheme])

    const value = useMemo(() => ({ 
        theme: resolvedTheme, 
        themePreference,
        setTheme, 
        toggleTheme 
    }), [resolvedTheme, themePreference, setTheme, toggleTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
