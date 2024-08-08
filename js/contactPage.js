let profileColors = [
    '#FF5733', // Rot
    '#33FF57', // Grün
    '#3357FF', // Blau
    '#FF33A6', // Pink
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#8A2BE2', // Blauviolett
    '#7FFFD4', // Aquamarin
    '#FF4500', // Orangerot
    '#3E6020'  // Dunkelolivgrün
  ];
  
function init() {
  loadContacts("/contacts").then(displayContacts);
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

function showContactDetails(user) {
  highlightSelectedContact(user.email);
  
  const detailDisplay = document.getElementById("contact-details");
  const contactDetails = document.getElementById("view-contacts");
  const contactContent = document.getElementById("contact-content");
  const mobileContactOption = document.getElementById("mobile-contact-option");

  if (isDetailDisplayActive(detailDisplay)) {
    closeCurrentDetail(detailDisplay, user);
  } else {
    openNewDetail(detailDisplay, user);
  }
  updateDisplayStates(contactDetails, contactContent, mobileContactOption);
}

function isDetailDisplayActive(detailDisplay) {
  return detailDisplay.classList.contains('aktiv');
}

function closeCurrentDetail(detailDisplay, user) {
  detailDisplay.classList.remove('aktiv');
  setTimeout(() => {
    updateDetailContent(detailDisplay, user);
    openDetailWithAnimation(detailDisplay);
  }, 500);
}

function openNewDetail(detailDisplay, user) {
  updateDetailContent(detailDisplay, user);
  detailDisplay.classList.remove('d-none');
  openDetailWithAnimation(detailDisplay);
}

function updateDetailContent(detailDisplay, user) {
  detailDisplay.innerHTML = getContactDetailHTML(user);
}

function openDetailWithAnimation(detailDisplay) {
  setTimeout(() => {
    detailDisplay.classList.add('aktiv');
  }, 10); 
}

function updateDisplayStates(contactDetails, contactContent, mobileContactOption) {
  contactDetails.style.display = 'block';
  mobileContactOption.classList.remove('d-none');
  
  if (window.innerWidth <= 655) {
    contactContent.style.display = 'none';
  }
}

function backToContactList(){
  const contactContent = document.getElementById("contact-content");
  const contactDetails = document.getElementById("view-contacts");
  contactContent.style.display = 'block';
  if (window.innerWidth <= 655) {
    contactDetails.style.display = 'none';
  }
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

function backToContactList() {
  const contactContent = document.getElementById("contact-content");
  const contactDetails = document.getElementById("view-contacts");
  changeToAddButton();
  contactContent.style.display = 'block';
  if (window.innerWidth <= 655) {
    contactDetails.style.display = 'none';
  }
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

function highlightSelectedContact(id){
  clearSelectedHighlight();
  const contactSection = document.getElementById("contact-details-section-"+id);
  contactSection.classList.add("active");
}

function clearSelectedHighlight(){
  const contactDetailsSections = document.getElementsByClassName("contact-details-section");
  const contactDetailsArray = Array.from(contactDetailsSections);

  contactDetailsArray.forEach(section => {
      section.classList.remove("active");
  });
}

function openMobileContactOption() {
  let popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const overlay = document.getElementById("overlay-option");
  closeMobileAddB();
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
    addMobileAddB();
  }, 300); // Match the transition duration
}

function changeToAddButton(){
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const imageContainer = document.getElementById('mobile-add-button');
  mobileContactOption.classList.add("d-none");
  imageContainer.classList.remove('d-none')
}

function closeMobileAddB(){
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.add('d-none');
}

function addMobileAddB(){
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.remove('d-none')
}
