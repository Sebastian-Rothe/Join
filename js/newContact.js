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

document.getElementById('myForm').addEventListener('submit', function(event) {
  // Verhindere das Absenden des Formulars
  event.preventDefault();

  // Hol die Werte der Eingabefelder
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Überprüfe die Eingaben
  if (username === '') {
      alert('Bitte geben Sie einen Benutzernamen ein.');
      return;
  }

  if (email === '') {
      alert('Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
  }

  if (password === '') {
      alert('Bitte geben Sie ein Passwort ein.');
      return;
  }

  // Optional: weitere Validierungen wie E-Mail-Format oder Passwortstärke

  // Wenn alles passt, das Formular absenden
  alert('Formular wird gesendet!');
  event.target.submit();
});
