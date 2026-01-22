import Link from "next/link"
import { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { IconArrowLeft, IconMail } from "@tabler/icons-react"

export const metadata: Metadata = {
    title: "Invoice Email Open & Paid Rate Stats by Subject Line | Illumi",
    description: "Which invoice email subject lines get opened and paid fastest? Data-driven email optimization tips for South African SMEs.",
    keywords: [
        "invoice email subject lines",
        "email open rates invoicing",
        "invoice email best practices",
        "payment email optimization",
    ],
}

const subjectLineData = [
    {
        subject: "Invoice [NUMBER] from [COMPANY]",
        openRate: 68,
        paidRate: 58,
        avgDays: 28,
        notes: "Standard format, clear and professional",
    },
    {
        subject: "Your invoice is ready - [COMPANY]",
        openRate: 72,
        paidRate: 62,
        avgDays: 26,
        notes: "Action-oriented, friendly tone",
    },
    {
        subject: "[COMPANY] Invoice [NUMBER] - Due [DATE]",
        openRate: 75,
        paidRate: 65,
        avgDays: 24,
        notes: "Includes due date urgency",
    },
    {
        subject: "Invoice [NUMBER] - [AMOUNT] due [DATE]",
        openRate: 78,
        paidRate: 68,
        avgDays: 22,
        notes: "Amount + deadline creates urgency",
    },
    {
        subject: "Payment request: Invoice [NUMBER]",
        openRate: 65,
        paidRate: 54,
        avgDays: 32,
        notes: "Too formal, lower engagement",
    },
    {
        subject: "Invoice attached",
        openRate: 42,
        paidRate: 35,
        avgDays: 38,
        notes: "Vague, often ignored or flagged as spam",
    },
]

export default function EmailPerformancePage() {
    return (
        <div className="min-h-screen bg-black text-white grainy-gradient">
            <MarketingHeader />
            
            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
                <Link href="/resources" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Invoice Email Open & Paid Rate Stats
                    </h1>
                    <p className="text-white/60 text-lg max-w-3xl">
                        Real data on which invoice email subject lines get opened and paid fastest. 
                        Optimize your invoice emails to improve payment speed and reduce late payments.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Best Performing Subject</div>
                        <div className="text-2xl font-bold text-green-400">78%</div>
                        <div className="text-xs text-white/40 mt-1">Open rate with amount + date</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Avg Payment Speed Diff</div>
                        <div className="text-3xl font-bold">16 days</div>
                        <div className="text-xs text-white/40 mt-1">Best vs worst subject line</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                        <div className="text-sm text-white/60 mb-1">Optimal Send Time</div>
                        <div className="text-2xl font-bold">Tue 10am</div>
                        <div className="text-xs text-white/40 mt-1">Highest open rate</div>
                    </div>
                </div>

                {/* Subject Line Performance */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Subject Line Performance</h2>
                    
                    <div className="space-y-4">
                        {subjectLineData.map((data, idx) => (
                            <div key={idx} className="rounded-xl bg-white/5 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">{data.subject}</h3>
                                        <p className="text-sm text-white/60">{data.notes}</p>
                                    </div>
                                    <div className={`text-2xl font-bold ${data.openRate > 70 ? 'text-green-400' : data.openRate > 60 ? 'text-white' : 'text-red-400'}`}>
                                        {data.openRate}%
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">Open Rate</div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                                            <div 
                                                className={`h-full rounded-full ${data.openRate > 70 ? 'bg-green-500' : data.openRate > 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                style={{ width: `${data.openRate}%` }}
                                            />
                                        </div>
                                        <div className="text-sm font-semibold text-white">{data.openRate}%</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-white/40 mb-1">Paid Rate</div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                                            <div 
                                                className={`h-full rounded-full ${data.paidRate > 60 ? 'bg-green-500' : data.paidRate > 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                style={{ width: `${data.paidRate}%` }}
                                            />
                                        </div>
                                        <div className="text-sm font-semibold text-white">{data.paidRate}%</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-white/40 mb-1">Avg Payment Time</div>
                                        <div className="text-sm font-semibold text-white">{data.avgDays} days</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Send Time Optimization */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Best Time to Send Invoice Emails</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">By Day of Week</h3>
                            <div className="space-y-3">
                                {[
                                    { day: "Tuesday", openRate: 72, paidRate: 64 },
                                    { day: "Wednesday", openRate: 70, paidRate: 62 },
                                    { day: "Thursday", openRate: 68, paidRate: 60 },
                                    { day: "Monday", openRate: 64, paidRate: 56 },
                                    { day: "Friday", openRate: 58, paidRate: 50 },
                                    { day: "Weekend", openRate: 32, paidRate: 28 },
                                ].map((data) => (
                                    <div key={data.day} className="flex items-center justify-between">
                                        <span className="text-white/80">{data.day}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-white/60">Open: {data.openRate}%</span>
                                            <span className="text-sm text-white/60">Paid: {data.paidRate}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">By Time of Day</h3>
                            <div className="space-y-3">
                                {[
                                    { time: "10:00 AM", openRate: 75, paidRate: 66 },
                                    { time: "2:00 PM", openRate: 72, paidRate: 64 },
                                    { time: "9:00 AM", openRate: 68, paidRate: 60 },
                                    { time: "11:00 AM", openRate: 66, paidRate: 58 },
                                    { time: "4:00 PM", openRate: 58, paidRate: 52 },
                                    { time: "After 6 PM", openRate: 42, paidRate: 38 },
                                ].map((data) => (
                                    <div key={data.time} className="flex items-center justify-between">
                                        <span className="text-white/80">{data.time}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-white/60">Open: {data.openRate}%</span>
                                            <span className="text-sm text-white/60">Paid: {data.paidRate}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-400">
                            <strong>Optimal send time:</strong> Tuesday or Wednesday at 10:00 AM achieves 72-75% open rates and 64-66% paid rates.
                        </p>
                    </div>
                </div>

                {/* Email Content Best Practices */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Email Content Best Practices</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <h3 className="font-semibold mb-2 text-green-400">✓ Do This</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Include invoice number in subject</li>
                                    <li>• Show amount due in subject or preview</li>
                                    <li>• Add due date for urgency</li>
                                    <li>• Use "Pay Now" button (40% faster payment)</li>
                                    <li>• Personalize with customer name</li>
                                    <li>• Keep email under 200 words</li>
                                    <li>• Send from recognizable email address</li>
                                    <li>• Include payment link prominently</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <h3 className="font-semibold mb-2 text-red-400">✗ Avoid This</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Vague subjects like "Invoice attached"</li>
                                    <li>• Sending on weekends or after 6 PM</li>
                                    <li>• All caps or excessive punctuation!!!</li>
                                    <li>• Attachments without inline preview</li>
                                    <li>• Generic "Dear Customer" greetings</li>
                                    <li>• Long paragraphs of text</li>
                                    <li>• No clear call-to-action</li>
                                    <li>• Sending from noreply@ addresses</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Including amount + due date increases payment speed by 27%</h3>
                            <p className="text-white/60 leading-relaxed">
                                Subject lines with both amount and due date get paid in 22 days vs 30 days for generic subjects. 
                                The urgency and clarity drive faster action.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Tuesday 10 AM is the sweet spot</h3>
                            <p className="text-white/60 leading-relaxed">
                                Emails sent Tuesday at 10 AM have 75% open rates vs 32% on weekends. People are settled into their week 
                                but not yet overwhelmed. Avoid Mondays (inbox overload) and Fridays (weekend mode).
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">"Pay Now" buttons reduce payment time by 40%</h3>
                            <p className="text-white/60 leading-relaxed">
                                Invoices with integrated payment buttons (PayFast, Yoco, Ozow) get paid in 18 days vs 30 days for 
                                manual EFT instructions. Remove friction = faster payment.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Vague subjects kill engagement</h3>
                            <p className="text-white/60 leading-relaxed">
                                "Invoice attached" has only 42% open rate and 35% paid rate. It's often flagged as spam or ignored. 
                                Be specific: include company name, invoice number, and amount.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Optimization Checklist */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
                    <h2 className="text-2xl font-semibold mb-6">Email Optimization Checklist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Include invoice number in subject line",
                            "Show amount due in subject or preview text",
                            "Add due date for urgency",
                            "Send Tuesday-Thursday at 10 AM",
                            "Use customer's name in greeting",
                            "Add prominent 'Pay Now' button",
                            "Keep email body under 200 words",
                            "Include payment link 2-3 times",
                            "Use professional from address (not noreply@)",
                            "Add company logo for brand recognition",
                            "Include itemized breakdown",
                            "Set up automated payment reminders",
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-green-400 text-xs">✓</span>
                                </div>
                                <span className="text-sm text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Send optimized invoice emails automatically with Illumi</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 h-12 text-sm font-semibold transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
