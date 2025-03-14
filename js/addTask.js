let selectedContacts = [];
let createdSubTasks = [];
const fields = [
    "title",
    "description",
    "date",
    "priority",
    "category",
    "subtasks",
    "status",
    "upload"
];
let selectedFiles = [];

/**
 * Populates the dropdown with users' profile icons, names, and checkboxes, 
 * clearing any existing content.
 * @param {Array<Object>} users - An array of user objects, each containing a `name` property.
 */
function assignedDropdown(users) {
    let dropdownContent = document.getElementById('contactsDropdown');
    dropdownContent.innerHTML = '';
    users.forEach(user => {
        let label = `
            <label style="display: flex; align-items: center; padding: 8px;">
                ${createProfileIcon(user.name)}
                <span>${user.name}</span>
                <input type="checkbox" value="${user.name}" style="margin-left: auto;" onclick="toggleContactSelectionWrapper(this)">
            </label>
        `;
        dropdownContent.innerHTML += label;
    });
}

/**
 * Toggles the selection of a contact, adding or removing it from the selected contacts list,
 * and updates the display of selected badges.
 * @param {HTMLInputElement} checkbox - The checkbox element representing the selected contact.
 */
function toggleContactSelection(checkbox) {
    const contactName = checkbox.value;

    if (checkbox.checked) {
        // Add contact to selectedContacts if checked
        if (!selectedContacts.includes(contactName)) {
            selectedContacts.push(contactName);
        }
    } else {
        // Remove contact from selectedContacts if unchecked
        selectedContacts = selectedContacts.filter(contact => contact !== contactName);
    }
    updateSelectedBadges();
}

/**
 * Wrapper function to toggle contact selection, determining whether to handle the selection 
 * as part of editing a task or adding a new task.
 * @param {HTMLInputElement} checkbox - The checkbox element representing the selected contact.
 */
function toggleContactSelectionWrapper(checkbox) {
    const headerTitle = document.getElementById('titleHeaderAdust').innerHTML;
  
    if (headerTitle === "Edit Task") {
        toggleContactSelection2(checkbox);
    } else {
        toggleContactSelection(checkbox);
    }
  }

/**
 * Updates the display of selected contacts as badges in the UI, with an overflow indicator 
 * if the number of selected contacts exceeds the maximum visible limit.
 * @returns {void}
 */
function updateSelectedBadges() {
    let selectedBadgesContainer = document.getElementById('selectedBadges');
    selectedBadgesContainer.innerHTML = '';

    const maxVisibleBadges = 5; // Maximum number of profile icons to display

    // Display profile icons up to the maxVisibleBadges limit
    selectedContacts.slice(0, maxVisibleBadges).forEach(contact => {
        let profileIcon = createProfileIcon(contact);
        let badge = document.createElement('div');
        badge.classList.add('badge');
        badge.innerHTML = profileIcon;
        selectedBadgesContainer.appendChild(badge);
    });

    // If there are more contacts than maxVisibleBadges, show a "+n" badge
    if (selectedContacts.length > maxVisibleBadges) {
        let remainingCount = selectedContacts.length - maxVisibleBadges;
        let extraBadge = document.createElement('div');
        extraBadge.classList.add('badge', 'extra-badge');
        extraBadge.innerText = `+${remainingCount}`;
        selectedBadgesContainer.appendChild(extraBadge);
    }
}

/**
 * Toggles the visibility of the dropdown menu for contact selection.
 * @returns {void}
 */
function toggleDropdown() {    
    let dropdownContent = document.getElementById('contactsDropdown');
    if (dropdownContent) {
        dropdownContent.classList.toggle('show');
    }
}

/**
 * Closes the dropdown menu if a click is detected outside the dropdown button or content.
 * @param {MouseEvent} event - The click event object.
 */
document.addEventListener('click', function(event) {
    let dropdownContent = document.getElementById('contactsDropdown');
    let dropdownButton = document.querySelector('.dropdown-btn');

    // Check if both elements exist
    if (dropdownContent && dropdownButton) {
        // Check if the click was outside the dropdown button or the dropdown content
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    }
});

/**
 * Initializes the page by loading assigned users and setting the minimum date for the date input field.
 * @returns {Promise<void>} - A promise that resolves when the assigned users are loaded.
 */
async function onloadfunc() {
    let users = await loadAssignedPerson("/contacts");
    
    if (users) {
        assignedDropdown(users);
    }
    setMinDate();
}

/**
 * Sets the minimum date for the date input field to today's date.
 * @returns {void}
 */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', today);
}

/**
 * Resets the priority buttons to their default state and removes any active styles.
 * @returns {void}
 */
function resetButtons() {
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');

    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';

    urgentBtn.firstElementChild.classList.remove('change-svg-color');
    mediumBtn.firstElementChild.classList.remove('change-svg-color');
    lowBtn.firstElementChild.classList.remove('change-svg-color');
}

/**
 * Applies the active priority to the corresponding button and updates the hidden input field 
 * to save the current priority.
 * @param {string} priority - The priority level to apply ('urgent', 'medium', 'low').
 * @returns {void}
 */
function applyActivePriority(priority) {
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');

    if (priority === 'urgent') {
        urgentBtn.classList.add('urgent-pri-active');
        urgentBtn.firstElementChild.classList.add('change-svg-color');
    } else if (priority === 'medium') {
        mediumBtn.classList.add('medium-prio-active');
        mediumBtn.firstElementChild.classList.add('change-svg-color');
    } else if (priority === 'low') {
        lowBtn.classList.add('low-prio-active');
        lowBtn.firstElementChild.classList.add('change-svg-color');
    }
    document.getElementById("priority").value = priority;
}

/**
 * Combines resetting of priority buttons and applying the active priority to the corresponding button.
 * @param {string} priority - The priority level to apply ('urgent', 'medium', 'low').
 * @returns {void}
 */
function selectPrio(priority) {
    resetButtons();
    applyActivePriority(priority);
}

/**
 * Creates a new task after validating the form, sends it to the server, displays a success popup, 
 * and reloads the page.
 * @returns {Promise<void>} - A promise that resolves when the task is successfully created.
 */
async function addTask() {
    if (!formvalidation()) {       
        return;
    }
    const newTask = {};

    fields.forEach(id => {
        const element = document.getElementById(id);
        newTask[id] = element ? element.value : '';
        if (element) element.value = ""; 
    });

    newTask.assignedTo = selectedContacts;
    newTask.subtasks = createdSubTasks;
    newTask.status = "todo";
    newTask.files = selectedFiles;

    await postTask("/tasks", newTask);
    document.getElementById("success-popup").style.display = "flex";
    setTimeout(() => {
        document.getElementById("success-popup").style.display = "none";
        window.location.reload();
    }, 2000);
    clearAddTaskForm();
    window.location.replace("board.html");   
}

/**
 * Handles changes to the subtask input field, toggling the visibility of icons based on the input value.
 * @returns {void}
 */
function subTaskInput(){
    let subTaskValue = document.getElementById("sub-task-input").value.trim();
    let plusIcon = document.querySelector('.subtask-btn-plus img');
    let checkedIcon = document.querySelector('.subtask-btn-checked img');
    let divider = document.querySelector('.subtask-btn-divider');
    let cancelIcon = document.querySelector('.subtask-btn-cancel img');

    if (subTaskValue === '') {       
        plusIcon.classList.remove('toggle-display');
        checkedIcon.classList.add('toggle-display');
        divider.classList.add('toggle-display');
        cancelIcon.classList.add('toggle-display');
    } else {       
        plusIcon.classList.add('toggle-display');
        checkedIcon.classList.remove('toggle-display');
        divider.classList.remove('toggle-display');
        cancelIcon.classList.remove('toggle-display');
    }
}

/**
 * Clears the subtask input field when the user clicks the clear icon.
 * @returns {void}
 */
function clearInput(){
    document.getElementById("sub-task-input").value= '';  
    subTask();
}

/**
 * Clears the subtask list input field when the user clicks the clear icon.
 * @returns {void}
 */
function clearSubTaskListInput(){
    let listItem = document.getElementById(subTaskValue);
    let currentText = listItem.querySelector('span').textContent; 
}


/**
 * Adds a new subtask if the input field is not empty, updating both the array and UI.
 * @returns {void}
 */
function addSubTask() {
    let subTaskValue = document.getElementById("sub-task-input").value.trim();
    
    if (subTaskValue !== '') {
        addSubTaskToArray(subTaskValue);
        updateSubTaskUI(subTaskValue);
        resetSubTaskInputIcons();
    }
}

/**
 * Adds the subtask to the array if it does not already exist.
 * @param {string} subTaskValue - The value of the subtask to add.
 * @returns {void}
 */
function addSubTaskToArray(subTaskValue) {
    // Check if the subtask is already in the array
    let existingSubtask = createdSubTasks.find(subtask => subtask.title === subTaskValue);

    if (!existingSubtask) {
        // Push a new object with title and completed status
        createdSubTasks.push({ title: subTaskValue, completed: false });
    }
}

/**
 * Updates the user interface with the new subtask.
 * @param {string} subTaskValue - The value of the subtask to update in the UI.
 * @returns {void}
 */
function updateSubTaskUI(subTaskValue) {
    let subtaskListContainer = document.getElementById('subtask-list-container');
    let subtaskList = subtaskListContainer.querySelector('ul');
    subtaskList.classList.remove('toggle-display');
    subtaskList.innerHTML += `
    <li id="${subTaskValue}" class="subtask-list">
        <div class="subtask-list-left">
            <span>${subTaskValue}</span>
        </div>
        <div class="subtask-list-right">
            <span><img src="./assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subTaskValue}')"></span>
            <div class="subtask-list-divider toggle-display"></div>
            <span><img src="./assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subTaskValue}')"></span>
        </div>
    </li>`;
    document.getElementById("sub-task-input").value = '';
}

/**
 * Resets the icons in the subtask input field after a subtask has been added.
 * @returns {void}
 */
function resetSubTaskInputIcons() {
    // Reset icon in the input when subtask is added
    let plusIcon = document.querySelector('.subtask-btn-plus img');
    let checkedIcon = document.querySelector('.subtask-btn-checked img');
    let divider = document.querySelector('.subtask-btn-divider');
    let cancelIcon = document.querySelector('.subtask-btn-cancel img');

    plusIcon.classList.remove('toggle-display');
    checkedIcon.classList.add('toggle-display');
    divider.classList.add('toggle-display');
    cancelIcon.classList.add('toggle-display');
}

/**
 * Removes a subtask from both the UI and the array.
 * @param {string} subTaskValue - The value of the subtask to remove.
 * @returns {void}
 */
function removeSubTask(subTaskValue) {
    let subTaskElement = document.getElementById(subTaskValue);
    if (subTaskElement) {
        subTaskElement.remove();
    }
    // remove the subtask
    for (let i = 0; i < createdSubTasks.length; i++) {
        if (createdSubTasks[i] === subTaskValue) {
            createdSubTasks.splice(i, 1);
            break;
        }
    }
}

/**
 * Allows editing of a subtask, replacing the list item with an editable input field.
 * @param {string} subTaskValue - The value of the subtask to edit.
 * @returns {void}
 */
function editSubTask(subTaskValue) {
    let listItem = document.getElementById(subTaskValue);
    let currentText = listItem.querySelector('span').textContent;
   // Hides the point in the list
    listItem.style.paddingLeft = '0px';
    listItem.innerHTML = `
        <form class="subtask-list-form" action="">
            <input type="text" name="" id="sub-task-list-input" value="${currentText}" oninput="handleInputChange('${subTaskValue}')">  
            <button type="button" class="subtask-btn-list">
                <span class="subtask-btn-list-checked">
                    <img src="./assets/icons/CheckAddTask.svg" alt="" onclick="saveSubTask('${subTaskValue}')">
                </span>
                <div class="subtask-btn-list-divider"></div>
                <span class="subtask-btn-list-delete">
                    <img src="./assets/icons/delete.svg" id="delete-icon-${subTaskValue}" alt="" onclick="clearSubTaskListInput('${subTaskValue}')">
                </span>
            </button>
        </form>
    `;
}

/**
 * Clears the input field for editing a subtask.
 * @param {string} subTaskValue - The value of the subtask being edited.
 * @returns {void}
 */
function clearSubTaskListInput(subTaskValue) {
    let inputField = document.getElementById('sub-task-list-input');
    if (inputField) {
        inputField.value = '';
        handleInputChange(subTaskValue);
    }
}

/**
 * Handles changes to the subtask input field during editing, updating the delete icon's appearance.
 * @param {string} subTaskValue - The value of the subtask being edited.
 * @returns {void}
 */
function handleInputChange(subTaskValue) {
    let inputField = document.getElementById('sub-task-list-input');
    let deleteIcon = document.getElementById(`delete-icon-${subTaskValue}`);
    if (inputField.value.trim() !== '') {
       
        deleteIcon.src = "./assets/icons/CloseAddTask.svg";
    } else {
       
        deleteIcon.src = "./assets/icons/delete.svg";
    }
}

/**
 * Saves the edited subtask text and updates the subtask list item in the UI.
 * @param {string} subTaskValue - The value of the subtask being saved.
 * @returns {void}
 */
function saveSubTask(subTaskValue) {
    let listItem = document.getElementById(subTaskValue);
    let inputField = listItem.querySelector('.subtask-list-form input');
    let newValue = inputField.value;

    // Update the inner HTML of listItem to reflect the new value
    listItem.innerHTML = `
        <div class="subtask-list-left">
            <input type="checkbox" onchange="toggleSubtaskCompletion(this, '${subTaskValue}')" class="d-none">
            <span>${newValue}</span>
        </div>
        <div class="subtask-list-right">
            <span><img src="./assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subTaskValue}')"></span>
            <div class="subtask-list-divider toggle-display"></div>
            <span><img src="./assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subTaskValue}')"></span>
        </div>
    `;

    // Show again the point in the list
    listItem.style.paddingLeft = '20px';
}
