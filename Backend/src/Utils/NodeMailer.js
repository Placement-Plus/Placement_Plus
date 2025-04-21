import nodemailer from "nodemailer"

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jarret.kessler95@ethereal.email',
            pass: 'KGm5xUAQMeFBMVXBjE'
        }
    });

    await transporter.sendMail({
        from: `"Your App" <jarret.kessler95@ethereal.email>`,
        to,
        subject,
        html,
    });
};

export { sendEmail }