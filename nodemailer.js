const nodemailer = require("nodemailer");
const fs = require("fs");

//takes 3 parameters, subject, the text to the email and the recipient
const mailer = (subject, text, recipient) => {
  let transporter = nodemailer.createTransport({
    /*port: 587,
    host: "smtp.ethereal.email",
    auth: {
      user: "brenden.heaney74@ethereal.email",
      pass: "eF6rE2vuTx4MDeS5U9",
    },*/
    service: "Gmail",
    auth: {
      user: "fantasticelastic2021",
      pass: "2021pulsen!", //password till email här
    },
  });

  let mailMessage = {
    //from: "test@localhost",
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
