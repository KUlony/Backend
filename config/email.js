const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text,text1,text2) => {
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
      
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the KUlony.</h2>
        <h4>${text1}</h4>
        <p style="margin-bottom: 30px;">${text2}</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${text}</h1>
   </div>
    `
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;