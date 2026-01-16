export type Client = {
    id: string
    name: string
    contact: string
    email: string
    status: "Active" | "Inactive"
    totalInvoiced: string
    lastActivity: string
    tags: string[]
    country: string
    industry: string
    revenue: string
    outstanding: string
    address?: string
    phone?: string
}

export type Product = {
    id: string
    name: string
    sku?: string
    description?: string
    price: number | string // Support both for existing data
    currency: string
    billingType: "One-time" | "Recurring"
    status: "Active" | "Archived"
}

export const allClients: Client[] = [
    {
        id: "1",
        name: "Acme Corp",
        contact: "John Doe",
        email: "billing@acme.com",
        status: "Active",
        totalInvoiced: "ZAR 12,500.00",
        lastActivity: "2 mins ago",
        tags: ["Gold", "Tech"],
        country: "South Africa",
        industry: "Technology",
        revenue: "ZAR 155,000.00",
        outstanding: "ZAR 0.00",
        address: "123 Business Avenue, Innovation District, Cape Town, 8001",
        phone: "+27 82 123 4567"
    },
    {
        id: "2",
        name: "Globex Corporation",
        contact: "Hank Scorpio",
        email: "finance@globex.co",
        status: "Active",
        totalInvoiced: "ZAR 8,400.00",
        lastActivity: "1 day ago",
        tags: ["Enterprise"],
        country: "USA",
        industry: "Global Domination",
        revenue: "ZAR 2M",
        outstanding: "ZAR 55,000.00",
        address: "456 Global Drive, Springfield, USA",
        phone: "+1 555-0199"
    },
]

export const allProducts: Product[] = [
    {
        id: "PROD-0001",
        name: "Retainer Package",
        sku: "RET-5000",
        description: "Monthly consulting retainer",
        price: 5000,
        currency: "ZAR",
        billingType: "Recurring",
        status: "Active",
    },
    {
        id: "PROD-0002",
        name: "Implementation Project",
        sku: "IMP-ONCE",
        description: "Implementation and onboarding once-off",
        price: 12500,
        currency: "ZAR",
        billingType: "One-time",
        status: "Active",
    }
]
