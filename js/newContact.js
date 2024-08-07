
function showPopup(){
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
    showPopup();
  }else{
    return
  }
} 

