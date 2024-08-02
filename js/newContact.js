function openNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('d-none');
  setTimeout(() => {
    popup.classList.add('aktiv');
  }, 10); // Kurze Verzögerung
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
  }else{
    return
  }
} 

// document.getElementById('openOverlayNC').addEventListener('click', function() {
//   let overlay = document.getElementById('new-contact-overlay');
//   overlay.classList.toggle('aktiv');
// });
