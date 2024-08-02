const BASE_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];


function init() {
  loadContacts("/contacts").then(displayContacts);
}

async function loadContacts(path = "/contacts") {
  users = [];
  let userResponse = await fetch(BASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  console.log(responseToJson);

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
    console.log(users);
    return users;
  }
}

async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let emailValue = document.getElementById("email").value;
  let newUser = { name: nameValue, email: emailValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  await postContact("/contacts", newUser);
  await loadContacts("/contacts");
  displayContacts();
}

async function postContact(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function deleteContact(id) {
  let response = await fetch(BASE_URL + `/contacts/${id}.json`, {
    method: "DELETE",
  });
  if (!response.ok) {
    // console.error(`Fehler beim Löschen des Kontakts: ${response.statusText}`);
    return null;
  }
  let responseToJson = await response.json();
  // console.log(`Kontakt mit ID ${id} gelöscht:`, responseToJson);

  await loadContacts("/contacts");
  displayContacts();
  return responseToJson;
}

// might be interesting for you batool

// async function editContact(id, data = {}) {
//   await fetch(BASE_URL + `/contacts/${id}` + ".json", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }

async function displayContacts() {
  await loadContacts("/contacts");
  let contactDisplay = document.getElementById("contact-content");
  contactDisplay.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    contactDisplay.innerHTML += `
      <div class="contact-details-section row active">
        <div class="contact-details-profile mt-3 mb-3">${getInitials(
          user.name
        )}</div>
        <div class="contact-details flex-column">
            <span class="contact-details-name mt-3">${user.name}</span>
            <span class="contact-details-email">${user.email}</span>
        </div>
      </div>`;
  }
}

function getInitials(fullName) {
  let nameParts = fullName.split(" ");
  let firstLetters = nameParts.map((part) => part.charAt(0));
  let initials = firstLetters.join("");
  return initials;
}

// might be interesting for manuel
// id brauche wir für das deatil fenster

// <div class="just-border">
//     <div>
//         <Button onclick="deleteContact('${user.id}')">delete</Button>
//         <Button onclick="editContact()">edit</Button>
//     </div>
//     <span>${user.name}</span>
//     <span>${user.email}</span>
// </div>