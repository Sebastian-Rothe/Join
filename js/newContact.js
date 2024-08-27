/**
 * Displays a success popup with an animation, showing the contact creation message and then hiding it after a delay.
 */
function showSuccessPopup(){
  const contact = document.getElementById('newContactCreated');
  setTimeout(() => {
      contact.classList.remove('d-none');
      contact.classList.add('slideInRight');
  }, 1000);
  setTimeout(() => {
    contact.classList.add('slideLeft');
  }, 3000);
  setTimeout(() => {
    contact.classList.add('d-none');
    contact.classList.remove('slideLeft');
  }, 4000);
}

/**
 * Opens the "New Contact" popup with a fade-in animation.
 */
function openNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('d-none');
  setTimeout(() => {
    popup.classList.add('aktiv');
  }, 10); 
}

/**
 * Closes the "New Contact" popup with a fade-out animation.
 */
function closeNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('aktiv');
  setTimeout(() => {
    popup.classList.add('d-none');
  }, 500); 
}

/**
 * Submits the new contact form and then closes the "New Contact" popup.
 */
function submitAndClose(){
  addUser().then(closeNewContact);
}

/**
 * Validates the contact form, submits it if valid, and shows a success popup.
 * If the form is not valid, the function does nothing.
 */
function checkForm(){ 
  let form = document.getElementById('contactForm');
  if (form.checkValidity()){
    submitAndClose();
    showSuccessPopup();
  }else{
    return
  }
}

/**
 * Adds an error class to a form element when the input is invalid.
 * @param {HTMLElement} element - The form element that failed validation.
 */
function onInvalid(element) {
  element.classList.add("error");
}

/**
 * Adds a newly created contact to the contact list display and highlights it as new.
 * @param {Object} user - The user object containing the new contact's details.
 */
function addNewContactToDisplay(user) {
  const contactDisplay = document.getElementById("contact-list");
  const contactHTML = getContactCardHTML(user, true);
  contactDisplay.innerHTML += contactHTML;
  highlightNewContact();
}

/**
 * Highlights the newly added contact in the contact list with a temporary animation.
 */
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


