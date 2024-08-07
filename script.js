const BASE_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";
 
let users = [];

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html");
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

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
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

async function displayContacts(newUser = null) {
  await loadContacts("/contacts");
  users.sort((a, b) => a.name.localeCompare(b.name));
  let contactDisplay = document.getElementById("contact-content");
  contactDisplay.innerHTML = "";

  let sortAlphabet = '';
  users.forEach(user => {
    sortAlphabet = updateContactDisplay(contactDisplay, user, sortAlphabet, newUser);
  });
  highlightNewContact();
}

function updateContactDisplay(contactDisplay, user, sortAlphabet, newUser) {
  let firstLetter = user.name.charAt(0).toUpperCase();

  if (firstLetter !== sortAlphabet) {
    sortAlphabet = firstLetter;
    addAlphabetHeader(contactDisplay, sortAlphabet);
  }
  const isNew = newUser && user.name === newUser.name && user.email === newUser.email;
  contactDisplay.innerHTML += getContactCardHTML(user, isNew);
  return sortAlphabet;
}

function addAlphabetHeader(contactDisplay, sortAlphabet) {
  contactDisplay.innerHTML += `
    <div class="alphabet-contact-list">
      <span>${sortAlphabet}</span>                        
    </div>
    <div class="line-contact-list"></div>`;
}

function getContactCardHTML(user, isNew) {
  return `
    <div class="contact-card${isNew ? ' new' : ''}">
      <p>${user.name}</p>
      <p>${user.email}</p>
    </div>`;
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
  const contactDetails = document.getElementById("view-contacts");
  const contactContent = document.getElementById("contact-content");
  const mobileContactOption = document.getElementById("mobile-contact-option");
  detailDisplay.innerHTML = getContactDetailHTML(user);
  detailDisplay.style.display = 'block';
  contactDetails.style.display = 'block'; 
  mobileContactOption.classList.remove('d-none');
  if (window.innerWidth <= 655) {
    contactContent.style.display = 'none';
  }
}

function getContactDetailHTML(user){
  return`
    <div class="contact-card">
      <div>
        <div class="avatar-contact-details-section row">
          <div class="avatar" style="background-color:${assignRandomColors()}">${getInitials(user.name)}</div>
          <div class="name-actions-section-contact">
            <span>${user.name}</span>
            <div class="contact-actions">
              <div class="contact-actions-edit"><a href="#" onclick="editContact('${user.id}')"><img src="./assets/img/edit.svg" alt="Edit">Edit</a></div>
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
    </div>   
    
    `;

}

function backToContactList(){
  const contactContent = document.getElementById("contact-content");
  const contactDetails = document.getElementById("view-contacts");
  contactContent.style.display = 'block';
  if (window.innerWidth <= 655) {
    contactDetails.style.display = 'none';
  }
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
  }, 200); 
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

function editContact(id) {
  let popup = document.getElementById('edit-contact-overlay');
  showEditPopup(popup);

  const contact = users.find(user => user.id === id);
  populateEditForm(contact);
  setupEditSaveButton(id);
}

function showEditPopup(popup) {
  popup.classList.remove('d-none');
  setTimeout(() => {
    popup.classList.add('aktiv');
  }, 10);
}

function populateEditForm(contact) {
  document.getElementById("edit-name").value = contact.name;
  document.getElementById("edit-email").value = contact.email;
  document.getElementById("edit-phone").value = contact.phone;

  const editAvatar = document.getElementById("edit-avatar");
  editAvatar.style.backgroundColor = assignRandomColors();
  editAvatar.innerText = getInitials(contact.name);
}

function setupEditSaveButton(id) {
  const editSave = document.getElementById("save-edit-button");
  editSave.onclick = function(event) {
    event.preventDefault(); 
    updateContact(id);
  };
}

function updateContact(id) {
  const updatedContact = getUpdatedContactData();
  sendUpdateRequest(id, updatedContact)
    .then(response => {
      if (response.ok) {
        handleUpdateSuccess();
      }
    });
}

function getUpdatedContactData() {
  return {
    name: document.getElementById("edit-name").value,
    email: document.getElementById("edit-email").value,
    phone: document.getElementById("edit-phone").value
  };
}

function sendUpdateRequest(id, updatedContact) {
  return fetch(BASE_URL + `/contacts/${id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedContact)
  });
}

function handleUpdateSuccess() {
  loadContacts("/contacts").then(displayContacts);
  closeEditedContact();
}

function closeEditedContact(){
  let popup = document.getElementById('edit-contact-overlay');
  popup.classList.remove('aktiv');
  setTimeout(() => {
    popup.classList.add('d-none');
  }, 1000);
}

function backToContactList() {
  const contactContent = document.getElementById("contact-content");
  const contactDetails = document.getElementById("view-contacts");
  contactContent.style.display = 'block';
  if (window.innerWidth <= 655) {
    contactDetails.style.display = 'none';
  }
}

function openMobileContactOption() {
  let popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const overlay = document.getElementById("overlay-option");

  popup.classList.remove('d-none');
  overlay.classList.remove('d-none');
  mobileContactOption.classList.add("d-none");
  setTimeout(() => {
      popup.classList.add('aktiv');
      overlay.style.opacity = '1';
  }, 10); 
}

function closeMobileContactOption() {
  let popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const overlay = document.getElementById("overlay-option");
  
  popup.classList.remove('aktiv');
  overlay.style.opacity = '0';
  
  setTimeout(() => {
      popup.classList.add('d-none');
      overlay.classList.add('d-none');
      mobileContactOption.classList.remove("d-none");
  }, 300); // Match the transition duration
}

function handleResize() {
  const contactContent = document.getElementById("contact-content");
  const contactDetails = document.getElementById("view-contacts");
  if (window.innerWidth >= 655) {
    contactContent.style.display = 'block';
    contactDetails.style.display = 'block';
  }
  else if(window.innerWidth <= 655){
    contactDetails.style.display = 'none';
    document.getElementById("mobile-contact-option").classList.add("d-none");
  }
}

window.addEventListener('resize', handleResize);
handleResize();
