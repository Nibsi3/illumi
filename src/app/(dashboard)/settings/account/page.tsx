"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "@/lib/settings-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AccountPage() {
    const { logo, setLogo } = useSettings()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function loadUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
                    setEmail(user.email || '')
                }
            } catch (err) {
                console.error('Failed to load user:', err)
            } finally {
                setIsLoading(false)
            }
        }
        loadUser()
    }, [supabase])

    const handleImageUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setLogo(event.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-1">Account</h1>
                <p className="hidden sm:block text-muted-foreground">Manage your personal account settings and profile information.</p>
            </div>

            {/* Profile Picture */}
            <div className="mb-12 space-y-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-foreground">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Upload a custom profile picture. This will be displayed throughout the application.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                    <Avatar className="h-24 w-24 border-2 border-border">
                        <AvatarImage src={logo || undefined} />
                        <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-blue-500 text-foreground text-xl font-bold">
                            {name ? name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="h-9 border-border bg-muted hover:bg-accent"
                            onClick={handleImageUpload}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload new picture
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-9 text-muted-foreground hover:text-red-500"
                            onClick={() => setLogo(null)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-8 pt-10 border-t border-border">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Update your name and email address.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            type="email"
                            className="bg-background border-border h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end pt-10 border-t border-border mt-12">
                <Button 
                    onClick={async () => {
                        setIsSaving(true)
                        try {
                            const { error } = await supabase.auth.updateUser({
                                data: { full_name: name }
                            })
                            if (error) throw error
                            toast.success("Profile updated successfully")
                        } catch (err: any) {
                            toast.error("Failed to update profile", { description: err?.message })
                        } finally {
                            setIsSaving(false)
                        }
                    }}
                    disabled={isSaving || isLoading}
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-semibold rounded-lg"
                >
                    {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save changes"}
                </Button>
            </div>
        </div>
    )
}


