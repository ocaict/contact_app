import nodeMailer from "nodemailer";
import { google } from "googleapis";
import credentials from "./credentials.js";

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_REFRESH_TOKEN,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI,
} = credentials;

const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: GMAIL_CLIENT_REFRESH_TOKEN });

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "sampleuser@mail.com",
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_CLIENT_REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: "OCAWEBTECH 📧",
      to,
      subject,
      text,
      html,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    return console.log(error);
  }
};

export default sendEmail;
