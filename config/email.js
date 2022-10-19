const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
    
    service: process.env.SERVICE,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
    });

    await transporter.sendMail({
      from:process.env.MAIL,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;