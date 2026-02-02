import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "illumi"
const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

// Public URL for the R2 bucket (via Cloudflare CDN or R2.dev)
// Set R2_PUBLIC_URL in your environment to your custom domain or R2.dev URL
// Example: https://pub-xxxxx.r2.dev or https://cdn.illumi.co.za
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.dev`

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
    if (!s3Client) {
        if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            throw new Error("R2 credentials not configured")
        }
        s3Client = new S3Client({
            region: "auto",
            endpoint: R2_ENDPOINT,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        })
    }
    return s3Client
}

export interface UploadOptions {
    contentType?: string
    cacheControl?: string
    metadata?: Record<string, string>
}

/**
 * Upload a file to R2 storage
 */
export async function uploadToR2(
    key: string,
    body: Buffer | Uint8Array | string,
    options: UploadOptions = {}
): Promise<{ key: string; url: string }> {
    const client = getS3Client()

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: options.contentType || "application/octet-stream",
        CacheControl: options.cacheControl || "public, max-age=31536000, immutable",
        Metadata: options.metadata,
    })

    await client.send(command)

    return {
        key,
        url: `${R2_PUBLIC_URL}/${key}`,
    }
}

/**
 * Generate a signed URL for private file access (expires in 1 hour by default)
 */
export async function getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
): Promise<string> {
    const client = getS3Client()

    const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
    })

    return getSignedUrl(client, command, { expiresIn })
}

/**
 * Generate a signed URL for uploading (presigned PUT)
 */
export async function getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
): Promise<string> {
    const client = getS3Client()

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    })

    return getSignedUrl(client, command, { expiresIn })
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFromR2(key: string): Promise<void> {
    const client = getS3Client()

    const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
    })

    await client.send(command)
}

/**
 * List files in R2 storage with optional prefix
 */
export async function listR2Files(prefix?: string, maxKeys: number = 100): Promise<{ key: string; size: number; lastModified: Date }[]> {
    const client = getS3Client()

    const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys,
    })

    const response = await client.send(command)

    return (response.Contents || []).map((item) => ({
        key: item.Key!,
        size: item.Size || 0,
        lastModified: item.LastModified || new Date(),
    }))
}

/**
 * Get the public CDN URL for a file
 */
export function getPublicUrl(key: string): string {
    return `${R2_PUBLIC_URL}/${key}`
}

/**
 * Generate a unique file key with workspace prefix
 */
export function generateFileKey(
    workspaceId: string,
    folder: "logos" | "invoices" | "attachments" | "receipts",
    filename: string
): string {
    const timestamp = Date.now()
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    return `${workspaceId}/${folder}/${timestamp}-${sanitizedFilename}`
}
