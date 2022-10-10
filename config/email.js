const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
        user: 'kittipongpon91@gmail.com',
        pass: 'xujvruykezbtksmz'
    }
    });

    await transporter.sendMail({
      from: 'kittipongpon91@gmail.com',
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