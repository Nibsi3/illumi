"use client"

import React, { createContext, useContext, useEffect } from 'react'

type Theme = 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
})

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const setTheme = () => {
        // Light mode removed
    }

    const toggleTheme = () => {
        // Light mode removed
    }

    return (
        <ThemeContext.Provider value={{ theme: 'dark', setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
