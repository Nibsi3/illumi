"use client"

import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Book } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-medium mb-1">Support</h1>
                <p className="text-muted-foreground">Get help and contact our support team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border border-white/5 rounded-xl bg-[#09090b] hover:bg-white/5 transition-colors">
                    <Mail className="h-6 w-6 text-white mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Email Support</h3>
                    <p className="text-sm text-neutral-500 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10">
                        Contact Support
                    </Button>
                </div>

                <div className="p-6 border border-white/5 rounded-xl bg-[#09090b] hover:bg-white/5 transition-colors">
                    <MessageCircle className="h-6 w-6 text-white mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-neutral-500 mb-4">Chat with our support team in real-time.</p>
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10">
                        Start Chat
                    </Button>
                </div>

                <div className="p-6 border border-white/5 rounded-xl bg-[#09090b] hover:bg-white/5 transition-colors">
                    <Book className="h-6 w-6 text-white mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Documentation</h3>
                    <p className="text-sm text-neutral-500 mb-4">Browse our help center and documentation.</p>
                    <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10">
                        View Docs
                    </Button>
                </div>
            </div>

            <div className="p-6 border border-white/5 rounded-xl bg-[#09090b]">
                <h3 className="text-lg font-medium text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">How do I create an invoice?</h4>
                        <p className="text-sm text-neutral-500">Navigate to the Invoices page and click "Create Invoice". Fill in the details and send it to your customer.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">How do I track payments?</h4>
                        <p className="text-sm text-neutral-500">Connect your email or WhatsApp to automatically receive payment notifications. You can also manually mark invoices as paid.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">Can I customize invoice templates?</h4>
                        <p className="text-sm text-neutral-500">Yes! Go to Invoice Settings to customize templates, add your logo, and configure payment terms.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

