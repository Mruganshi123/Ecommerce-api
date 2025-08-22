const nodemailer = require("nodemailer");
const templates = require("../../templates/email.template");

exports.sendEmail = async ({ to, subject, type, payload }) => {
    try {
        // 1. Generate Ethereal test account
        const testAccount = await nodemailer.createTestAccount();

        // 2. Create transporter using Ethereal SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for 587
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });


        const html = templates[type](payload);

        const info = await transporter.sendMail({
            from: '"Mruganshi 👩‍💻" <issuetracking@gmail.com>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};
