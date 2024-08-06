
let profileColors = [
  '#FF5733', // Rot
  '#33FF57', // Grün
  '#3357FF', // Blau
  '#FF33A6', // Pink
  '#FFA500', // Orange
  '#FFD700', // Gold
  '#8A2BE2', // Blauviolett
  '#7FFFD4', // Aquamarin
  '#FF4500', // Orangerot
  '#3E6020'  // Dunkelolivgrün
];

const BASE_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

function init() {
  loadContacts("/contacts").then(displayContacts);
}

// function to include other html files 
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html"
      let resp = await fetch(file);
      if (resp.ok) {
          element.innerHTML = await resp.text();
      } else {
          element.innerHTML = 'Page not found';
      }
  }
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
  displayContacts(newUser);
}

function addNewContactToDisplay(user) {
  const contactDisplay = document.getElementById("contact-content");
  const contactHTML = getContactCardHTML(user, true);
  contactDisplay.innerHTML += contactHTML;
  highlightNewContact();
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
  const detailDisplay = document.getElementById("contact-details");
  let response = await fetch(BASE_URL + `/contacts/${id}.json`, {
    method: "DELETE",
  });
  if (!response.ok) {
    return null;
  }
  let responseToJson = await response.json();
  await loadContacts("/contacts");
  displayContacts();
  detailDisplay.style.display = 'none';
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

async function displayContacts(newUser = null) {
  await loadContacts("/contacts");
  users.sort((a, b) => a.name.localeCompare(b.name));
  
  let contactDisplay = document.getElementById("contact-content");
  contactDisplay.innerHTML = "";
  let sortAlphabet = '';

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let firstLetter = user.name.charAt(0).toUpperCase();

    if (firstLetter !== sortAlphabet) {
      sortAlphabet = firstLetter;
      contactDisplay.innerHTML += `
        <div class="alphabet-contact-list">
          <span>${sortAlphabet}</span>                        
        </div>
        <div class="line-contact-list"></div>`;
    }
    const isNew = newUser && user.name === newUser.name && user.email === newUser.email;
    contactDisplay.innerHTML += getContactCardHTML(user, isNew);
  }
  highlightNewContact();
}

function getContactCardHTML(user, isNew) {
  return `
    <div class="contact-details-section row ${isNew ? 'new-contact' : ''}" onclick='showContactDetails(${JSON.stringify(user)})'>
        <div class="contact-details-profile mt-3 mb-3" style="background-color:${assignRandomColors()}">
            ${getInitials(user.name)}
        </div>
        <div class="contact-details flex-column">
            <span class="contact-details-name mt-3">${user.name}</span>
            <span class="contact-details-email">${user.email}</span>
        </div>
    </div>`;
}

function showContactDetails(user) {
  const detailDisplay = document.getElementById("contact-details");
  detailDisplay.innerHTML = `
    <div class="contact-card">
      <div>
        <div class="avatar-contact-details-section row">
          <div class="avatar" style="background-color:${assignRandomColors()}">${getInitials(user.name)}</div>
          <div class="name-actions-section-contact">
            <span>${user.name}</span>
            <div class="contact-actions">
              <div class="contact-actions-edit"><a href="#"><img src="./assets/img/edit.svg" alt="Edit">Edit</a></div>
              <div class="contact-actions-delete"><a href="#" onclick="deleteContact('${user.id}')"><img src="./assets/img/delete.svg" alt="Delete">Delete</a></div>
            </div>
          </div>
        </div>
        <div class="contact-info">
          <div class="info">contact information</div>
          <p><strong>Email</strong></p>
          <p><a href="mailto:${user.email}">${user.email}</a></p>
          <p><strong>Phone</strong></p>
          <p>${user.phone}</p>
        </div>
      </div>
    </div>`;
  detailDisplay.style.display = 'block'; // Ensure the details section is visible
}

function highlightNewContact() {
  setTimeout(() => {
    const newContactElement = document.querySelector('.contact-details-section.new-contact');

    if (newContactElement) {
      newContactElement.classList.add('highlight');

      setTimeout(() => {
        newContactElement.classList.remove('highlight');
        newContactElement.classList.remove('new-contact');
      }, 3000); 
    } 
  }, 100); 
}

function getInitials(fullName) {
  let nameParts = fullName.split(" ");
  let firstLetters = nameParts.map((part) => part.charAt(0));
  let initials = firstLetters.join("");
  assignRandomColors();
  return initials;
}

function assignRandomColors() {
  return profileColors[Math.floor(Math.random() * profileColors.length-1)]
}

