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
          loadContacts("/contacts").then(contacts => {
              const freshContact = contacts.find(contact => contact.id === id); 
              showContactDetails(freshContact);
              handleUpdateSuccess();
          });
          closeEditedContact(); 
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