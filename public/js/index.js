import {
  addAppUser,
  addUser,
  clearInputs,
  deleteUser,
  getBirthDay,
  getNameInitial,
  getRandomNumber,
  getUser,
  getUsers,
  renderUsers,
  updateUser,
} from "./utils/module.js";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

$(document).ready(async () => {
  let users;
  const socket = io();
  socket.on("deleted", async (result) => {
    const users = await getUsers(usersUrl);
    renderUsers(contactListContainer, users);
    $(".socket-notice").text(`${result}`).fadeIn().fadeOut(6000);
  });

  const homePage = $(".home");
  const formPage = $(".contact-form");
  const contactListContainer = document.querySelector(".contact-list");

  const isLogin = false;
  const renderUrl = "https://contact-app-erdk.onrender.com";
  const baseurl = renderUrl
    ? renderUrl
    : document.URL.includes("192.168.8.1")
    ? "http://192.168.8.100:3600"
    : "http://localhost:3600";

  const usersUrl = baseurl + "/contacts";
  const userUrl = baseurl + "/contacts/";
  const postUrl = baseurl + "/contact";

  const imageInput = document.querySelector("#image-file");
  const submitBtn = document.querySelector(".save-btn");
  const imagePreview = document.querySelector(".image-preview");
  const closeFormBtn = document.querySelector(".close-btn");
  const contactForm = document.querySelector("#contact-form");
  const singleContactPage = $(".single-contact");
  const loginForm = document.querySelector(".login-form-container");
  const backBtn = document.querySelector(".single-contact .back-btn");
  const contactContainer = document.querySelector(
    ".single-contact .contact-wrapper"
  );
  const messageBox = document.querySelector(".message-box");
  const confirmMessageBox = document.querySelector(".confirm-box");
  const messageBoxOverlay = document.querySelector(".overlay");

  const formInputs = Array.from(contactForm.querySelectorAll("input"));
  const loginFormInputs = Array.from(loginForm.querySelectorAll("input"));
  const noteInput = document.querySelector("textarea");
  formInputs.push(noteInput);

  const daySelect = document.querySelector("#day");
  const monthSelect = document.querySelector("#month");
  const yearSelect = document.querySelector("#year");

  // Handle Message Boxes
  const showMessageBox = (title, body, className = "") => {
    messageBox.innerHTML = `
    <h2 class="title ${className}">${title}</h2>
    <p class="body ${className}">${body}</p>
    <div class="btn-group">
      <button class="btn btn-success close-message-btn">Ok</button>
    </div>
    `;
    messageBoxOverlay.classList.remove("hide");
    messageBox.classList.remove("hide");
  };

  const closeMessageBox = () => {
    messageBox.classList.add("hide");
    messageBoxOverlay.classList.add("hide");
  };
  messageBox.addEventListener("click", (e) => {
    if (e.target.className.includes("close-message-btn")) {
      return closeMessageBox();
    }
  });

  // Handle Confirm Messages

  const showConfirmMessageBox = (title, body) => {
    return new Promise((resolve, reject) => {
      confirmMessageBox.innerHTML = `
    <h2 class="title">${title}</h2>
       <p class="body">${body}</p>
       <small class="delete-notice" style="text-align: center;"></small>
       <div class="btn-group">
         <button class="btn btn-primary round pad cancel-btn">
           Cancel
         </button>
         <button class="btn btn-success round pad yes-btn">
           Yes
         </button>
       </div>
   `;
      messageBoxOverlay.classList.remove("hide");
      confirmMessageBox.classList.remove("hide");

      confirmMessageBox.addEventListener("click", (e) => {
        if (e.target.className.includes("cancel-btn")) {
          resolve("cancel");
          messageBoxOverlay.classList.add("hide");
          confirmMessageBox.classList.add("hide");
        } else if (e.target.className.includes("yes-btn")) {
          resolve("yes");
        }
      });
    });
  };

  const closeConfirmMessageBox = () => {
    confirmMessageBox.classList.add("hide");
    messageBoxOverlay.classList.add("hide");
  };

  // showConfirmMessageBox("Sure", "Delete?").then((data) => console.log(data));

  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Show Days
  let dayOptions = "";
  for (let i = 1; i <= 31; i++) {
    dayOptions += `<option value="${i}">${i}</option>`;
  }
  daySelect.innerHTML = dayOptions;

  // Show Months
  let monthOptions = "";
  months.forEach((month, i) => {
    monthOptions += `<option value="${i}">${month}</option>`;
  });

  monthSelect.innerHTML = monthOptions;

  // Year Options
  let yearOptions = "";
  for (let i = 1914; i <= 2020; i++) {
    yearOptions += `<option value="${i}" ${
      i == 2000 ? "selected" : ""
    }>${i}</option>`;
  }
  yearSelect.innerHTML = yearOptions;
  // GLOBALS
  let day = null;
  let month = null;
  let year = null;
  let imageurl = "";
  let isUpdate = false;
  let userToUpdate = null;
  imageInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = function () {
      imageurl = this.result;
      const image = document.createElement("img");
      image.src = imageurl;
      imagePreview.innerHTML = "";
      imagePreview.appendChild(image);
      imagePreview.style.background = "transparent";
    };
    fileReader.readAsDataURL(file);
  });

  closeFormBtn.addEventListener("click", () => {
    $(".contact-form").hide();
    clearInputs(formInputs);
    imagePreview.innerHTML = `<i class="fas fa-camera"></i>`;
    $(".home").show();
  });

  $(".show-form-btn").click(() => {
    $(".contact-form").show();
    $(".home").hide();
  });

  const getInputValues = (form) => {
    const data = {};
    form.forEach((input) => {
      data[input.name] = input.value;
    });

    return data;
  };

  // ADD OR UPDATE CONTACTS
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // const formData = new FormData(contactForm)
    let data = getInputValues(formInputs);

    if (imageurl) {
      data.imageurl = imageurl;
    } else {
      data.imageurl = "";
    }
    const dob = new Date(
      year || yearSelect.value,
      month || monthSelect.value,
      day || daySelect.value
    ).toLocaleDateString();
    data.dob = dob;
    data.userId = currentUser.user_id;

    if (!(data.firstname && data.phone))
      return showMessageBox(
        "Error",
        "Add at least Conatct Name and Phone",
        "error"
      );
    submitBtn.disabled = true;
    // Add New Contact
    if (!isUpdate) {
      const result = await addUser(postUrl, data);
      if (result.success) {
        const users = await getUsers(usersUrl, currentUser.user_id);
        submitBtn.disabled = false;
        renderUsers(contactListContainer, users);
        clearInputs(formInputs);
        imageurl = "";
        $(".file-label").html(
          `<p class="image-preview"><i class="fas fa-camera"></i></p`
        );
        $(".contact-form").hide();
        $(".home").show();
      } else {
        console.log(result.message);
      }
    } else {
      if (imageurl) {
        data.imageurl = imageurl;
      } else {
        data.imageurl = userToUpdate.imageurl;
      }

      const result = await updateUser(userUrl + userToUpdate.id, data);
      const users = await getUsers(usersUrl);
      renderUsers(contactListContainer, users);
      clearInputs(formInputs);

      $(".contact-form").hide();
      $(".home").show();
      isUpdate = false;
      submitBtn.disabled = false;
      imageurl = "";
      userToUpdate = null;
    }
  });

  backBtn.addEventListener("click", () => {
    formPage.hide();
    singleContactPage.hide();
    homePage.show();
  });

  contactListContainer.addEventListener("click", async (e) => {
    const contactElement = e.target.closest(".contact");
    const logoBG = contactElement.querySelector(".logo-bg");
    let profileBg = null;
    if (logoBG) {
      profileBg = window.getComputedStyle(logoBG).backgroundColor;
    }
    const user = await getUser(userUrl, contactElement.id);
    homePage.hide();
    formPage.hide();
    let html = `
    <div class="profile-img" style="background-color: ${
      profileBg ? profileBg : ""
    }">
    ${
      user.imageurl
        ? `<img class="d-block" src="${user.imageurl}" alt="${user.firstname}" />`
        : getNameInitial(user.firstname)
    }
  </div>
  <h2 class="name">${user.firstname} ${user.lastname} </h2>
  <p><strong>Address:</strong>: ${
    user.address ? user.address : "Add Address"
  }</p>
  <p><strong>Work Place:</strong> ${
    user.company ? user.company : "Add work place"
  }</p>
  <hr />
  <div class="btn-group">
    <div class="group phone">
    <a href="tel:+234${user.phone}">
    <i class="fas fa-phone"></i>
    <p>Call</p>
    </a>
    </div>
    <div class="group">
    <a href="sms:${user.phone}">
    <i class="fas fa-sms"></i>
    <p>Text</p>
    </a>
    </div>
    <div class="group">
    <a href="mailto:${user.email}" class=${user.email ? "email" : "no-email"} ${
      user.email ? "" : "disabled"
    } >
    <i class="fas fa-envelope"></i>
    <p>Email</p>
    </a>
    </div>
    <div class="group">
    <a href="https://wa.me/234${user.phone}?text=Hi">
      <i class="fab fa-whatsapp fa-xxl"></i>
      <p>WhatsApp</p>
      </a>
    </div>
  </div>
  <hr />
  <div class="phone-info">
    <div class="phone-icon"><i class="fas fa-phone"></i></div>
    <div>
      <p>${user.phone}</p>
      <p>Mobile</p>
    </div> 
  </div>
  <hr />
  <p class="note pad"><strong>DOB</strong>: ${
    user.dob
  } <br><strong>Birth Day</strong>: ${getBirthDay(user.dob)}</p>
  <p  class="note pad"><strong>Note</strong>: ${user.note}</p>

  <hr />
          <button class="btn edit-btn pad btn-primary round d-block" id="${
            user.id
          }">
            <i class="fas fa-edit edit-icon" id="${user.id}"></i> Edit contact
          </button>
          <button class="btn delete-btn pad btn-danger round d-block" id="${
            user.id
          }">
            <i class="fas fa-trash delete-icon" id="${
              user.id
            }"></i> Delete contact
          </button>
    `;
    contactContainer.innerHTML = html;
    singleContactPage.show();
  });

  const showEdit = async (id) => {
    const user = await getUser(userUrl, id);

    userToUpdate = user;
    $("#firstname").val(user.firstname);
    $("#lastname").val(user.lastname);
    $("#email").val(user.email);
    $("#phone").val(user.phone);
    $("#address").val(user.address);
    $("#company").val(user.company);
    $("#note").val(user.note);
    if (user.dob) {
      const dob = new Date(user.dob);
      // Dob
      $("#year").val(dob.getFullYear());
      $("#month").val(dob.getMonth());
      $("#date").val(dob.getDate());
    }

    if (user.imageurl) {
      imagePreview.innerHTML = `<img class="d-block" src="${user.imageurl}" alt="${user.firstname}" />`;
    } else {
      imagePreview.innerHTML = `<i class="fas fa-camera"></i>`;
    }
    singleContactPage.hide();
    homePage.hide();
    formPage.show();
  };

  contactContainer.addEventListener("click", async (e) => {
    if (
      e.target.className.includes("edit-btn") ||
      e.target.className.includes("edit-icon")
    ) {
      isUpdate = true;
      showEdit(e.target.id);
    } else if (
      e.target.className.includes("delete-btn") ||
      e.target.className.includes("delete-icon")
    ) {
      const contact = await getUser(userUrl, e.target.id);
      const data = await showConfirmMessageBox(
        "Pls Confirm",
        `Are you sure you want to delete this contact <b><em>${contact.firstname} ${contact.lastname}</em></b>?`
      );
      if (data === "yes") {
        $(".delete-notice").text("Deleting...");
        const result = await deleteUser(userUrl, e.target.id);
        const users = await getUsers(usersUrl);
        $(".delete-notice").text("");
        messageBoxOverlay.classList.add("hide");
        confirmMessageBox.classList.add("hide");

        renderUsers(contactListContainer, users);
        $(".contact-form").hide();
        singleContactPage.hide();
        $(".home").show();
        console.log(result);
      }
    }
  });

  daySelect.addEventListener("change", (e) => {
    day = e.target.value;
  });
  monthSelect.addEventListener("change", (e) => {
    month = e.target.value;
  });
  yearSelect.addEventListener("change", (e) => {
    year = e.target.value;
  });

  const colors = [
    "orange",
    "darkcyan",
    "purple",
    "gold",
    "blue",
    "green",
    "red",
  ];
  const logoImages = Array.from(document.querySelectorAll(".logo-bg"));

  const getRandomHexColor = () => {
    const hexCharacters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += hexCharacters.charAt(
        Math.floor(Math.random() * hexCharacters.length)
      );
    }

    return colors;
  };

  logoImages.forEach((logoImage) => {
    if (logoImage) {
      logoImage.style.backgroundColor = colors[getRandomNumber(colors)];
    }
  });

  // Socket Events
  socket.on("added_new_contact", async () => {
    const users = await getUsers(usersUrl);
    renderUsers(contactListContainer, users);
  });

  const timer = 1000;
  const allContacts = Array.from(document.querySelectorAll(".contact"));
  allContacts.forEach((contact) => {
    let interval = null;
    contact.addEventListener("mousedown", (e) => {
      interval = setTimeout(() => {
        console.log(contact);
        contact.classList.add("long-press");
      }, timer);
    });

    contact.addEventListener("mouseup", (e) => {
      clearInterval(interval);
    });
  });

  // User LOGICS

  const userImage = document.querySelector(".header-image");
  const showCurrentUser = (user) => {
    if (!user) return;
    userImage.src = user.imageurl || "./images/profile2.png";
    userImage.title = ` ${user?.username}`;
  };

  /* Show Home Page */
  if (currentUser) {
    users = await getUsers(usersUrl, currentUser.user_id);
    renderUsers(contactListContainer, users);
  }

  if (currentUser) {
    homePage.show();
    $(".login-form-container").hide();
    $(".signup-form-container").hide();
    formPage.hide();
    singleContactPage.hide();
    showCurrentUser(currentUser);
  } else {
    $(".login-form-container").show();
    $(".signup-form-container").hide();
    homePage.hide();
    formPage.hide();
    singleContactPage.hide();
  }

  userImage.addEventListener("click", (e) => {
    localStorage.removeItem("currentUser");
    $(".login-form-container").show();
    homePage.hide();
    formPage.hide();
    singleContactPage.hide();
  });
  // Login logic
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  function isCorrectUsername(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,9}$/;

    return usernameRegex.test(username);
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = getInputValues(loginFormInputs);

    if (!data.username.trim() || !data.password.trim())
      return showMessageBox(
        "Invalid",
        "Username and Password Required",
        "error"
      );

    if (isValidEmail(data.username) || isCorrectUsername(data.username)) {
      try {
        const res = await fetch(baseurl + "/user/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success)
          return showMessageBox("Error", result.message, "error");

        currentUser = result.user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        showCurrentUser(currentUser);
        clearInputs(loginFormInputs);
        const users = await getUsers(usersUrl, currentUser.user_id);
        renderUsers(contactListContainer, users);
        $(".login-form-container").hide();
        homePage.show();
        formPage.hide();
        singleContactPage.hide();
      } catch (error) {
        return showMessageBox("Error", error.message, "error");
      }

      return;
    }
    return showMessageBox(
      "Invalid",
      "Enter a valid Username or Email",
      "error"
    );
  });

  // SIGN UP LOGICS

  // Get User Image
  let userProfileImage = null;
  const userImageInput = document.querySelector("#user-image");
  const userImagePreview = document.querySelector(
    ".signup-form-container .image-preview"
  );

  userImageInput.addEventListener("change", (e) => {
    let file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = function () {
      userProfileImage = this.result;
      const image = document.createElement("img");
      image.src = userProfileImage;
      userImagePreview.innerHTML = "";
      userImagePreview.appendChild(image);
      userImagePreview.style.background = "transparent";
    };
    fileReader.readAsDataURL(file);
  });

  $(".login-link").click(() => {
    $(".signup-form-container").fadeOut();
    $(".login-form-container").fadeIn();
  });

  $(".signup-link").click(() => {
    $(".signup-form-container").fadeIn();
    $(".login-form-container").fadeOut();
  });

  const signUpForm = document.querySelector(".signup-form");
  const signupFormInputs = Array.from(signUpForm.querySelectorAll("input"));

  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userData = getInputValues(signupFormInputs);

    if (
      !userData.username.trim() ||
      !userData.email.trim() ||
      !userData.password.trim() ||
      !userData.password2.trim()
    )
      return showMessageBox("Error", "Fill All Required Fields", "error");
    if (userData.password !== userData.password2)
      return showMessageBox("Incorret!", "Passwords mismatched!!");
    if (userProfileImage) {
      userData.imageurl = userProfileImage;
    }
    const { error, result } = await addAppUser(baseurl, userData);
    if (error) return showMessageBox("Error!", error.message, "error");
    if (!result.success) return showMessageBox("Info", result.message, "info");

    userImagePreview.innerHTML = `<i class="fas fa-user"></i>`;
    clearInputs(signupFormInputs);
    userProfileImage = null;
    $(".signup-form-container").fadeOut();
    $(".login-form-container").fadeIn();
  });

  // END OF READY
});
// END OF READY
