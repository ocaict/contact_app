import bcrypt from "bcrypt";
import crypto from "crypto";
export const usersTokens = [];

const getHTML = (baseurl, username, token) => {
  const html = `
  <div>
  <h1 style="padding: 10px;">Hi ${username}, Please Verify your email account to continue</h1>
  <p style="margin: 10px auto;">Please click the button below to verify your account</p>
  <p> <a
  style="
    text-decoration: none;
    font-size: 18px;
    padding: 8px 10px;
    color: darkcyan;
  "
  href="${baseurl}/email-verification?token=${token}"
  target="_blank"
>
  Verify Now</a
></p>
  
  
  </div>
  `;
  return html;
};

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
  return strongPasswordRegex.test(password);
}

function isCorrectUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,9}$/;

  return usernameRegex.test(username);
}

function isNigerianPhoneNumber(phoneNumber) {
  const nigerianPhoneNumberRegex = /^0[789]\d{9}$/;
  return nigerianPhoneNumberRegex.test(phoneNumber);
}

import {
  addUser,
  getUserByUsernameOrEmailAndPassword,
  getUserByUsernameOrEmail,
} from "../controllers/userController.js";
import sendEmail from "../mailer/mailer.js";

export const addUserRoute = async (req, res) => {
  const {
    username,
    firsname,
    lastname,
    email,
    password,
    phone,
    address,
    imageurl,
    dob,
  } = req.body;

  if (!username || !email || !password)
    return res.status(403).send({
      success: false,
      message: "Fill all required fields",
    });

  if (!isCorrectUsername(username))
    return res.status(403).send({
      success: false,
      message: "Enter Correct Username",
    });

  if (!isValidEmail(email))
    return res.status(403).send({
      success: false,
      message: "Email Address is Invalid",
    });

  if (!isStrongPassword(password))
    return res.status(403).send({
      success: false,
      message:
        "Password is weak. It should contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.",
    });

  if (phone) {
    if (!isNigerianPhoneNumber(phone))
      return res.status(403).send({
        success: false,
        message: "Invalid Phone Number",
      });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const foundUser = await getUserByUsernameOrEmail(username, email);
    if (foundUser)
      return res.status(403).send({
        success: false,
        message: `User with email or username already exist`,
      });

    const token = crypto.randomBytes(32).toString("hex");
    usersTokens.push({ username, token });

    // const emailResult = await sendEmail({
    //   to: email,
    //   subject: "Verify Your Acount",
    //   html: getHTML("https://contact-app-erdk.onrender.com", username, token),
    // });

    // console.log("Email Result", emailResult);
    const result = await addUser(
      username,
      firsname,
      lastname,
      email,
      phone,
      hashedPassword,
      address,
      imageurl,
      dob
    );
    console.log(result);
    return res.status(201).send({
      success: true,
      message: "Please Verify Your Email",
    });
  } catch (error) {
    res
      .status(501)
      .send({ success: false, message: "Error Occured from the server" });
  }

  // const result = await addUser(
  // "paul",
  // "Paul",
  // "Edward",
  // "paul@gmail.com",
  // "080926298",
  // "1234",
  // "Jos",
  // "",
  // ""
  // );
  // console.log(result);
};

export const getUserRoute = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(403)
      .send({ success: false, message: "Fill Login details" });

  try {
    const user = await getUserByUsernameOrEmailAndPassword(username);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Invalid Log In Credentials" });
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res.status(401).send({
        success: false,
        message: "Invalid User Credentials",
      });
    return res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server Error" });
  }
};

// Email Verification Route
export const emailVerificationRoute = (req, res) => {
  const token = req.query.token;
  const foundToken = usersTokens.find((user) => user.token === token);
  if (!foundToken) return res.redirect("/error");
  return res.redirect("/success");
};
