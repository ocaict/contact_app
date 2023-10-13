import nodeMailer from "nodemailer";
import "dotenv/config";

const sendEmail = ({ to, subject, text, html }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    transporter.sendMail(
      {
        from: `OCAWEBTECH 📧 <noreply@gmail.com>`,
        to,
        subject,
        text,
        html,
      },
      (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      }
    );
  });
};

export default sendEmail;
