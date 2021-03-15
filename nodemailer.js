const nodemailer = require("nodemailer");

//takes 3 parameters, subject, the text to the email and the recipient
const mailer = (subject, text, recipient) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "fantasticelastic2021",
      pass: "2021pulsen!", //password till email här
    },
  });

  let mailMessage = {
    to: recipient, //Mottagare här
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailMessage, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent!");
      console.log(res);
    }
  });
};
exports.mailer = mailer;
