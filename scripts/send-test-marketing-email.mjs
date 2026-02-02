// Script to send test marketing demo email
const email = process.argv[2] || 'cameronfalck03@gmail.com'
const companyName = process.argv[3] || 'Test Company'
const subject = process.argv[4] || 'Invoice preview from Illumi (sample)'

async function sendEmail() {
    console.log(`Sending marketing demo email to: ${email}`)
    console.log(`Company name: ${companyName}`)
    console.log(`Subject: ${subject}`)
    
    try {
        const response = await fetch('http://localhost:3001/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'marketing_demo',
                to: email,
                customerName: companyName,
                subject,
            })
        })

        const data = await response.json()
        console.log('Response:', JSON.stringify(data, null, 2))
        
        if (data.success) {
            console.log('✓ Email sent successfully!')
        } else {
            console.log('✗ Failed to send email:', data.error)
        }
    } catch (err) {
        console.error('Error:', err.message)
    }
}

sendEmail()
