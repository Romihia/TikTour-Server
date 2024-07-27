import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<p>You requested for a password reset</p><p>Click this <a href="${resetLink}">link</a> to reset your password</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
