// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';


const sendEmail = async (email, link, type) => {
  let subject = "";
  let text = "";
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  if (type === 'PasswordReset') {
    subject = "Password Reset";
    text = `Click the following link to reset your password: ${link}`;
  } else if (type === 'Activation') { 
    subject = "Account Activation";
    text = `Click the following link to activate your account: ${link}`;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${type} email sent`);
  } catch (error) {
    console.error(`Error sending ${type.toLowerCase()} email(${email}):`, error);
    throw new Error(`Error sending ${type.toLowerCase()} email`);
  }
};

export default sendEmail;
