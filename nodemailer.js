const nodemailer = require("nodemailer");

const mailer = (subject, text) => {
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
      pass: "password", //password till email här
    },
  });

  let mailMessage = {
    //from: "test@localhost",
    to: "", //Mottagare här
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailMessage, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent!");
      console.log(JSON.stringify(res));
    }
  });
};
exports.mailer = mailer;