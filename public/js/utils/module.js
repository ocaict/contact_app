export const getUsers = async (url, userId) => {
  try {
    const res = await fetch(`${url}?userId=${userId}`);
    if (!res.ok) throw new Error("Unable to reach the server");
    const data = await res.json();
    if (data.success) return data.contacts;
    return [];
  } catch (err) {
    return err;
  }
};

export const getUser = async (url, id) => {
  try {
    const res = await fetch(url + id);
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const getNameInitial = (name) => name.substring(0, 1).toUpperCase();

export const renderUsers = (htmlEle, users) => {
  if (!Array.isArray(users)) {
    htmlEle.innerHTML = `<h2 class="error">Something went wrong</h2>`;
    return;
  }
  if (!users?.length) {
    htmlEle.innerHTML = `<h2>Add Contacts</h2>`;
    return;
  }
  let html = "";
  users.forEach((user) => {
    html += ` <div class="contact" id="${user.id}">
        <div class="logo ${user.imageurl ? "" : "logo-bg"}">
         ${
           user.imageurl
             ? `<img src="${user.imageurl}" alt="${user.firstname}" />`
             : getNameInitial(user.firstname)
         }
        </div>
        <div class="name">${user.firstname} ${user.lastname}</div>
      </div>`;
  });

  htmlEle.innerHTML = html;
};

export const addUser = async (url, user) => {
  try {
    const res = await fetch(url, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(user),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const updateUser = async (url, user) => {
  try {
    const res = await fetch(url, {
      method: "put",
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(user),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const deleteUser = async (url, id) => {
  try {
    const res = await fetch(url + id, {
      method: "delete",
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const clearInputs = (inputs) => {
  inputs.forEach((input) => (input.value = ""));
};

export const getRandomNumber = (colors) => {
  const randomNumber = Math.floor(Math.random() * colors.length);
  return randomNumber;
};

export const getBirthDay = (dob = "1990,1,12") => {
  const dobInMilliseconds = new Date(dob).getTime();
  const today = Date.now();
  const currentYear = new Date(today).getFullYear();
  const nextBirthday = new Date(dobInMilliseconds);

  // Check if the birthday has already occurred this year
  if (
    nextBirthday.getMonth() < new Date(today).getMonth() ||
    (nextBirthday.getMonth() === new Date(today).getMonth() &&
      nextBirthday.getDate() < new Date(today).getDate())
  ) {
    nextBirthday.setFullYear(currentYear + 1);
  } else {
    nextBirthday.setFullYear(currentYear);
  }
  const birthday = new Date(nextBirthday).toDateString();
  return birthday;
};
