"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "@/lib/settings-context"

export default function AccountPage() {
    const { logo, setLogo } = useSettings()
    const [name, setName] = useState("Cameron Falck")
    const [email, setEmail] = useState("cameronfalck03@gmail.com")

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
                <h1 className="text-4xl font-serif font-medium mb-1">Account</h1>
                <p className="text-muted-foreground">Manage your personal account settings and profile information.</p>
            </div>

            {/* Profile Picture */}
            <div className="mb-12 space-y-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                    <p className="text-sm text-neutral-500 max-w-xl">
                        Upload a custom profile picture. This will be displayed throughout the application.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <Avatar className="h-24 w-24 border-2 border-white/10">
                        <AvatarImage src={logo || undefined} />
                        <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white text-xl font-bold">
                            CF
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="h-9 border-white/10 bg-white/5 hover:bg-white/10"
                            onClick={handleImageUpload}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload new picture
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-9 text-neutral-500 hover:text-red-500"
                            onClick={() => setLogo(null)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-8 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-white">Personal Information</h3>
                    <p className="text-sm text-neutral-500 max-w-xl">
                        Update your name and email address.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="bg-black border-white/5 h-11 focus-visible:ring-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            type="email"
                            className="bg-black border-white/5 h-11 focus-visible:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end pt-10 border-t border-white/5 mt-12">
                <Button className="bg-white text-black hover:bg-neutral-200 h-11 px-8 font-semibold rounded-lg">
                    Save changes
                </Button>
            </div>
        </div>
    )
}

