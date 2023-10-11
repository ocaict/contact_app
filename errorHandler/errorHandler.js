import { logEvent } from "../event.js";

export function errorHandler(err, req, res, next) {
  if (err) {
    logEvent(err.message, "logs", "errorLog.log");
    res.json({ message: "Somthing happened" });
  }
}
