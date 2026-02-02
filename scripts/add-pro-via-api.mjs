// Add Pro subscription via local API (requires dev server running)
// Usage: node scripts/add-pro-via-api.mjs <workspace_id>

const workspaceId = process.argv[2] || '0b31de00-650c-437b-b99e-55e1627890c5'

async function addPro() {
    console.log(`Adding Pro subscription for workspace: ${workspaceId}`)
    
    try {
        const response = await fetch('http://localhost:3001/api/admin/add-pro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workspace_id: workspaceId })
        })

        const data = await response.json()
        console.log('Response:', JSON.stringify(data, null, 2))
        
        if (data.success) {
            console.log('✓ Pro subscription added!')
        } else {
            console.log('✗ Failed:', data.error)
        }
    } catch (err) {
        console.error('Error:', err.message)
    }
}

addPro()
