'use client'

import { initBotId } from 'botid/client/core'

export function register() {
    initBotId({
        protect: [
            { path: '/api/email/send', method: 'POST' },
        ],
    })
}
