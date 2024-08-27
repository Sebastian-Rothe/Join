/**
 * Opens the edit contact popup, populates the form with the selected contact's details, 
 * and sets up the save button with the correct event handler.
 * @param {number} id - The ID of the contact to edit.
 */
function editContact(id) {
    let popup = document.getElementById('edit-contact-overlay');
    showEditPopup(popup);
  
    const contact = users.find(user => user.id === id);
    populateEditForm(contact);
    setupEditSaveButton(id);
}

/**
 * Displays the edit contact popup with a fade-in animation.
 * @param {HTMLElement} popup - The DOM element representing the popup.
 */
function showEditPopup(popup) {
    popup.classList.remove('d-none');
    setTimeout(() => {
      popup.classList.add('aktiv');
    }, 10);
}

/**
 * Fills the edit form with the selected contact's details and updates the avatar.
 * @param {Object} contact - The contact object containing the current details.
 */  
function populateEditForm(contact) {
    document.getElementById("edit-name").value = contact.name;
    document.getElementById("edit-email").value = contact.email;
    document.getElementById("edit-phone").value = contact.phone;
  
    const editAvatar = document.getElementById("edit-avatar");
    editAvatar.style.backgroundColor = assignRandomColors();
    editAvatar.innerText = getInitials(contact.name);
}

  /**
 * Sets up the save button in the edit form to trigger the update process for the selected contact.
 * @param {number} id - The ID of the contact to update.
 */
function setupEditSaveButton(id) {
    const editSave = document.getElementById("save-edit-button");
    editSave.onclick = function(event) {
      event.preventDefault(); 
      updateContact(id);
    };
}

  /**
 * Sends the updated contact data to the server and updates the contact list upon success.
 * @param {number} id - The ID of the contact being updated.
 */
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

/**
 * Retrieves the updated contact data from the edit form.
 * @returns {Object} - The updated contact data.
 */
function getUpdatedContactData() {
    return {
      name: document.getElementById("edit-name").value,
      email: document.getElementById("edit-email").value,
      phone: document.getElementById("edit-phone").value
    };
}

  /**
 * Sends a PUT request to the server to update the contact data.
 * @param {number} id - The ID of the contact being updated.
 * @param {Object} updatedContact - The updated contact data.
 * @returns {Promise} - The fetch promise resolving to the server response.
 */
function sendUpdateRequest(id, updatedContact) {
    return fetch(BASE_URL + `/contacts/${id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedContact)
    });
}
  
/**
 * Handles the successful update of the contact by reloading and displaying the updated contact list.
 */
function handleUpdateSuccess() {
    loadContacts("/contacts").then(displayContacts);
    closeEditedContact();
}

/**
 * Closes the edit contact popup with a fade-out animation.
 */
function closeEditedContact(){
    let popup = document.getElementById('edit-contact-overlay');
    popup.classList.remove('aktiv');
    setTimeout(() => {
      popup.classList.add('d-none');
    }, 1000);
}

/**
 * Updates the contact display by adding a new contact card and sorting alphabetically by the first letter of the contact's name.
 * @param {HTMLElement} contactDisplay - The DOM element representing the contact display.
 * @param {Object} user - The contact object containing user details.
 * @param {string} sortAlphabet - The current alphabet sorting letter.
 * @param {Object} newUser - The newly added user to highlight.
 * @returns {string} - The updated alphabet sorting letter.
 */
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