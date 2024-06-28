import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port:587,
  secure:false,
  auth: {
    user: "	karan.122roushan@gmail.com",
    pass: "	rcnwtrktajpataiz",
  },
});

const sendMail = async(from, to, subject, text) => {
  try {
    const mailOptions = {
      from:from,
      to:to,
      subject:subject,
      text:text,
    };
    console.log(mailOptions)
    const info = await transporter.sendMail(mailOptions);
    return (`message sent successfully ${info.messageId}`);
    // return info.messageId 
  } catch (error) {
    return (`error sending message: ${error}`);
  }
};

export default sendMail;
