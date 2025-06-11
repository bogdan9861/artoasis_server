const nodemailer = require("nodemailer");

const sendEmail = (to, title, message) => {
  const directTransport = require("nodemailer-direct-transport");
  const fromHost = `mail.my`;
  const from = "ArtOasis" + "@" + fromHost; //придумываете свою почту(может быть несуществующая)
  const transport = nodemailer.createTransport(
    directTransport({
      name: fromHost,
      debug: true,
    })
  );
  transport.sendMail(
    {
      from,
      to,
      subject: title,
      html: `
         <p>${message}</p>
        `,
    },
    (err, data) => {
      console.log(data);

      if (err) {
        console.error("Ошибка при отправке:", err);
      } else {
        console.log("Письмо отправлено");
      }
    }
  );
};

module.exports = {
  sendEmail,
};
