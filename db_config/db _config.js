import sqlite3 from "sqlite3";
const db = new sqlite3.Database("database/contacts.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  imageurl TEXT,
  dob TEXT,
  date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  firstname TEXT,
  lastname TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  imageurl TEXT,
  dob TEXT,
  note TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)
`);

// Insert Contact
export function insertContact(
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
) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO contacts (user_id,firstname,lastname, email, phone, address, company, imageurl, dob, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        userId,
        firstname,
        lastname,
        email,
        phone,
        address,
        company,
        imageurl,
        dob,
        note,
      ],
      function (err) {
        if (err) {
          return reject("Error inserting contact:" + err.message);
        }
        return resolve(`Contact ${firstname} inserted with ID ${this.lastID}`);
      }
    );
  });
}

// Get All Contacts

export function getAllContacts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => {
      if (err) {
        reject("Error retrieving contacts:", err.message);
        return;
      }
      resolve(rows);
    });
  });
}

export function getContact(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject("Error retrieving contact:", err.message);
        return;
      }
      resolve(row);
    });
  });
}

// Update Contact
export function updateContact(
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
) {
  return new Promise((resolve, reject) => {
    let query = `
      UPDATE contacts
      SET firstname = ?,lastname = ?, email = ?, phone = ?, address = ?, company = ?, dob = ?, note = ?, imageurl = ?
      WHERE id = ?
    `;
    db.run(
      query,
      [
        firstname,
        lastname,
        email,
        phone,
        address,
        company,
        dob,
        note,
        imageurl,
        id,
      ],
      function (err) {
        if (err) {
          reject("Error updating contact:", err.message);
          return;
        }
        resolve(`Contact with ID ${id} updated`);
      }
    );
  });
}

export function deleteContact(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM contacts WHERE id = ?", [id], function (err) {
      if (err) {
        reject("Error deleting contact:", err.message);
        return;
      }
      resolve(`Contact with ID ${id} deleted`);
    });
  });
}

export default db;
