import { logEvent } from "../event.js";

import {
  insertContact,
  updateContact,
  getAllContacts,
  getContact,
  deleteContact,
} from "../db_config/db _config.js";
import { io } from "../app.js";

export const addContactRoute = async (req, res) => {
  const {
    userId,
    firstname,
    lastname,
    email,
    phone,
    address,
    imageurl,
    company,
    dob,
    note,
  } = req.body;

  try {
    const result = await insertContact(
      userId,
      firstname,
      lastname,
      email,
      phone,
      address,
      imageurl,
      company,
      dob,
      note
    );
    io.emit("added_new_contact");
    return res.send({ success: true, contact: req.body });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Unable to add contact due to error from the server",
    });
  }
};

export const getContactsRoute = async (req, res) => {
  const userId = req.query.userId;
  try {
    const contacts = await getAllContacts(userId);
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting contacts" });
  }
};

export const getContactRoute = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContact(id);

    res.json(contact);
  } catch (error) {
    res.json("Error getting contacts");
  }
};

export const updateContactRoute = async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    email,
    phone,
    address,
    company,
    imageurl,
    dob,
    note,
  } = req.body;
  try {
    const result = await updateContact(
      id,
      firstname,
      lastname,
      email,
      phone,
      address,
      company,
      imageurl,
      dob,
      note
    );
    console.log(result);
    io.emit("added_new_contact");
    res.json({ success: true, message: "Contact Updated..." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to Update Contact" });
  }
};

export const deleteContactRoute = async (req, res) => {
  const { id } = req.params;
  const result = await deleteContact(id);
  console.log(result);
  io.emit("deleted", result);
  res.json({ success: true, message: "Contact Deleted..." });
  try {
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Unable to Delete Contact" });
  }
};

export const notFoundRoute = (req, res) => {
  if (req.url === "/privacy.html") {
    return res.redirect("/privacy");
  } else if (req.url === "/terms.html") {
    return res.redirect("/terms");
  } else if (req.url === "/error.html") {
    return res.redirect("/error");
  } else if (req.url === "/success.html") {
    return res.redirect("/success");
  } else {
    const text = {
      success: false,
      message: `The content you are looking for is not available`,
    };
    // logEvent(text.message, "logs", "404.log");
    // logEvent(`UserAgent: ${req.headers["user-agent"]} `, "logs", "reqLog.log");
    return res.send(text);
  }
};
