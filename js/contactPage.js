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
  const detailDisplay = document.getElementById("contact-content");
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
  let contactDisplay = document.getElementById("contact-list");
  contactDisplay.innerHTML = "";

  let sortAlphabet = '';
  users.forEach(user => {
    sortAlphabet = updateContactDisplay(contactDisplay, user, sortAlphabet, newUser);
  });
  highlightNewContact();
}

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

function getUserIdForMobile(user){
  const editButton = document.getElementById("mobile-button-edit");
  const deleteButton = document.getElementById("mobile-button-delete");

  editButton.setAttribute("onclick", `editContact(${JSON.stringify(user.id)})`);
  deleteButton.setAttribute("onclick", `deleteContact(${JSON.stringify(user.id)})`);
}

function getUserIdForMobile(user){
  const editButton = document.getElementById("mobile-button-edit");
  const deleteButton = document.getElementById("mobile-button-delete");

  editButton.setAttribute("onclick", `editContact(${JSON.stringify(user.id)})`);
  deleteButton.setAttribute("onclick", `deleteContact(${JSON.stringify(user.id)})`);
}

function isDetailDisplayActive(detailDisplay) {
  return detailDisplay.classList.contains('aktiv');
}

function closeCurrentDetail(detailDisplay, user) {
  detailDisplay.classList.remove('aktiv');
  setTimeout(() => {
    updateDetailContent(detailDisplay, user);
    openDetailWithAnimation(detailDisplay);
  }, 100);
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

function updateDisplayStates(viewContacts, contactList, contactDetails, mobileContactOption, buttonBack) {
  viewContacts.style.display = 'block';
  mobileContactOption.classList.remove('d-none');

  if (window.innerWidth <= 655) {
    contactList.classList.add('d-none');
    contactDetails.classList.add('d-none');
  buttonBack.classList.remove('d-none');

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
  const contactList = document.getElementById("contact-list");
  const contactDetails = document.getElementById("contact-detail");
  const contactDisplay = document.getElementById("contact-display");
  changeToAddButton();
  contactList.classList.remove("d-none");
  contactDetails.classList.remove("d-none");
  if (window.innerWidth <= 655) {
    contactDisplay.style.display = 'none';
  }
}

function handleResize() {
  const contactList = document.getElementById("contact-list");
  const contactDetails = document.getElementById("contact-detail");
  const contactDisplay = document.getElementById("contact-display");
  if (window.innerWidth >= 655) {
    contactList.classList.remove("d-none");
    contactDetails.classList.remove("d-none");
    contactDisplay.style.display = 'block';
  }
  else if(window.innerWidth <= 655){
    contactDisplay.style.display = 'none';
    document.getElementById("mobile-contact-option").classList.add("d-none");
    document.getElementById("btnBack").classList.add("d-none");
  }
}

window.addEventListener('resize', handleResize);
handleResize();

function highlightSelectedContact(id){
  clearSelectedHighlight();
  const contactSection = document.getElementById("contact-item-"+id);
  contactSection.classList.add("active");
}

function clearSelectedHighlight(){
  const contactDetailsSections = document.getElementsByClassName("single-contact");
  const contactDetailsArray = Array.from(contactDetailsSections);

  contactDetailsArray.forEach(section => {
      section.classList.remove("active");
  });
}

function openMobileContactOption() {
  const popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");

  popup.classList.remove('d-none');
  popup.classList.add('aktiv');
  mobileContactOption.classList.add("d-none");
  closeMobileAddB();

  document.addEventListener('click', handleDocumentClick);
}

function closeMobileContactOption() {
  const popup = document.getElementById('mobile-contact-option-popup');
  const mobileContactOption = document.getElementById("mobile-contact-option");

  popup.classList.remove('aktiv');
  popup.classList.add('d-none');
  mobileContactOption.classList.remove("d-none");
  addMobileAddB();

  document.removeEventListener('click', handleDocumentClick);
}

function handleDocumentClick(event) {
  const popup = document.getElementById('mobile-contact-option-popup');
  const trigger = document.getElementById('mobile-contact-option');

  if (!popup.contains(event.target) && event.target !== trigger) {
    closeMobileContactOption();
  }
}

function changeToAddButton() {
  const mobileContactOption = document.getElementById("mobile-contact-option");
  const imageContainer = document.getElementById('mobile-add-button');
 
  mobileContactOption.classList.add("d-none");
  imageContainer.classList.remove('d-none');
}

function closeMobileAddB() {
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.add('d-none');
}

function addMobileAddB() {
  const imageContainer = document.getElementById('mobile-add-button');
  imageContainer.classList.remove('d-none');
}

