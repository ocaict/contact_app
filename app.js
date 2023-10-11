import express from "express";
import fs from "fs";
import events from "events";
const eventEmitter = new events.EventEmitter();

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";
import DB, {
  insertContact,
  updateContact,
  getAllContacts,
  getContact,
  deleteContact,
} from "./db_config/db _config.js";
import { errorHandler } from "./errorHandler/errorHandler.js";
import { logEvent } from "./event.js";
import { getIpAddress } from "./utils/getIPAddress.js";
const app = express();

const PORT = process.env.PORT || 3600;

const expressServer = app.listen(PORT, () => {
  console.log(`Local: http://localhost:${PORT}`);
  if (getIpAddress() !== "localhost")
    return console.log(`Network: http://${getIpAddress()}:${PORT}`);
});

const io = new Server(expressServer);
io.on("connection", (socket) => {
  console.log(`Connected : ${socket.id}`);
});

// Middle Wares
app.use(express.static(path.join("public")));
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));

app.post("/contact", async (req, res) => {
  const { firstname, lastname, email, phone, address, imageurl } = req.body;
  try {
    const result = await insertContact(
      firstname,
      lastname,
      email,
      phone,
      address,
      imageurl
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
});

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting contacts" });
  }
});
app.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContact(id);

    res.json(contact);
  } catch (error) {
    res.json("Error getting contacts");
  }
});

// Update Contact
app.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, address, company, imageurl } =
    req.body;
  try {
    const result = await updateContact(
      id,
      firstname,
      lastname,
      email,
      phone,
      address,
      company,
      imageurl
    );
    console.log(result);
    io.emit("added_new_contact");
    res.json({ success: true, message: "Contact Updated..." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to Update Contact" });
  }
});

// Delete Route
app.delete("/contacts/:id", async (req, res) => {
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
});

app.all("*", (req, res) => {
  const text = {
    success: false,
    message: `The content ${req.url
      .split("/")[1]
      .toLocaleUpperCase()} is not available`,
  };
  // logEvent(text.message, "logs", "404.log");
  logEvent(`UserAgent: ${req.headers["user-agent"]} `, "logs", "reqLog.log");
  res.send(text);
});

app.use(errorHandler);
