const nodemailer = require("nodemailer");

async function sendMail(mails, subject, html) {
  const emailUser = {
    adress: "reportes@constructoracolonial.com.ar",
    pass: "e*5G7)4*EHD$",
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.constructoracolonial.com.ar",
    port: 465,
    secure: true,
    auth: {
      user: emailUser.adress,
      pass: emailUser.pass,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Reportes Colonial" <' + emailUser.adress + ">", // sender address
    to: mails.join(", "), // list of receivers
    subject, // Subject line
    html: `
        <h1>Reportes semanales - Colonial</h1>
        <p>Se adjuntan los reportes semanales.</p>
        ${html}
        <p>Saludos,</p>
        <p>Equipo de desarrollo</p>
        <p>Constructora Colonial</p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default sendMail;
