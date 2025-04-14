import nodemailer from "nodemailer"

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'travon.morar50@ethereal.email',
            pass: 'QWg9bP84mEBbxPBYes'
        }
    });

    await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

export { sendEmail }