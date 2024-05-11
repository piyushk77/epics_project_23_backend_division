const nodemailer = require('nodemailer');
const email_user = process.env.EMAIL_USER;
const email_password = process.env.EMAIL_PWD;

async function sendEmail(to, subject, message) {
    // Replace these with your email server details
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email_user,
            pass: email_password
        }
    });

    // Create the email options
    const mailOptions = {
        from: email_user,
        to: to,
        subject: subject,
        text: message
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Propagate the error up if needed
    }
}

module.exports = {
    sendEmail,
};
