/**
 * Initializes the contacts by loading and displaying them, and handles window resize events.
 */
function init() {
  loadContacts("/contacts").then(displayContacts);
  handleResize();
}

/**
 * Adds a new user to the contact list by retrieving input values, resetting the input fields, 
 * posting the new contact to the server, and updating the contact list.
 */
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

/**
 * Displays the contact details for a selected user and updates the display state for mobile or desktop view.
 * @param {Object} user - The user object containing contact details.
 */
function showContactDetails(user) {
  highlightSelectedContact(user.email);
  
  const contactContent = document.getElementById("contact-content");
  const viewContacts = document.getElementById("contact-display");
  const contactDetails = document.getElementById("contact-detail");
  const contactList = document.getElementById("contact-list");
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const buttonBack = document.getElementById("btnBack");
  getUserIdForMobile(user);
 
  if (isDetailDisplayActive(contactContent)) {
    closeCurrentDetail(contactContent, user);
  } else {
    openNewDetail(contactContent, user);
  }
  updateDisplayStates(viewContacts, contactList, contactDetails, mobileContactOption, buttonBack);
}

/**
 * Sets the mobile edit and delete button actions with the user's ID.
 * @param {Object} user - The user object containing contact details.
 */
function getUserIdForMobile(user){
  const editButton = document.getElementById("mobile-button-edit");
  const deleteButton = document.getElementById("mobile-button-delete");

  editButton.setAttribute("onclick", `editContact(${JSON.stringify(user.id)})`);
  deleteButton.setAttribute("onclick", `deleteContact(${JSON.stringify(user.id)})`);
}

/**
 * Checks if the contact detail display is currently active.
 * @param {HTMLElement} detailDisplay - The DOM element representing the contact detail display.
 * @returns {boolean} - True if the detail display is active, otherwise false.
 */
function isDetailDisplayActive(detailDisplay) {
  return detailDisplay.classList.contains('aktiv');
}

/**
 * Closes the current contact detail display with an animation and opens a new one.
 * @param {HTMLElement} detailDisplay - The DOM element representing the contact detail display.
 * @param {Object} user - The user object containing contact details.
 */
function closeCurrentDetail(detailDisplay, user) {
  detailDisplay.classList.remove('aktiv');
  setTimeout(() => {
    updateDetailContent(detailDisplay, user);
    openDetailWithAnimation(detailDisplay);
  }, 100);
}

/**
 * Opens a new contact detail display with an animation.
 * @param {HTMLElement} detailDisplay - The DOM element representing the contact detail display.
 * @param {Object} user - The user object containing contact details.
 */
function openNewDetail(detailDisplay, user) {
  updateDetailContent(detailDisplay, user);
  detailDisplay.classList.remove('d-none');
  openDetailWithAnimation(detailDisplay);
}

/**
 * Updates the content of the contact detail display with the selected user's details.
 * @param {HTMLElement} detailDisplay - The DOM element representing the contact detail display.
 * @param {Object} user - The user object containing contact details.
 */
function updateDetailContent(detailDisplay, user) {
  detailDisplay.innerHTML = getContactDetailHTML(user);
}

/**
 * Adds an animation class to the contact detail display to make it active.
 * @param {HTMLElement} detailDisplay - The DOM element representing the contact detail display.
 */
function openDetailWithAnimation(detailDisplay) {
  setTimeout(() => {
    detailDisplay.classList.add('aktiv');
  }, 10); 
}

/**
 * Updates the display states for contact list, detail display, and mobile options based on the screen width.
 * @param {HTMLElement} viewContacts - The DOM element representing the view contacts section.
 * @param {HTMLElement} contactList - The DOM element representing the contact list.
 * @param {HTMLElement} contactDetails - The DOM element representing the contact detail section.
 * @param {HTMLElement} mobileContactOption - The DOM element representing the mobile contact option.
 * @param {HTMLElement} buttonBack - The DOM element representing the back button.
 */
function updateDisplayStates(viewContacts, contactList, contactDetails, mobileContactOption, buttonBack) {
  viewContacts.style.display = 'block';
  mobileContactOption.classList.remove('d-none');

  if (window.innerWidth <= 850) {
    contactList.classList.add('d-none');
    contactDetails.classList.add('d-none');
    buttonBack.classList.remove('d-none');
    mobileContactOption.classList.remove('d-none');
  }
}

/**
 * Returns the display to the contact list from the contact detail view, adjusting for mobile or desktop.
 */
function backToContactList() {
  const contactList = document.getElementById("contact-list");
  const contactDetails = document.getElementById("contact-detail");
  const contactDisplay = document.getElementById("contact-display");
  changeToAddButton();
  contactList.classList.remove("d-none");
  contactDetails.classList.remove("d-none");
  if (window.innerWidth <= 850) {
    contactDisplay.style.display = 'none';
  }
}

/**
 * Handles the resize event to adjust the display of the contact list, detail view, and mobile options.
 */
function handleResize() {
  const contactList = document.getElementById("contact-list");
  const contactDetails = document.getElementById("contact-detail");
  const contactDisplay = document.getElementById("contact-display");
  if (window.innerWidth >= 850) {
    contactList.classList.remove("d-none");
    contactDetails.classList.remove("d-none");
    contactDisplay.style.display = 'block';
  }
  else if(window.innerWidth <= 850){
    // contactDisplay.style.display = 'none';
    document.getElementById("mobile-contact-option").classList.remove("d-none");
    document.getElementById("btnBack").classList.add("d-none");
  }
}

window.addEventListener('resize', handleResize);
handleResize();

/**
 * Highlights the selected contact in the list by adding an active class.
 * @param {string} id - The ID of the contact to highlight.
 */
function highlightSelectedContact(id){
  clearSelectedHighlight();
  const contactSection = document.getElementById("contact-item-"+id);
  contactSection.classList.add("active");
}

/**
 * Clears any active highlight from the contact list.
 */
function clearSelectedHighlight(){
  const contactDetailsSections = document.getElementsByClassName("single-contact");
  const contactDetailsArray = Array.from(contactDetailsSections);

  contactDetailsArray.forEach(section => {
      section.classList.remove("active");
  });
}

/**
 * Opens the mobile contact options popup.
 */
function openMobileContactOption() {
  const popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");

  popup.classList.remove('d-none');
  popup.classList.add('aktiv');
  mobileContactOption.classList.add("d-none");
  closeMobileAddB();
  document.addEventListener('click', handleDocumentClick);
}

/**
 * Closes the mobile contact options popup.
 */
function closeMobileContactOption() {
  const popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");

  popup.classList.remove('aktiv');
  popup.classList.add('d-none');
  mobileContactOption.classList.remove("d-none");
  addMobileAddB();

  document.removeEventListener('click', handleDocumentClick);
}

/**
 * Handles clicks outside the popup to close the mobile contact options.
 * @param {Event} event - The click event.
 */
function handleDocumentClick(event) {
  const popup = document.getElementById('mobile-contact-option-popup');
  const trigger = document.getElementById('mobile-contact-option');

  if (!popup.contains(event.target) && event.target !== trigger) {
    closeMobileContactOption();
  }
}

/**
 * Changes the display to show the add button on mobile view.
 */
function changeToAddButton() {
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const imageContainer = document.getElementById('mobile-add-button');
 
  mobileContactOption.classList.add("d-none");
  imageContainer.classList.remove('d-none');
}

/**
 * Hides the mobile add button.
 */
function closeMobileAddB() {
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.add('d-none');
}

/**
 * Displays the mobile add button.
 */
function addMobileAddB() {
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.remove('d-none');
}

