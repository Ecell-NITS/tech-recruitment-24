import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ECELL,
    pass: process.env.EMAIL_PWD_ECELL,
  },
});

const sendEmail = (to, subject, text,html) => {
  const mailOptions = {
    from: process.env.EMAIL_ECELL,
    to: to,
    subject: subject,
    text: text,
    html:html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendEmail;