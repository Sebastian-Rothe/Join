const BASE_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];


function init() {
  loadContacts("/contacts").then(displayContacts);
}

async function loadContacts(path = "/contacts") {
  users = [];
  let userResponse = await fetch(BASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  console.log(responseToJson);

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
    console.log(users);
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
  displayContacts();
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
  let response = await fetch(BASE_URL + `/contacts/${id}.json`, {
    method: "DELETE",
  });
  if (!response.ok) {
    // console.error(`Fehler beim Löschen des Kontakts: ${response.statusText}`);
    return null;
  }
  let responseToJson = await response.json();
  // console.log(`Kontakt mit ID ${id} gelöscht:`, responseToJson);

  await loadContacts("/contacts");
  displayContacts();
  return responseToJson;
}

// might be interesting for you batool

// async function editContact(id, data = {}) {
//   await fetch(BASE_URL + `/contacts/${id}` + ".json", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }

async function displayContacts() {
  await loadContacts("/contacts");
  let contactDisplay = document.getElementById("contact-list");
  contactDisplay.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    contactDisplay.innerHTML += `
    <li id="contact-item-${user.email}" class="single-contact contact-hover-effect ${isNew ? 'new-contact' : ''}" onclick='showContactDetails(${JSON.stringify(user)})' style="cursor: pointer;">
      <div class="avatar-placeholder" style="background-color: ${assignRandomColors()};">
        <span class="avatar-overlay">
        ${getInitials(user.name)}
        </span>
      </div>
      <div class="contact-details">
        <span>${user.name}</span>
      <address class="contact-email ellipsis-text">${user.email}</address>
      </div>
    </li>`;
  }
}

function getInitials(fullName) {
  let nameParts = fullName.split(" ");
  let firstLetters = nameParts.map((part) => part.charAt(0));
  let initials = firstLetters.join("");
  return initials;
}

// might be interesting for manuel
// id brauche wir für das deatil fenster

// <div class="just-border">
//     <div>
//         <Button onclick="deleteContact('${user.id}')">delete</Button>
//         <Button onclick="editContact()">edit</Button>
//     </div>
//     <span>${user.name}</span>
//     <span>${user.email}</span>
// </div>

// functions for contact detail slide show
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
  
  if (window.innerWidth <= 850) {
    contactContent.style.display = 'none';
  }
}



function openMobileContactOption() {
  console.log('Opening popup...');
  const popup = document.getElementById('mobile-contact-option-popup');
  const overlay = document.getElementById('overlay-option');
  closeMobileAddB();
  popup.classList.remove('d-none');
  overlay.classList.remove('d-none');
  setTimeout(() => {
    popup.classList.add('aktiv');
    overlay.style.opacity = '1';
  }, 10);
}

function closeMobileContactOption() {
  console.log('Closing popup...');
  const popup = document.getElementById('mobile-contact-option-popup');
  const overlay = document.getElementById('overlay-option');
  popup.classList.remove('aktiv');
  overlay.style.opacity = '0';
  setTimeout(() => {
    popup.classList.add('d-none');
    overlay.classList.add('d-none');
    addMobileAddB();
  }, 300);
}


// async function loadTasks(path = "/tasks") {
//   tasks = [];
//   try {
//       let taskResponse = await fetch(BASE_URL + path + ".json");
//       if (!taskResponse.ok) {
//           throw new Error(`HTTP error! status: ${taskResponse.status}`);
//       }
//       let responseToJson = await taskResponse.json();
//       console.log('Tasks loaded:', responseToJson); // Debugging

//       if (responseToJson) {
//           Object.keys(responseToJson).forEach((key) => {
//               let task = responseToJson[key];
//               tasks.push({
//                   idNumber: key, // Schlüssel als idNumber
//                   status: task.status,
//                   category: task.category || "Uncategorized",
//                   title: task.title,
//                   description: task.description,
//                   subtaskCount: task.subtaskCount || 0,
//                   completedSubtasks: task.completedSubtasks || 0,
//                   assignedTo: Array.isArray(task.contacts) ? task.contacts : task.contacts?.split(", ") || [], // Typprüfung
//                   priority: task.priority || "medium"
//               });
//           });
//       }
//   } catch (error) {
//       console.error('Error loading tasks:', error);
//   }
// }
// hope to take this func out
// function mapstatusToBoardstatus(status) {
//     switch (status) {
//         case "new": return "todo";
//         case "inProgress": return "inProgress";
//         case "awaitingFeedback": return "awaitFeedback";
//         case "done": return "done";
//         default: return "todo";
//     }
// }
// -------

// async function addTask() {
//   if (!checkDate("date")) return;

//   const fields = [
//     "title",
//     "description",
//     "contacts",
//     "date",
//     "priority",
//     "category",
//     "subtasks",
//     "status",
//   ];
//   const newTask = {};

//   fields.forEach((id) => {
//     newTask[id] = document.getElementById(id).value;
//     console.log(newTask[id], id);
//     document.getElementById(id).value = ""; // Clear input field
//   });

//   await postTask("/tasks", newTask);
// }
// ##################################################
// #########################################
// ##################################################


function openPopupEditTask(taskId) {
  closePopup();
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('addTaskModal').style.display = 'block';
  document.getElementById('addTaskModal').style.padding = '0';
  document.getElementById('addTaskModal').classList.add('board-popup-content');

  fetch('add_task.html')
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const content = doc.querySelector('.container-main');
          if (content) {
              document.getElementById('addTaskContent').innerHTML = content.outerHTML;
              document.getElementById('titleHeaderAdust').innerHTML = "Edit Task";
              document.getElementById('left-right-container').classList.add('left-right-container-to-edit');
              document.getElementById('left-right-container').classList.remove('left-right-container');
              document.getElementById('left-side').classList.add('left-side-to-edit');
              document.getElementById('left-side').classList.remove('left-side');
              document.getElementById('right-side').classList.add('right-side-to-edit');
              document.getElementById('right-side').classList.remove('right-side');
              document.getElementById('footer-add-task-left').style.display = "none";
              document.getElementById('divider').style.display = "none";
              document.getElementById('footer-add-task').classList.add('footer-add-task-to-edit');
              document.getElementById('footer-add-task').classList.remove('footer-add-task');
              document.getElementById('footer-add-task-right').classList.add('footer-add-task-right-to-edit');
              document.getElementById('footer-add-task-right').classList.remove('footer-add-task');

            }
          
          const task = tasks.find(t => t.idNumber === taskId);

          if (task) {
              document.getElementById('title').value = task.title || '';
              document.getElementById('description').value = task.description || '';
              document.getElementById('date').value = task.date || '';
              document.getElementById('category').value = task.category || '';

              const priorityButton = document.getElementById(task.priority);
              if (priorityButton) {
                  priorityButton.classList.add('priority-btn-active');
              }

              fillSubtasks(task.subtasks || []);

              const selectedBadgesContainer = document.getElementById('selectedBadges');
              selectedBadgesContainer.innerHTML = '';
              task.assignedTo.forEach(contact => {
                  selectedBadgesContainer.innerHTML += createProfileIcon(contact);
              });
              
          }

          const saveButton = document.querySelector('.create-task-btn');
          saveButton.textContent = 'Save Task';
          saveButton.onclick = function() {
              updateTask(taskId);
          };

          onloadfunc(taskId);
      })
      .catch(error => {
          console.error('Error loading add_task.html:', error);
      });
}
async function onloadfunc(taskId) {
  let users = await loadAssignedPerson("/contacts");
  const task = tasks.find(t => t.idNumber === taskId);
  if (users) {
      assignedDropdown(users, task.assignedTo);
  }
  setMinDate();
}


function updateBadgeState(checkbox, contactName, container) {
  if (checkbox.checked) {
    container.innerHTML += createProfileIcon(contactName);
  } else {
    removeBadge(contactName, container);
  }
}

function addBadge(fullname, container) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = fullname;
  badge.setAttribute("data-fullname", fullname);
  
  badge.onclick = () => {
      badge.remove();
      const checkbox = document.querySelector(
          `input[type="checkbox"][value="${fullname}"]`
      );
      if (checkbox) {
          checkbox.checked = false;
      }
      const index = assignedTo.indexOf(fullname);
      if (index > -1) {
          assignedTo.splice(index, 1);
      }
  };
  
  container.appendChild(badge);
}

function removeBadge(contactName, container) {
  const badge = container.querySelector(`[data-fullname="${contactName}"]`);
  if (badge) {
      badge.remove();
  }
}

function updateAssignedContacts(task) {
  const contactsDropdown = document.getElementById("contactsDropdown");
  
  if (contactsDropdown) {
      const selectedOptions = [
          ...contactsDropdown.querySelectorAll('input[type="checkbox"]:checked'),
      ].map(option => option.value);
      
      task.assignedTo = Array.from(new Set(selectedOptions));
  } else {
      console.error(
          "Das Dropdown-Element mit der ID 'contactsDropdown' wurde nicht gefunden."
      );
  }
}

// Fills a dropdown with users' profile icons, names, and checkboxes, clearing any existing content.
function assignedDropdown(users, assignedTo = []) {
  // Stelle sicher, dass assignedTo ein Array ist
  if (!Array.isArray(assignedTo)) {
      assignedTo = [];
  }

  let dropdownContent = document.getElementById('contactsDropdown');
  dropdownContent.innerHTML = '';
  
  users.forEach(user => {
      let isChecked = assignedTo.includes(user.name) ? 'checked' : '';
      let label = `
          <label style="display: flex; align-items: center; padding: 8px;">
              ${createProfileIcon(user.name)}
              <span>${user.name}</span>
              <input type="checkbox" value="${user.name}" style="margin-left: auto;" ${isChecked} onclick="toggleContactSelection(this)">
          </label>
      `;
      dropdownContent.innerHTML += label;
  });
}



//Toggles the selection of a contact, adding or removing it from the selected contacts list, and updates the display. 
function toggleContactSelection(checkbox, contactName) {
  const selectedBadgesContainer = document.getElementById('selectedBadges');
  
  // Initialize assignedTo if it doesn't exist
  if (typeof assignedTo === 'undefined') {
      assignedTo = [];
  }
  
  if (checkbox.checked) {
      addBadge(contactName, selectedBadgesContainer);
      assignedTo.push(contactName);
  } else {
      removeBadge(contactName, selectedBadgesContainer);
      const index = assignedTo.indexOf(contactName);
      if (index > -1) {
          assignedTo.splice(index, 1);
      }
  }

  console.log('Aktualisiertes assignedTo:', assignedTo); // Debug-Ausgabe
}
