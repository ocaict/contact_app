export const getUsers = async (url) => {
  try {
    const res = await fetch(url);
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

export const getNameInitial = (name) => name.substring(0, 1);

export const renderUsers = (htmlEle, users) => {
  console.log(users);
  if (!users?.length) {
    htmlEle.innerHTML = `<h2 class="error">Unable to get Users</h2>`;
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
