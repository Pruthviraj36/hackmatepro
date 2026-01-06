const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL;

console.log('--- SMTP Diagnostic (Service: Gmail) ---');
console.log('User:', user);
console.log('From:', from);
console.log('Pass:', pass ? '********' : 'NOT SET');

const transporter = nodemailer.createTransport({
    service: 'gmail',
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
            subject: 'HackMate SMTP Test (Service: Gmail)',
            text: 'If you see this, your Gmail service settings are working!',
        });
        console.log('✅ Email sent: %s', info.messageId);
    } catch (error) {
        console.error('\n❌ SMTP Error:', error);
    }
}

run();
