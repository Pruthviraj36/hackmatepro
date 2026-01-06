const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587');
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL;

console.log('--- SMTP Diagnostic ---');
console.log('Host:', host);
console.log('Port:', port);
console.log('User:', user);
console.log('From:', from);
console.log('Pass:', pass ? '********' : 'NOT SET');

const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
        user,
        pass,
    },
});

async function run() {
    try {
        console.log('\nVerifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from,
            to: user, // Send to self
            subject: 'HackMate SMTP Test',
            text: 'If you see this, your SMTP settings are working!',
        });
        console.log('✅ Email sent: %s', info.messageId);
    } catch (error) {
        console.error('\n❌ SMTP Error:', error);
    }
}

run();
