
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

function openNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('d-none');
  setTimeout(() => {
    popup.classList.add('aktiv');
  }, 10); 
}

function closeNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('aktiv');
  setTimeout(() => {
    popup.classList.add('d-none');
  }, 500);
}

function submitAndClose(){
  addUser().then(closeNewContact);
}

function checkForm(){
  let form = document.getElementById('contactForm');
  if (form.checkValidity()){
    submitAndClose();
    showSuccessPopup();
  }else{
    return
  }
} 

function addNewContactToDisplay(user) {
  const contactDisplay = document.getElementById("contact-content");
  const contactHTML = getContactCardHTML(user, true);
  contactDisplay.innerHTML += contactHTML;
  highlightNewContact();
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


