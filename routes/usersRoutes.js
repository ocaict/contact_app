import bcrypt from "bcrypt";

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

    return res.status(201).send({
      success: true,
      message: result,
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
  try {
    const user = await getUserByUsernameOrEmailAndPassword("mafeng", "1234");
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};
