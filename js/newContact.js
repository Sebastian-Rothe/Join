function openNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.remove('d-none');
}

function closeNewContact(){
  let popup = document.getElementById('new-contact-overlay');
  popup.classList.add('d-none');
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