const nodemailer = require("nodemailer");

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "mail.troknit.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"Smart Notes" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
  });
};
