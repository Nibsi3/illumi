"use client"

import { useState, useEffect } from "react"
import { 
    IconMail, 
    IconCreditCard, 
    IconCheck, 
    IconArrowRight, 
    IconPlus, 
    IconSend, 
    IconFileInvoice,
    IconChartBar,
    IconUsers,
    IconReceipt,
    IconFolder,
    IconSettings,
    IconBell,
    IconSearch,
    IconStar,
    IconArchive,
    IconTrash,
    IconRefresh,
    IconChevronDown,
    IconLock,
    IconShieldCheck,
    IconCalendar,
    IconMenu2,
    IconInbox,
    IconTag
} from "@tabler/icons-react"

const STEP_DURATION = 3500 // 3.5 seconds per step
const TOTAL_STEPS = 8

type DemoStep = {
    id: number
    title: string
    description: string
    label: string
}

const steps: DemoStep[] = [
    { id: 1, title: "Dashboard", description: "Navigate to Invoices", label: "Business Owner" },
    { id: 2, title: "Create Invoice", description: "Click New Invoice", label: "Business Owner" },
    { id: 3, title: "Fill Details", description: "Add client & line items", label: "Business Owner" },
    { id: 4, title: "Send Invoice", description: "Click Send Now", label: "Business Owner" },
    { id: 5, title: "Email Received", description: "Client receives invoice", label: "Client View" },
    { id: 6, title: "Invoice Portal", description: "Client opens secure link", label: "Client View" },
    { id: 7, title: "Payment", description: "Client pays via PayGate", label: "Client View" },
    { id: 8, title: "Success", description: "Payment confirmed", label: "Complete" },
]

export function InvoiceDemo() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isClicking, setIsClicking] = useState(false)

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            setIsClicking(true)
            setTimeout(() => {
                setIsClicking(false)
                setCurrentStep((prev) => (prev >= TOTAL_STEPS ? 1 : prev + 1))
            }, 300)
        }, STEP_DURATION)

        return () => clearInterval(interval)
    }, [isPlaying])

    return (
        <div 
            className="relative w-full max-w-5xl mx-auto"
            role="region"
            aria-label="Interactive invoice workflow demonstration"
        >
            {/* Top controls */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                        currentStep <= 4 ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                        {steps[currentStep - 1].label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentStep(prev => prev > 1 ? prev - 1 : TOTAL_STEPS)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Previous step"
                    >
                        <IconArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                    <button
                        onClick={() => setCurrentStep(prev => prev < TOTAL_STEPS ? prev + 1 : 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Next step"
                    >
                        <IconArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress bar with clickable steps */}
            <div className="relative mb-6">
                <div className="flex items-center gap-1">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className="flex-1 h-2 rounded-full overflow-hidden bg-border hover:bg-border/80 transition-colors cursor-pointer group relative"
                            aria-label={`Go to step ${step.id}: ${step.title}`}
                        >
                            <div
                                className={`h-full transition-all duration-500 ${
                                    step.id < currentStep 
                                        ? "w-full bg-primary" 
                                        : step.id === currentStep 
                                            ? "w-full bg-primary animate-pulse" 
                                            : "w-0 bg-primary"
                                }`}
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                {step.title}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Demo viewport */}
            <div className="relative aspect-video rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
                {/* Browser chrome - more realistic */}
                <div className="h-11 bg-muted/80 border-b border-border flex items-center px-4 gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                        <div className="p-1 rounded hover:bg-accent transition-colors">
                            <IconArrowRight className="w-3.5 h-3.5 text-muted-foreground rotate-180" />
                        </div>
                        <div className="p-1 rounded hover:bg-accent transition-colors">
                            <IconArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="p-1 rounded hover:bg-accent transition-colors">
                            <IconRefresh className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="flex-1 mx-2">
                        <div className="h-7 bg-background rounded-lg flex items-center px-3 border border-border/50">
                            <IconLock className="w-3 h-3 text-emerald-500 mr-2" />
                            <span className="text-[11px] text-muted-foreground truncate font-mono">
                                {currentStep <= 4 ? "https://app.illumi.co.za/invoices" : currentStep === 5 ? "https://mail.google.com/mail/u/0/#inbox" : "https://pay.illumi.co.za/inv/2026-004"}
                            </span>
                        </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{currentStep <= 4 ? "JD" : "AC"}</span>
                    </div>
                </div>

                {/* Content area */}
                <div className="relative h-[calc(100%-2.75rem)] overflow-hidden bg-background">
                    {/* Step 1: Dashboard */}
                    <DemoScreen active={currentStep === 1}>
                        <DashboardView />
                    </DemoScreen>

                    {/* Step 2: Create Invoice */}
                    <DemoScreen active={currentStep === 2}>
                        <CreateInvoiceView />
                    </DemoScreen>

                    {/* Step 3: Fill Details */}
                    <DemoScreen active={currentStep === 3}>
                        <FillDetailsView />
                    </DemoScreen>

                    {/* Step 4: Send Invoice */}
                    <DemoScreen active={currentStep === 4}>
                        <SendInvoiceView />
                    </DemoScreen>

                    {/* Step 5: Client Email */}
                    <DemoScreen active={currentStep === 5}>
                        <GmailView />
                    </DemoScreen>

                    {/* Step 6: View Invoice */}
                    <DemoScreen active={currentStep === 6}>
                        <InvoicePortalView />
                    </DemoScreen>

                    {/* Step 7: Pay Now */}
                    <DemoScreen active={currentStep === 7}>
                        <PaymentView />
                    </DemoScreen>

                    {/* Step 8: Success */}
                    <DemoScreen active={currentStep === 8}>
                        <SuccessView />
                    </DemoScreen>
                </div>

                {/* Cursor animation */}
                <AnimatedCursor step={currentStep} isClicking={isClicking} />
            </div>

            {/* Current step info */}
            <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {currentStep}
                    </span>
                    <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">{steps[currentStep - 1].title}</div>
                        <div className="text-xs text-muted-foreground">{steps[currentStep - 1].description}</div>
                    </div>
                </div>
            </div>

            {/* SEO hidden description */}
            <div className="sr-only">
                <h3>Invoice Workflow Demonstration</h3>
                <p>This interactive demo shows the complete invoice workflow: Create invoice, send to client, client receives email, views invoice portal, pays via PayGate, payment confirmed.</p>
            </div>
        </div>
    )
}

function DemoScreen({ active, children }: { active: boolean; children: React.ReactNode }) {
    return (
        <div
            className={`absolute inset-0 transition-all duration-500 ${
                active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
            }`}
        >
            {children}
        </div>
    )
}

function AnimatedCursor({ step, isClicking }: { step: number; isClicking: boolean }) {
    // Percentage-based positions that scale across all screen sizes
    const positions: Record<number, { x: string; y: string }> = {
        1: { x: "88%", y: "18%" },                     // New Invoice button (top right header)
        2: { x: "28%", y: "42%" },                     // Standard Invoice card (top left)
        3: { x: "28%", y: "78%" },                     // Create Invoice button
        4: { x: "50%", y: "82%" },                     // Send Now button
        5: { x: "55%", y: "38%" },                     // Email row in Gmail (Illumi email)
        6: { x: "50%", y: "75%" },                     // Pay Now button
        7: { x: "50%", y: "75%" },                     // Pay button
        8: { x: "50%", y: "50%" },                     // Center for success
    }

    const pos = positions[step] || { x: "50%", y: "50%" }

    return (
        <div
            className={`absolute pointer-events-none z-50 transition-all duration-700 ease-out ${isClicking ? "scale-90" : "scale-100"}`}
            style={{ 
                left: pos.x, 
                top: pos.y,
                // Position (left/top) should represent the cursor *tip*, not the center of the SVG.
                // The SVG tip is roughly at (5.5, 3.2) in a 24x24 viewBox.
                transform: `translate(-23%, -13%)`
            }}
        >
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 drop-shadow-xl">
                <path
                    d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                />
            </svg>
            {/* Click ripple effect */}
            {isClicking && (
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary/50 animate-ping" />
            )}
            {/* Subtle glow */}
            <div className="absolute -inset-2 rounded-full bg-primary/10 blur-md" />
        </div>
    )
}

// Individual screen components
function DashboardView() {
    return (
        <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-52 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">I</span>
                        </div>
                        <span className="font-semibold text-foreground text-sm">Illumi</span>
                    </div>
                </div>
                <div className="p-3 space-y-1 flex-1">
                    <NavItem icon={IconChartBar} label="Overview" />
                    <NavItem icon={IconFileInvoice} label="Invoices" active />
                    <NavItem icon={IconUsers} label="Clients" />
                    <NavItem icon={IconReceipt} label="Expenses" />
                    <NavItem icon={IconFolder} label="Vault" />
                </div>
                <div className="p-3 border-t border-border">
                    <NavItem icon={IconSettings} label="Settings" />
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b border-border flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-base font-semibold text-foreground">Invoices</h1>
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">12 total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                            <IconSearch className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-accent transition-colors relative">
                            <IconBell className="w-4 h-4 text-muted-foreground" />
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                        </button>
                        <div className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 ring-2 ring-primary/20 animate-pulse">
                            <IconPlus className="w-3.5 h-3.5" />
                            New Invoice
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                    <div className="space-y-2">
                        {[
                            { id: "INV-2026-003", client: "TechStart Inc", amount: "R3,200.00", status: "Paid", date: "Jan 24" },
                            { id: "INV-2026-002", client: "Global Media", amount: "R1,800.00", status: "Pending", date: "Jan 22" },
                            { id: "INV-2026-001", client: "Local Shop", amount: "R950.00", status: "Paid", date: "Jan 20" },
                        ].map((inv, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card p-3 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                                        <IconFileInvoice className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-foreground">{inv.id}</div>
                                        <div className="text-[10px] text-muted-foreground">{inv.client}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs font-semibold text-foreground">{inv.amount}</div>
                                        <div className="text-[10px] text-muted-foreground">{inv.date}</div>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                    }`}>
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function NavItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
    return (
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
            active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}>
            <Icon className="w-4 h-4" />
            {label}
        </div>
    )
}

function CreateInvoiceView() {
    return (
        <div className="h-full p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Create New Invoice</h2>
                    <p className="text-xs text-muted-foreground">Choose an invoice type to get started</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {/* Standard Invoice - highlighted */}
                    <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 cursor-pointer transition-all hover:shadow-lg ring-2 ring-primary/20 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <IconFileInvoice className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-0.5">Standard Invoice</h3>
                        <p className="text-[10px] text-muted-foreground mb-3">One-time invoice for products or services</p>
                        <div className="flex items-center text-[10px] text-primary font-medium">
                            Select <IconArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </div>
                    {/* Recurring Invoice */}
                    <div className="rounded-xl border border-border bg-card p-4 cursor-pointer transition-all hover:border-border/80 hover:shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                            <IconRefresh className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-0.5">Recurring Invoice</h3>
                        <p className="text-[10px] text-muted-foreground mb-3">Auto-send on a schedule</p>
                        <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                            Select <IconArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </div>
                    {/* Scheduled Invoice */}
                    <div className="rounded-xl border border-border bg-card p-4 cursor-pointer transition-all hover:border-border/80 hover:shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                            <IconCalendar className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-0.5">Scheduled Invoice</h3>
                        <p className="text-[10px] text-muted-foreground mb-3">Create now, send later</p>
                        <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                            Select <IconArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </div>
                    {/* Quote */}
                    <div className="rounded-xl border border-border bg-card p-4 cursor-pointer transition-all hover:border-border/80 hover:shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                            <IconReceipt className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-0.5">Quote / Estimate</h3>
                        <p className="text-[10px] text-muted-foreground mb-3">Convert to invoice later</p>
                        <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                            Select <IconArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FillDetailsView() {
    return (
        <div className="h-full flex">
            {/* Form side */}
            <div className="flex-1 p-5 overflow-auto border-r border-border">
                <div className="max-w-sm space-y-4">
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Client</label>
                        <div className="h-9 rounded-lg border border-border bg-card px-3 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-primary">A</span>
                                </div>
                                <span className="text-xs font-medium text-foreground">Acme Corporation</span>
                            </div>
                            <IconChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Line Items</label>
                        <div className="space-y-1.5">
                            <div className="rounded-lg border border-border bg-card p-2.5 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-xs text-foreground">Website Design</div>
                                    <div className="text-[10px] text-muted-foreground">Qty: 1</div>
                                </div>
                                <div className="text-xs font-semibold text-foreground">R2,500.00</div>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-2.5 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-xs text-foreground">API Integration</div>
                                    <div className="text-[10px] text-muted-foreground">Qty: 1</div>
                                </div>
                                <div className="text-xs font-semibold text-foreground">R1,500.00</div>
                            </div>
                            <button className="w-full h-8 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                                <IconPlus className="w-3 h-3" />
                                Add line item
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
                        <div className="h-16 rounded-lg border border-border bg-card p-2.5 text-[10px] text-muted-foreground">
                            Thank you for your business. Payment due within 14 days.
                        </div>
                    </div>
                    <button className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 ring-2 ring-primary/20 animate-pulse">
                        Create Invoice
                        <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            {/* Preview side */}
            <div className="w-72 bg-muted/30 p-4">
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Live Preview</div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">I</span>
                        </div>
                        <div className="text-right">
                            <div className="text-base font-bold text-foreground">Invoice</div>
                            <div className="text-[9px] text-muted-foreground">INV-2026-004</div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Website Design</span>
                            <span className="text-foreground">R2,500.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">API Integration</span>
                            <span className="text-foreground">R1,500.00</span>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground">Total Due</span>
                        <span className="text-lg font-bold text-foreground">R4,000.00</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SendInvoiceView() {
    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <IconMail className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Ready to Send</h2>
                    <p className="text-xs text-muted-foreground">Review the details and send your invoice</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                        <div>
                            <div className="text-[10px] text-muted-foreground">Invoice</div>
                            <div className="text-sm font-semibold text-foreground">INV-2026-004</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-muted-foreground">Amount</div>
                            <div className="text-xl font-bold text-foreground">R4,000.00</div>
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <IconUsers className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground">Recipient</div>
                                <div className="text-xs text-foreground">billing@acme.co.za</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <IconCreditCard className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground">PayGate</div>
                                <div className="text-xs text-foreground">PayFast enabled • Pay Now button included</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 ring-2 ring-primary/20 animate-pulse">
                    <IconSend className="w-4 h-4" />
                    Send Invoice Now
                </button>
                <p className="text-center text-[10px] text-muted-foreground mt-3">
                    Client will receive an email with a secure link to view and pay
                </p>
            </div>
        </div>
    )
}

function GmailView() {
    return (
        <div className="h-full bg-white flex flex-col">
            {/* Gmail header */}
            <div className="h-14 border-b border-neutral-200 flex items-center px-4 gap-3 shrink-0">
                <div className="flex items-center gap-2">
                    <IconMenu2 className="w-5 h-5 text-neutral-600" />
                    <div className="flex items-center gap-1">
                        <svg viewBox="0 0 74 24" className="h-6">
                            <path fill="#EA4335" d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"/>
                            <path fill="#4285F4" d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                            <path fill="#FBBC05" d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54.01 2.03-1.36 3.5-3.1 3.5z"/>
                            <path fill="#34A853" d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                            <path fill="#EA4335" d="M58 .24h2.51v17.57H58z"/>
                            <path fill="#4285F4" d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"/>
                        </svg>
                    </div>
                </div>
                <div className="flex-1 max-w-xl">
                    <div className="h-10 bg-neutral-100 hover:bg-neutral-200 rounded-full px-4 flex items-center gap-3 transition-colors cursor-pointer">
                        <IconSearch className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-500">Search mail</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer">
                        <span className="text-xs font-medium text-white">AC</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Gmail sidebar */}
                <div className="w-16 border-r border-neutral-200 p-2 space-y-1 shrink-0">
                    <div className="w-full h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <IconPlus className="w-4 h-4 text-neutral-700" />
                    </div>
                    <div className="w-full py-2 rounded-2xl bg-red-100 flex flex-col items-center gap-0.5">
                        <IconInbox className="w-4 h-4 text-neutral-900" />
                        <span className="text-[9px] font-medium text-neutral-900">Inbox</span>
                    </div>
                    <div className="w-full py-2 flex flex-col items-center gap-0.5">
                        <IconStar className="w-4 h-4 text-neutral-500" />
                        <span className="text-[9px] text-neutral-500">Starred</span>
                    </div>
                    <div className="w-full py-2 flex flex-col items-center gap-0.5">
                        <IconSend className="w-4 h-4 text-neutral-500" />
                        <span className="text-[9px] text-neutral-500">Sent</span>
                    </div>
                </div>

                {/* Email list */}
                <div className="flex-1 overflow-auto">
                    <div className="border-b border-neutral-200 px-4 py-2 flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-neutral-300" />
                        <IconRefresh className="w-4 h-4 text-neutral-500" />
                        <span className="text-xs text-neutral-500 ml-2">Primary</span>
                    </div>
                    
                    {/* Highlighted email from Illumi */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 cursor-pointer hover:shadow-md transition-shadow ring-2 ring-blue-200 animate-pulse">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 mt-1" />
                            <IconStar className="w-4 h-4 text-neutral-400 mt-1" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm text-neutral-900 truncate">Illumi Invoicing</span>
                                    <span className="text-xs text-neutral-500 shrink-0">Just now</span>
                                </div>
                                <div className="text-sm font-medium text-neutral-900 truncate">Invoice INV-2026-004 from Illumi Professional</div>
                                <div className="text-sm text-neutral-600 truncate">You have a new invoice for R4,000.00. Click to view and pay online...</div>
                            </div>
                        </div>
                    </div>

                    {/* Other emails */}
                    <div className="px-4 py-3 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 mt-1" />
                            <IconStar className="w-4 h-4 text-neutral-400 mt-1" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm text-neutral-700 truncate">Google</span>
                                    <span className="text-xs text-neutral-400 shrink-0">Jan 24</span>
                                </div>
                                <div className="text-sm text-neutral-600 truncate">Security alert - New sign-in from Chrome on Windows</div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 mt-1" />
                            <IconStar className="w-4 h-4 text-neutral-400 mt-1" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm text-neutral-700 truncate">LinkedIn</span>
                                    <span className="text-xs text-neutral-400 shrink-0">Jan 23</span>
                                </div>
                                <div className="text-sm text-neutral-600 truncate">You have 3 new connection requests</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InvoicePortalView() {
    return (
        <div className="h-full bg-background p-4 overflow-auto">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">I</span>
                        </div>
                        <span className="font-semibold text-foreground text-sm">Illumi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600">
                        <IconShieldCheck className="w-3.5 h-3.5" />
                        Secure Payment Portal
                    </div>
                </div>

                {/* Invoice card */}
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-border bg-muted/30">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Invoice</div>
                                <div className="text-base font-semibold text-foreground">INV-2026-004</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Amount Due</div>
                                <div className="text-2xl font-bold text-foreground">R4,000.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <IconCalendar className="w-3.5 h-3.5" />
                            Due: February 10, 2026
                        </div>
                        <div className="space-y-2 pt-2 border-t border-border">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Website Design & Development</span>
                                <span className="text-foreground font-medium">R2,500.00</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Backend API Integration</span>
                                <span className="text-foreground font-medium">R1,500.00</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-border flex justify-between items-center">
                            <span className="text-xs font-medium text-muted-foreground">Total</span>
                            <span className="text-lg font-bold text-foreground">R4,000.00</span>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/30 border-t border-border">
                        <button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ring-2 ring-primary/20 animate-pulse">
                            <IconCreditCard className="w-4 h-4" />
                            Pay Now
                            <IconArrowRight className="w-4 h-4" />
                        </button>
                        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><IconLock className="w-3 h-3" /> 256-bit SSL</span>
                            <span>•</span>
                            <span>PayGate Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PaymentView() {
    return (
        <div className="h-full bg-background p-4 overflow-auto">
            <div className="max-w-md mx-auto">
                {/* PayGate header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <IconShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-semibold text-foreground text-sm">PayGate</span>
                            <div className="text-[9px] text-muted-foreground">Secure Checkout</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-muted-foreground">Amount</div>
                        <div className="text-lg font-bold text-foreground">R4,000.00</div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                    {/* Card number */}
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Number</label>
                        <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    <div className="w-6 h-4 rounded bg-blue-600" />
                                    <div className="w-6 h-4 rounded bg-red-500" />
                                </div>
                                <span className="text-sm text-foreground font-mono">4242 •••• •••• 4242</span>
                            </div>
                            <IconCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry</label>
                            <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-foreground font-mono">
                                12 / 28
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">CVV</label>
                            <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-foreground font-mono">
                                •••
                            </div>
                        </div>
                    </div>

                    {/* Name on card */}
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Name on Card</label>
                        <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-foreground">
                            ACME CORPORATION
                        </div>
                    </div>

                    {/* Pay button */}
                    <button className="w-full h-11 rounded-xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20 animate-pulse">
                        <IconLock className="w-4 h-4" />
                        Pay R4,000.00
                    </button>

                    {/* Security badges */}
                    <div className="flex items-center justify-center gap-3 pt-2 text-[9px] text-muted-foreground">
                        <span className="flex items-center gap-1"><IconShieldCheck className="w-3 h-3" /> PCI Compliant</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><IconLock className="w-3 h-3" /> 256-bit SSL</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SuccessView() {
    return (
        <div className="h-full flex items-center justify-center bg-background p-4">
            <div className="text-center max-w-sm">
                {/* Success animation */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="relative w-full h-full rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center">
                        <IconCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                <p className="text-sm text-muted-foreground mb-6">Invoice INV-2026-004 has been paid in full</p>

                {/* Receipt card */}
                <div className="rounded-xl border border-border bg-card p-4 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                        <span className="text-xs text-muted-foreground">Amount Paid</span>
                        <span className="text-lg font-bold text-emerald-600">R4,000.00</span>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Transaction ID</span>
                            <span className="text-foreground font-mono">TXN-2026-8847</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="text-foreground">Jan 26, 2026</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Method</span>
                            <span className="text-foreground">Visa •••• 4242</span>
                        </div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Receipt sent to billing@acme.co.za
                </div>
            </div>
        </div>
    )
}
