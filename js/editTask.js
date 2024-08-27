/**
 * Opens the modal for editing a task.
 * This function closes the current popup, displays the edit task modal, 
 * fetches the content from 'add_task.html', updates the modal with 
 * the fetched content, populates the task fields, and sets up the save button.
 * @param {string} taskId - The unique identifier of the task to be edited.
 * @returns {void} - This function does not return a value.
 */
function openPopupEditTask(taskId) {
  closePopup();
  showEditTaskModal();

  fetch('add_task.html')
      .then(response => response.text())
      .then(html => {
          const content = parseHTMLContent(html);
          if (content) {
              updateModalContent(content);
              populateTaskFields(taskId);
          }
          setupSaveButton(taskId);
          onloadfunc();
      })
      .catch(error => {
          console.error('Error loading add_task.html:', error);
      });
}

/**
 * Displays the modal for editing a task.
 * This function shows the modal overlay and the add task modal, applying 
 * specific styles for editing tasks.
 * @returns {void} - This function does not return a value.
 */
function showEditTaskModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const addTaskModal = document.getElementById('addTaskModal');
  
  modalOverlay.style.display = 'block';
  addTaskModal.style.display = 'block';
  addTaskModal.style.padding = '0';
  addTaskModal.classList.add('board-popup-content');
}

/**
 * Parses the HTML content from a given string.
 * This function takes a string of HTML, parses it, and returns the 
 * main content container.
 * @param {string} html - The HTML string to parse.
 * @returns {Element|null} - The parsed content element or null if not found.
 */
function parseHTMLContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.querySelector('.container-main');
}


/**
 * Updates the content of the edit task modal.
 * This function sets the inner HTML of the modal content and updates 
 * the modal title to "Edit Task".
 * @param {Element} content - The content element to display in the modal.
 * @returns {void} - This function does not return a value.
 */
function updateModalContent(content) {
  document.getElementById('addTaskContent').innerHTML = content.outerHTML;
  document.getElementById('titleHeaderAdust').innerHTML = "Edit Task";

  updateModalStyles();
}

/**
 * Updates the styles of the edit task modal.
 * This function modifies the styles of the modal elements to reflect 
 * the edit state, hiding certain elements and adding new classes.
 * @returns {void} - This function does not return a value.
 */
function updateModalStyles() {
  const leftRightContainer = document.getElementById('left-right-container');
  leftRightContainer.classList.add('left-right-container-to-edit');
  leftRightContainer.classList.remove('left-right-container');

  const leftSide = document.getElementById('left-side');
  leftSide.classList.add('left-side-to-edit');
  leftSide.classList.remove('left-side');

  const rightSide = document.getElementById('right-side');
  rightSide.classList.add('right-side-to-edit');
  rightSide.classList.remove('right-side');

  document.getElementById('footer-add-task-left').style.display = "none";
  document.getElementById('divider').style.display = "none";
  const footerAddTask = document.getElementById('footer-add-task');
  footerAddTask.classList.add('footer-add-task-to-edit');
  footerAddTask.classList.remove('footer-add-task');

  const footerAddTaskRight = document.getElementById('footer-add-task-right');
  footerAddTaskRight.classList.add('footer-add-task-right-to-edit');
  footerAddTaskRight.classList.remove('footer-add-task');
}

/**
 * Populates the task fields in the edit modal.
 * This function fills the modal fields with the details of the task 
 * specified by the taskId.
 * @param {string} taskId - The unique identifier of the task to populate.
 * @returns {void} - This function does not return a value.
 */
function populateTaskFields(taskId) {
  const task = tasks.find(t => t.idNumber === taskId);
  if (task) {
      document.getElementById('title').value = task.title || '';
      document.getElementById('description').value = task.description || '';
      document.getElementById('date').value = task.date || '';
      document.getElementById('category').value = task.category || '';

      activatePriorityButton(task.priority);
      fillAssignedToDropdown(task.assignedTo || []);
      fillSubtasks(task.subtasks || []);
      updateSelectedBadgesOnLoad(task.assignedTo || []);
  }
}

/**
 * Activates the priority button for the specified priority.
 * This function adds an active class to the priority button that corresponds 
 * to the provided priority value.
 * @param {string} priority - The priority level to activate.
 * @returns {void} - This function does not return a value.
 */
function activatePriorityButton(priority) {
  const priorityButton = document.getElementById(priority);
  if (priorityButton) {
      priorityButton.classList.add('priority-btn-active');
  }
}

/**
 * Updates the displayed badges based on the assigned contacts.
 * This function clears the existing badges and creates new ones for each 
 * contact assigned to the task.
 * @param {Array<string>} assignedTo - The array of assigned contact names.
 * @returns {void} - This function does not return a value.
 */
function updateSelectedBadgesOnLoad(assignedTo) {
  const selectedBadgesContainer = document.getElementById('selectedBadges');
  selectedBadgesContainer.innerHTML = '';
  assignedTo.forEach(contact => {
      selectedBadgesContainer.innerHTML += createProfileIcon(contact);
  });
}

/**
 * Sets up the save button in the edit task modal.
 * This function configures the save button to update the task when clicked.
 * @param {string} taskId - The unique identifier of the task being edited.
 * @returns {void} - This function does not return a value.
 */
function setupSaveButton(taskId) {
  const saveButton = document.querySelector('.create-task-btn');
  saveButton.textContent = 'Save Task';
  saveButton.onclick = function() {
      updateTask(taskId);
  };
}

/**
 * Fills the assigned contacts dropdown with options.
 * This function populates the dropdown with checkboxes for each contact, 
 * marking those that are assigned to the task.
 * @param {Array<string>} assignedTo - The array of contact names assigned to the task.
 * @returns {void} - This function does not return a value.
 */
function fillAssignedToDropdown(assignedTo) {
  const dropdown = document.getElementById("contactsDropdown");
  setTimeout(() => {
      const labels = dropdown.querySelectorAll("label");
          const selectedBadgesContainer = document.getElementById("selectedBadges");
          selectedBadgesContainer.innerHTML = "";
          labels.forEach((label) => {
              const checkbox = label.querySelector('input[type="checkbox"]');
              const contactName = checkbox.value.trim();

              if (checkbox && assignedTo.includes(contactName)) {
                  checkbox.checked = true;
                  selectedBadgesContainer.innerHTML += createProfileIcon(contactName);
              } else {
                  checkbox.checked = false;
              }
          });
  }, 100);
}

/**
 * Toggles the selection state of a contact checkbox.
 * This function updates the displayed badges when a contact is selected or 
 * deselected.
 * @param {HTMLInputElement} checkbox - The checkbox element that was toggled.
 * @returns {void} - This function does not return a value.
 */
function toggleContactSelection2(checkbox) {
  const contactName = checkbox.value.trim();
  const selectedBadgesContainer = document.getElementById("selectedBadges");

  updateBadgeState(checkbox, contactName, selectedBadgesContainer);
}


function toggleContactSelectionWrapper(checkbox) {
  const headerTitle = document.getElementById('titleHeaderAdust').innerHTML;

  if (headerTitle === "Edit Task") {
      toggleContactSelection2(checkbox);
  } else {
      toggleContactSelection(checkbox);
  }
}


/**
 * Updates the state of a badge based on checkbox selection.
 * This function adds or removes a badge based on whether the corresponding 
 * checkbox is checked.
 * @param {HTMLInputElement} checkbox - The checkbox element whose state has changed.
 * @param {string} contactName - The name of the contact associated with the checkbox.
 * @param {Element} container - The container for the badges.
 * @returns {void} - This function does not return a value.
 */
function updateBadgeState(checkbox, contactName, container) {
  if (checkbox.checked) {
      if (!container.querySelector(`[data-contact="${contactName}"]`)) {
          const badgeHTML = createProfileIcon(contactName);
          container.insertAdjacentHTML('beforeend', badgeHTML); 
      }
  } else {
      removeBadge(contactName, container);
  }
}

/**
 * Removes a badge for a specified contact.
 * This function removes the badge associated with the given contact name 
 * from the container.
 * @param {string} contactName - The name of the contact whose badge should be removed.
 * @param {Element} container - The container holding the badges.
 * @returns {void} - This function does not return a value.
 */
function removeBadge(contactName, container) {
  const badge = container.querySelector(`[data-contact="${contactName}"]`);
  if (badge) {
      badge.remove();
  } 
}

/**
 * Adds a badge for a specified contact.
 * This function creates a badge element for the contact and appends it 
 * to the specified container.
 * @param {string} fullname - The full name of the contact to add as a badge.
 * @param {Element} container - The container to which the badge will be added.
 * @returns {void} - This function does not return a value.
 */
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

/**
 * Updates the assigned contacts for a task.
 * This function retrieves selected contacts from the dropdown and 
 * updates the assignedTo property of the specified task.
 * @param {Object} task - The task object to be updated.
 * @returns {void} - This function does not return a value.
 */
function updateAssignedContacts(task) {
  const contactsDropdown = document.getElementById("contactsDropdown");
  
  if (contactsDropdown) {
      const selectedOptions = [
          ...contactsDropdown.querySelectorAll('input[type="checkbox"]:checked'),
      ].map(option => option.value);
      
      // Setze die zugewiesenen Kontakte zusammen
      task.assignedTo = selectedOptions;
  } else {
    console.error(
      "Das Dropdown-Element mit der ID 'contactsDropdown' wurde nicht gefunden."
    );
  }
}

/**
 * Fills the subtasks in the edit modal.
 * This function populates the subtask list with the subtasks associated 
 * with the task.
 * @param {Array<Object>} subtasks - The array of subtask objects to display.
 * @returns {void} - This function does not return a value.
 */
function fillSubtasks(subtasks) {
  const subtaskContainer = document.getElementById("subtask-list-container");
  const subtaskList = subtaskContainer.querySelector("ul");
  subtaskList.innerHTML = "";
  
  toggleSubtaskListVisibility(subtaskList, subtasks.length);
  appendSubtasks(subtaskList, subtasks);
}

/**
 * Toggles the visibility of the subtask list based on its count.
 * This function shows or hides the subtask list depending on how many 
 * subtasks there are.
 * @param {Element} subtaskList - The element representing the subtask list.
 * @param {number} subtaskCount - The number of subtasks to determine visibility.
 * @returns {void} - This function does not return a value.
 */
function toggleSubtaskListVisibility(subtaskList, subtaskCount) {
  if (subtaskCount > 0) {
    subtaskList.classList.remove("toggle-display");
  } else {
    subtaskList.classList.add("toggle-display");
  }
}

/**
 * Appends subtasks to the subtask list in the edit modal.
 * This function adds each subtask as a list item to the provided subtask list.
 * @param {Element} subtaskList - The element representing the subtask list.
 * @param {Array<Object>} subtasks - The array of subtask objects to append.
 * @returns {void} - This function does not return a value.
 */
function appendSubtasks(subtaskList, subtasks) {
  subtasks.forEach((subtask) => {
    const li = createSubtaskListItem(subtask);
    subtaskList.appendChild(li);
  });
}

/**
 * Creates a list item for a subtask.
 * This function generates an HTML element for a subtask, including 
 * necessary elements for editing and removing the subtask.
 * @param {Object} subtask - The subtask object to create a list item for.
 * @returns {Element} - The created list item element.
 */
function createSubtaskListItem(subtask) {
  const li = document.createElement("li");
  li.id = subtask.title;
  li.classList.add("subtask-list");
  
  const checkedClass = subtask.completed ? "subtask-completed" : "";
  
  li.innerHTML = `
  <div class="subtask-list-left ${checkedClass}">
  <input type="checkbox" ${subtask.completed ? "checked" : ""} 
  onchange="toggleSubtaskCompletion(this, '${subtask.title}')" class="d-none">
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

/**
 * Toggles the completion state of a subtask.
 * This function updates the visual state of the subtask based on whether 
 * its checkbox is checked or not.
 * @param {HTMLInputElement} checkbox - The checkbox representing the subtask's completion.
 * @returns {void} - This function does not return a value.
 */
function toggleSubtaskCompletion(checkbox) {
  const subtaskElement = checkbox.closest('li');
  const subtaskTitleElement = subtaskElement.querySelector('.subtask-list-left span');
  
  if (checkbox.checked) {
    subtaskTitleElement.classList.add('subtask-completed');
  } else {
    subtaskTitleElement.classList.remove('subtask-completed');
  }
}

/**
 * Updates the subtasks of a task based on the current state of the subtask list.
 * This function retrieves the current subtasks from the modal and updates 
 * the task object accordingly.
 * @param {Object} task - The task object to be updated.
 * @returns {void} - This function does not return a value.
 */
function updateSubtasks(task) {
  const subtasks = [
    ...document.getElementById("subtask-list-container").querySelectorAll("li"),
  ].map((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const subtaskTitleElement = li.querySelector('.subtask-list-left span');
    
    return {
      title: subtaskTitleElement ? subtaskTitleElement.textContent.trim() : '',
      completed: checkbox ? checkbox.checked : false,
    };
  });
  
  task.subtasks = subtasks;
}

/**
 * Updates a task with new details.
 * This function modifies the task details based on the current modal values, 
 * updates priority and assigned contacts, sends the updated task to the server, 
 * and refreshes the task board.
 * @param {string} taskId - The unique identifier of the task to update.
 * @returns {void} - This function does not return a value.
 */
function updateTask(taskId) {
  const task = findTaskById(taskId);
  
  if (task) {
      updateTaskDetails(task);
      updateTaskPriority(task);
      updateAssignedContacts(task); 
      updateSubtasks(task);
      sendUpdatedTask(taskId, task);
  }
  updateBoard();
}


/**
 * Finds a task by its unique identifier.
 * This function searches through the tasks array to find a task that 
 * matches the specified taskId.
 * @param {string} taskId - The unique identifier of the task to find.
 * @returns {Object|null} - The found task object or null if not found.
 */
function findTaskById(taskId) {
  return tasks.find((t) => t.idNumber === taskId);
}

/**
 * Updates the details of a task based on input fields.
 * This function retrieves values from input fields in the modal and 
 * updates the corresponding properties of the task.
 * @param {Object} task - The task object to update.
 * @returns {void} - This function does not return a value.
 */
function updateTaskDetails(task) {
  task.title = document.getElementById("title").value.trim();
  task.description = document.getElementById("description").value.trim();
  task.date = document.getElementById("date").value;
  task.category = document.getElementById("category").value;
}

/**
 * Updates the priority of a task based on the selected priority button.
 * This function checks which priority button is active and updates 
 * the task's priority accordingly.
 * @param {Object} task - The task object to update.
 * @returns {void} - This function does not return a value.
 */
function updateTaskPriority(task) {
  const selectedPriority = [...document.querySelectorAll(".priority-btn")].find(
      (btn) => btn.classList.contains("urgent-pri-active") ||
                btn.classList.contains("medium-prio-active") ||
                btn.classList.contains("low-prio-active")
  );
  task.priority = selectedPriority ? selectedPriority.id : "low";
}

/**
 * Sends the updated task data to the server.
 * This function makes a PUT request to update the specified task in the 
 * backend and then refreshes the task board.
 * @param {string} taskId - The unique identifier of the task to send.
 * @param {Object} task - The task object containing updated information.
 * @returns {Promise<void>} - Returns a promise that resolves when the task 
 * is successfully updated.
 */
function sendUpdatedTask(taskId, task) {
  putData(`/tasks/${taskId}`, task).then(() => {
      closePopupAddTask();
      updateBoard();
      resetPopupEditTask();
  });
}


/**
 * Resets the edit task popup to its initial state.
 * This function hides the modal and resets its content and styles, preparing 
 * it for future use.
 * @returns {void} - This function does not return a value.
 */
function resetPopupEditTask() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('addTaskModal').style.display = 'none';
  document.getElementById('addTaskModal').style.padding = ''; 
  document.getElementById('addTaskModal').classList.remove('board-popup-content');
  document.getElementById('addTaskContent').innerHTML = '';
}

