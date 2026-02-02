"use client"

import { useState } from "react"
import { useWorkspace } from "@/lib/workspace-context"

export type StorageFolder = "logos" | "invoices" | "attachments" | "receipts"

interface UploadResult {
    key: string
    url: string
}

interface UseStorageReturn {
    upload: (file: File, folder?: StorageFolder) => Promise<UploadResult>
    getSignedUrl: (key: string) => Promise<string>
    deleteFile: (key: string) => Promise<void>
    isUploading: boolean
    error: string | null
}

export function useStorage(): UseStorageReturn {
    const { activeWorkspace } = useWorkspace()
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File, folder: StorageFolder = "attachments"): Promise<UploadResult> => {
        if (!activeWorkspace?.id) {
            throw new Error("No active workspace")
        }

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("workspaceId", activeWorkspace.id)
            formData.append("folder", folder)

            const response = await fetch("/api/storage/upload", {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Upload failed")
            }

            return {
                key: result.key,
                url: result.url,
            }
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setIsUploading(false)
        }
    }

    const getSignedUrl = async (key: string): Promise<string> => {
        const response = await fetch("/api/storage/signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, type: "download" }),
            credentials: "include",
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to get signed URL")
        }

        return result.signedUrl
    }

    const deleteFile = async (key: string): Promise<void> => {
        const response = await fetch("/api/storage/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
            credentials: "include",
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to delete file")
        }
    }

    return {
        upload,
        getSignedUrl,
        deleteFile,
        isUploading,
        error,
    }
}
