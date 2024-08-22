function openPopupEditTask(taskId) {
  console.log('Opening edit task popup for task ID:', taskId);

  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('addTaskModal').style.display = 'block';

  fetch('add_task.html')
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const content = doc.querySelector('.container-main');
          if (content) {
              document.getElementById('addTaskContent').innerHTML = content.outerHTML;
          }
          let newHeadline = document.getElementById('titleHeaderAdust');
          if (newHeadline) {
              newHeadline.innerHTML = "Edit Task";
          } else {
              console.error('Element mit ID titleHeaderAdust nicht gefunden');
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

              fillAssignedToDropdown(task.assignedTo || []);
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

          onloadfunc();
      })
      .catch(error => {
          console.error('Error loading add_task.html:', error);
      });
}

// function openPopupEditTask(taskId) {
//     console.log('Opening edit task popup for task ID:', taskId);
  
//     // Modal anzeigen
//     document.getElementById('modalOverlay').style.display = 'block';
//     document.getElementById('addTaskModal').style.display = 'block';
  
//     loadTaskContent(taskId); // Lade den Inhalt der Aufgabe
//   }
  
//   function loadTaskContent(taskId) {
//     fetch('add_task.html')
//       .then(response => response.text())
//       .then(html => {
//         const content = extractContent(html);
//         if (content) {
//           document.getElementById('addTaskContent').innerHTML = content.outerHTML;
//         }
//         populateTaskDetails(taskId); // Fülle die Details der Aufgabe aus
//       })
//       .catch(error => {
//         console.error('Error loading add_task.html:', error);
//       });
//   }
  
//   function extractContent(html) {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
//     return doc.querySelector('.container-main');
//   }
  
//   function populateTaskDetails(taskId) {
//     const task = tasks.find(t => t.idNumber === taskId);
//     if (!task) {
//       console.error('Task not found for ID:', taskId);
//       return;
//     }
  
//     // Setze die Titel und Beschreibung
//     setTaskFormValues(task);
//     fillDropdownsAndBadges(task);
//     configureSaveButton(taskId);
//   }
  
//   function setTaskFormValues(task) {
//     document.getElementById('titleHeaderAdust').innerHTML = "Edit Task";
//     document.getElementById('title').value = task.title || '';
//     document.getElementById('description').value = task.description || '';
//     document.getElementById('date').value = task.date || '';
//     document.getElementById('category').value = task.category || '';
  
//     // Setze den Prioritäts-Button
//     const priorityButton = document.getElementById(task.priority);
//     if (priorityButton) {
//       priorityButton.classList.add('priority-btn-active');
//     }
//   }
  
//   function fillDropdownsAndBadges(task) {
//     fillAssignedToDropdown(task.assignedTo || []);
//     fillSubtasks(task.subtasks || []);
//     updateSelectedBadges(task.assignedTo || []);
//   }
  
//   function updateSelectedBadges(assignedTo) {
//     const selectedBadgesContainer = document.getElementById('selectedBadges');
//     selectedBadgesContainer.innerHTML = ''; // Leeren vor dem Hinzufügen
  
//     if (Array.isArray(assignedTo)) {
//       assignedTo.forEach(contact => {
//         selectedBadgesContainer.innerHTML += createProfileIcon(contact);
//       });
//     } else {
//       console.warn("assignedTo is not an array or is undefined:", assignedTo);
//     }
//   }
  
//   function configureSaveButton(taskId) {
//     const saveButton = document.querySelector('.create-task-btn');
//     saveButton.textContent = 'Save Task';
//     saveButton.onclick = function() {
//       updateTask(taskId);
//     };
  
//     onloadfunc(); // Falls notwendig
//   }
  

// function fillAssignedToDropdown(assignedTo) {
//   const dropdown = document.getElementById('contactsDropdown');
//   const selectedBadgesContainer = document.getElementById('selectedBadges');
//   selectedBadgesContainer.innerHTML = '';
//   const options = [...dropdown.querySelectorAll('.dropdown-option')];

//   options.forEach(option => {
//       const contactName = option.textContent.trim();

//       if (assignedTo.includes(contactName)) {
//           const checkbox = option.querySelector('input[type="checkbox"]');
//           if (checkbox) {
//               checkbox.checked = true;
//               addBadge(contactName, selectedBadgesContainer);
//           }
//       } else {
//           const checkbox = option.querySelector('input[type="checkbox"]');
//           if (checkbox) {
//               checkbox.checked = false;
//           }
//       }
//   });
// }

function fillAssignedToDropdown(assignedTo) {
  const dropdown = document.getElementById("contactsDropdown");
  const selectedBadgesContainer = document.getElementById("selectedBadges");
  selectedBadgesContainer.innerHTML = "";

  updateDropdownOptions(dropdown, assignedTo, selectedBadgesContainer);
}

function updateDropdownOptions(dropdown, assignedTo, selectedBadgesContainer) {
  const options = [...dropdown.querySelectorAll(".dropdown-option")];

  options.forEach((option) => {
    const contactName = option.textContent.trim();
    const checkbox = option.querySelector('input[type="checkbox"]');

    if (checkbox) {
      checkbox.checked = assignedTo.includes(contactName);
      updateBadgeState(checkbox, contactName, selectedBadgesContainer);
    }
  });
}

function updateBadgeState(checkbox, contactName, container) {
  if (checkbox.checked) {
    container.innerHTML += createProfileIcon(contactName);
  } else {
    removeBadge(contactName, container);
  }
}

function removeBadge(contactName, container) {
  const badge = container.querySelector(`[data-contact="${contactName}"]`);
  if (badge) {
    badge.remove();
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
  };

  container.appendChild(badge);
}

// function fillSubtasks(subtasks) {
//   const subtaskContainer = document.getElementById('subtask-list-container');
//   const subtaskList = subtaskContainer.querySelector('ul');
//   subtaskList.innerHTML = '';

//   if (subtasks.length > 0) {
//       subtaskList.classList.remove('toggle-display');
//   } else {
//       subtaskList.classList.add('toggle-display');
//   }

//   subtasks.forEach(subtask => {
//       const li = document.createElement('li');
//       li.id = subtask.title;
//       li.classList.add('subtask-list');

//       li.innerHTML = `
//         <div class="subtask-list-left">
//             <span>${subtask.title}</span>
//         </div>
//         <div class="subtask-list-right">
//             <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subtask.title}')"></span>
//             <div class="subtask-list-divider toggle-display"></div>
//             <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subtask.title}')"></span>
//         </div>
//       `;

//       subtaskList.appendChild(li);
//   });
// }

function fillSubtasks(subtasks) {
  const subtaskContainer = document.getElementById("subtask-list-container");
  const subtaskList = subtaskContainer.querySelector("ul");
  subtaskList.innerHTML = "";

  toggleSubtaskListVisibility(subtaskList, subtasks.length);
  appendSubtasks(subtaskList, subtasks);
}

function toggleSubtaskListVisibility(subtaskList, subtaskCount) {
  if (subtaskCount > 0) {
    subtaskList.classList.remove("toggle-display");
  } else {
    subtaskList.classList.add("toggle-display");
  }
}

function appendSubtasks(subtaskList, subtasks) {
  subtasks.forEach((subtask) => {
    const li = createSubtaskListItem(subtask);
    subtaskList.appendChild(li);
  });
}

function createSubtaskListItem(subtask) {
  const li = document.createElement("li");
  li.id = subtask.title;
  li.classList.add("subtask-list");
  li.innerHTML = `
      <div class="subtask-list-left">
          <span>${subtask.title}</span>
      </div>
      <div class="subtask-list-right">
          <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subtask.title}')"></span>
          <div class="subtask-list-divider toggle-display"></div>
          <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subtask.title}')"></span>
      </div>
    `;
  return li;
}

// function updateTask(taskId) {
//   const task = tasks.find(t => t.idNumber === taskId);

//   if (task) {
//       task.title = document.getElementById('title').value.trim();
//       task.description = document.getElementById('description').value.trim();
//       task.date = document.getElementById('date').value;
//       task.category = document.getElementById('category').value;

//       const selectedPriority = [...document.querySelectorAll('.priority-btn')].find(btn => btn.classList.contains('priority-btn-active'));
//       task.priority = selectedPriority ? selectedPriority.id : 'low';
//       const contactsDropdown = document.getElementById('contactsDropdown');

//       if (contactsDropdown) {
//           const selectedOptions = [...contactsDropdown.querySelectorAll('input[type="checkbox"]:checked')];
//           task.assignedTo = selectedOptions.map(option => option.value);
//       } else {
//           console.error("Das Dropdown-Element mit der ID 'contactsDropdown' wurde nicht gefunden.");
//       }
//       const subtasks = [...document.getElementById('subtask-list-container').querySelectorAll('li')].map(li => ({
//           title: li.textContent.trim(),
//           completed: false
//       }));
//       task.subtasks = subtasks;

//       putData(`/tasks/${taskId}`, task).then(() => {
//           closePopupAddTask();
//           closePopup();
//           updateBoard();
//       });
//   }
// }

function updateTask(taskId) {
  const task = findTaskById(taskId);

  if (task) {
    updateTaskDetails(task);
    updateTaskPriority(task);
    updateAssignedContacts(task);
    updateSubtasks(task);

    sendUpdatedTask(taskId, task);
  }
}

function findTaskById(taskId) {
  return tasks.find((t) => t.idNumber === taskId);
}

function updateTaskDetails(task) {
  task.title = document.getElementById("title").value.trim();
  task.description = document.getElementById("description").value.trim();
  task.date = document.getElementById("date").value;
  task.category = document.getElementById("category").value;
}

function updateTaskPriority(task) {
  const selectedPriority = [...document.querySelectorAll(".priority-btn")].find(
    (btn) => btn.classList.contains("priority-btn-active")
  );
  task.priority = selectedPriority ? selectedPriority.id : "low";
}

function updateAssignedContacts(task) {
  const contactsDropdown = document.getElementById("contactsDropdown");

  if (contactsDropdown) {
    const selectedOptions = [
      ...contactsDropdown.querySelectorAll('input[type="checkbox"]:checked'),
    ];
    task.assignedTo = selectedOptions.map((option) => option.value);
  } else {
    console.error(
      "Das Dropdown-Element mit der ID 'contactsDropdown' wurde nicht gefunden."
    );
  }
}

function updateSubtasks(task) {
  const subtasks = [
    ...document.getElementById("subtask-list-container").querySelectorAll("li"),
  ].map((li) => ({
    title: li.textContent.trim(),
    completed: false,
  }));
  task.subtasks = subtasks;
}

function sendUpdatedTask(taskId, task) {
  putData(`/tasks/${taskId}`, task).then(() => {
    closePopupAddTask();
    closePopup();
    updateBoard();
  });
}
