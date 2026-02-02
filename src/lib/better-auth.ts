import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var __illumiBetterAuthPool: Pool | undefined;
    // eslint-disable-next-line no-var
    var __illumiBetterAuthInstance: ReturnType<typeof betterAuth> | undefined;
}

function getPgPoolConfig() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const url = new URL(connectionString);
    const hostaddr = process.env.DATABASE_HOSTADDR;

    return {
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        host: hostaddr || url.hostname,
        port: url.port ? Number(url.port) : 5432,
        database: url.pathname.replace(/^\//, "") || "postgres",
        ssl: {
            rejectUnauthorized: false,
        },
        ...(hostaddr
            ? {
                  hostaddr,
              }
            : undefined),
    };
}

export function getAuth() {
    if (!globalThis.__illumiBetterAuthPool) {
        globalThis.__illumiBetterAuthPool = new Pool(getPgPoolConfig());
    }

    if (!globalThis.__illumiBetterAuthInstance) {
        globalThis.__illumiBetterAuthInstance = betterAuth({
            database: globalThis.__illumiBetterAuthPool,
            emailAndPassword: {
                enabled: true,
                async sendResetPassword(data, request) {
                    // TODO: Implement password reset email
                    console.log("Password reset requested for:", data.user.email);
                },
            },
            socialProviders: {
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                },
            },
            plugins: [nextCookies()],
            trustedOrigins: [
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
                "https://illumi.co.za",
            ],
        });
    }

    return globalThis.__illumiBetterAuthInstance;
}
