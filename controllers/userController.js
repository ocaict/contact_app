import db from "../db_config/db _config.js";
// Insert Contact

/* 
   username TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL,
  address TEXT,
  imageurl TEXT,
  dob TEXT,

*/
// Add a User
export function addUser(
  username,
  firstname,
  lastname,
  email,
  phone,
  password,
  address,
  imageurl,
  dob
) {
  return new Promise((resolve, reject) => {
    let query = `
        INSERT INTO users (username,first_name,last_name, email, phone, password, address, imageurl, dob)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    db.run(
      query,
      [
        username,
        firstname,
        lastname,
        email,
        phone,
        password,
        address,
        imageurl,
        dob,
      ],
      function (err) {
        if (err) {
          return reject("Error inserting user:" + err.message);
        }
        return resolve(`user ${username} inserted with ID ${this.lastID}`);
      }
    );
  });
}

// Get User by userName or Email

export function getUserByUsernameOrEmailAndPassword(username, password) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ? AND password = ?",
      [username, username, password],
      (err, row) => {
        if (err) {
          reject("Error retrieving user:", err.message);
          return;
        }
        resolve(row);
      }
    );
  });
}
export function getUserByUsernameOrEmail(username, email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      (err, row) => {
        if (err) {
          reject("Error retrieving user:", err.message);
          return;
        }
        resolve(row);
      }
    );
  });
}
