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

import { errorHandler } from "./errorHandler/errorHandler.js";
import { getIpAddress } from "./utils/getIPAddress.js";
import {
  addContactRoute,
  deleteContactRoute,
  getContactRoute,
  getContactsRoute,
  notFoundRoute,
  updateContactRoute,
} from "./routes/routes.js";

const app = express();

const PORT = process.env.PORT || 3600;

const expressServer = app.listen(PORT, () => {
  console.log(`Local: http://localhost:${PORT}`);
  if (getIpAddress() !== "localhost")
    return console.log(`Network: http://${getIpAddress()}:${PORT}`);
});

export const io = new Server(expressServer);
io.on("connection", (socket) => {
  console.log(`Connected : ${socket.id}`);
});

// Middle Wares
app.use(express.static(path.join("public")));
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));

app.post("/contact", addContactRoute);

app.get("/contacts", getContactsRoute);

app.get("/contacts/:id", getContactRoute);

// Update Contact
app.put("/contacts/:id", updateContactRoute);

// Delete Route
app.delete("/contacts/:id", deleteContactRoute);

app.all("*", notFoundRoute);

app.use(errorHandler);
