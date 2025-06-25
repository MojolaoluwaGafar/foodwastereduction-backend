const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // your app password or Gmail password
  },
});

exports.sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"WasteLess Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your WasteLess password",
    html: `
      <div style="font-family:sans-serif; line-height:1.5">
        <h2>Password Reset</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="padding:10px 20px; background:#16a34a; color:white; border-radius:5px; text-decoration:none">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
exports.sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"WasteLess Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to WasteLess!",
    html: `
      <div style="font-family:sans-serif; line-height:1.5">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining WasteLess. We're excited to have you on board!</p>
        <p>Start exploring our features and let us know if you have any questions.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};