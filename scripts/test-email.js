const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('STMP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_USER:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@hackmate.com',
            to: process.env.SMTP_USER, // Send to self
            subject: 'HackMate Email Test',
            text: 'If you are reading this, the email configuration is working!',
            html: '<b>If you are reading this, the email configuration is working!</b>',
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Success! Email sent successfully.');
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}

testEmail();
