import sqlite3 from "sqlite3";
const db = new sqlite3.Database("database/contacts.db");

db.run(`
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY,
  firstname TEXT,
  lastname TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  imageurl TEXT,
  dob TEXT,
  note TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Insert Contact
export function insertContact(
  firstname,
  lastname,
  email,
  phone,
  address,
  imageurl
) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO contacts (firstname,lastname, email, phone, address, imageurl)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [firstname, lastname, email, phone, address, imageurl],
      function (err) {
        if (err) {
          return reject("Error inserting contact:" + err.message);
        }
        return resolve(`Contact ${firstname} inserted with ID ${this.lastID}`);
      }
    );
  });
}

// insertContact("Chigozie", "Oluegwu","chigo@gmail.com", "08092729", "Jos")

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
  imageurl
) {
  return new Promise((resolve, reject) => {
    let query = `
      UPDATE contacts
      SET firstname = ?,lastname = ?, email = ?, phone = ?, address = ?, company = ?, imageurl = ?
      WHERE id = ?
    `;
    db.run(
      query,
      [firstname, lastname, email, phone, address, company, imageurl, id],
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
// updateContact(1, "Blessing", "Okon", "bless@gamil.com", "0709262920", "Gombe", "OcaWebTech", "./images/profile.png")
// delete Contact
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
