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
];

// Fills a dropdown with users' profile icons, names, and checkboxes, clearing any existing content.
function assignedDropdown(users) {
    let dropdownContent = document.getElementById('contactsDropdown');
    dropdownContent.innerHTML = '';
    users.forEach(user => {
        let label = `
            <label style="display: flex; align-items: center; padding: 8px;">
                ${createProfileIcon(user.name)}
                <span>${user.name}</span>
                <input type="checkbox" value="${user.name}" style="margin-left: auto;" onclick="toggleContactSelection(this)">
            </label>
        `;
        dropdownContent.innerHTML += label;
    });
}

//Toggles the selection of a contact, adding or removing it from the selected contacts list, and updates the display. 
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

//Display Selected Contacts as Badges with Overflow Indicator
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

//Toggles the visibility of the dropdown menu.
function toggleDropdown() {    
    let dropdownContent = document.getElementById('contactsDropdown');
    if (dropdownContent) {
        dropdownContent.classList.toggle('show');
    }
}

// Close dropdown if clicked outside
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

// Initializes the page by loading assigned users and setting the minimum date for the date input.
async function onloadfunc() {
    let users = await loadAssignedPerson("/contacts");
    
    if (users) {
        assignedDropdown(users);
    }
    setMinDate();
}

// Sets the minimum date for the date input to today's date.
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', today);
}

/**
 * Applies the active priority to the corresponding button and updates the hidden input field to save the current priority.
 * @param {string} priority - The priority level to apply ('urgent', 'medium', 'low').
 */
function resetButtons() {
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');

    // Reset all buttons
    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';

    // Reset SVG colors
    urgentBtn.firstElementChild.classList.remove('change-svg-color');
    mediumBtn.firstElementChild.classList.remove('change-svg-color');
    lowBtn.firstElementChild.classList.remove('change-svg-color');
}

// applies the active priority to the corresponding button and updates the hidden input field to save the current priority.
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

// This function combines the two previous functions
function selectPrio(priority) {
    resetButtons();
    applyActivePriority(priority);
}

////Creates a new task after validation, sends it to the server, displays a success popup and reloads the page.
async function addTask() {

     // If validation fails, the task will not be added
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

    await postTask("/tasks", newTask);
     // Show success popup after task is added successfully
     document.getElementById("success-popup").style.display = "flex";

     // Hide the popup after 2 seconds
     setTimeout(() => {
        document.getElementById("success-popup").style.display = "none";
        window.location.reload();
     }, 2000);
    clearAddTaskForm();   
}

// subTask function whenever the input value changes. 
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

//when the user clicks on the image the input field will be cleared
function clearInput(){
    document.getElementById("sub-task-input").value= '';  
    subTask();
}

//when the user clicks on the image the input field will be cleared
function clearSubTaskListInput(){
    let listItem = document.getElementById(subTaskValue);
    let currentText = listItem.querySelector('span').textContent; 
}

// Adds a new subtask if the input field is not empty
function addSubTask() {
    let subTaskValue = document.getElementById("sub-task-input").value.trim();
    
    if (subTaskValue !== '') {
        addSubTaskToArray(subTaskValue);
        updateSubTaskUI(subTaskValue);
        resetSubTaskInputIcons();
    }
}

// Adds the subtask to the array if it does not yet exist
function addSubTaskToArray(subTaskValue) {
    // Check if the subtask is already in the array
    let existingSubtask = createdSubTasks.find(subtask => subtask.title === subTaskValue);

    if (!existingSubtask) {
        // Push a new object with title and completed status
        createdSubTasks.push({ title: subTaskValue, completed: false });
    }
}

// Updates the user interface with the new subtask
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
            <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subTaskValue}')"></span>
            <div class="subtask-list-divider toggle-display"></div>
            <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subTaskValue}')"></span>
        </div>
    </li>`;
    document.getElementById("sub-task-input").value = '';
}

// Resets the icons in the input field after a subtask has been added
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

//// Removes a subtask based
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

/// Allows the editing of a subtask
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
                    <img src="../assets/icons/CheckAddTask.svg" alt="" onclick="saveSubTask('${subTaskValue}')">
                </span>
                <div class="subtask-btn-list-divider"></div>
                <span class="subtask-btn-list-delete">
                    <img src="../assets/icons/delete.svg" id="delete-icon-${subTaskValue}" alt="" onclick="clearSubTaskListInput('${subTaskValue}')">
                </span>
            </button>
        </form>
    `;
}

//// Clears the input field for editing a subtask
function clearSubTaskListInput(subTaskValue) {
    let inputField = document.getElementById('sub-task-list-input');
    if (inputField) {
        inputField.value = '';
        handleInputChange(subTaskValue);
    }
}

//Change Img(Button) if the current input changes
function handleInputChange(subTaskValue) {
    let inputField = document.getElementById('sub-task-list-input');
    let deleteIcon = document.getElementById(`delete-icon-${subTaskValue}`);
    if (inputField.value.trim() !== '') {
       
        deleteIcon.src = "../assets/icons/CloseAddTask.svg";
    } else {
       
        deleteIcon.src = "../assets/icons/delete.svg";
    }
}

//save subtask text after edite
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
            <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subTaskValue}')"></span>
            <div class="subtask-list-divider toggle-display"></div>
            <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subTaskValue}')"></span>
        </div>
    `;

    // Show again the point in the list
    listItem.style.paddingLeft = '20px';
}

//clear all input value in add task page
function clearInputsAndSelections() {
    // Clear all input values
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = ""; 
    });

    // Clear all selected contacts and uncheck them
    selectedContacts = [];
    let dropdownContent = document.getElementById('contactsDropdown');
    let checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedBadges();

    // Clear subtasks and remove all of them
    createdSubTasks = [];
    let subTasks = document.querySelectorAll(".subtask-list");
    subTasks.forEach(function(subTask) {
        subTask.remove();
    });
}

// Reset all buttons
function resetPriorityButtonsAndEditTask() { 

    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');
    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';
    mediumBtn.classList.add('medium-prio-active');

    // Reset the edit task popup
    if (typeof resetPopupEditTask === 'function') {
        resetPopupEditTask();
    }
}

/**
 * Clears the task input form by resetting all inputs and selections, 
 * as well as resetting priority buttons and the task editor.
 */
function clearAddTaskForm() {
    clearInputsAndSelections();
    resetPriorityButtonsAndEditTask();
}

//Function to save the value of a new subtask into an array 
function saveAddTaskArray(){
    let subTaskValue = document.getElementById("sub-task-input").value
    createdSubTasks.push(subTaskValue);
}

//form Validate Title
function validateTitle() {
    let titleInput = document.getElementById("title");
    let errorDivTitle = document.querySelector(".error-validation-title");

    if (titleInput.value.trim() === "") {
        titleInput.classList.add('invalid');
        errorDivTitle.classList.remove('toggle-display');
        return false;
    } else {
        titleInput.classList.remove('invalid');
        errorDivTitle.classList.add('toggle-display');
        return true;
    }
}

//form Validate Date
function validateDate() {
    let dateInput = document.getElementById("date");
    let errorDivDate = document.querySelector(".error-validation-date");

    if (dateInput.value.trim() === "") {
        errorDivDate.classList.remove('toggle-display');
        dateInput.classList.add('invalid');
        return false;
    } else {
        dateInput.classList.remove('invalid');
        errorDivDate.classList.add('toggle-display');
        return true;
    }
}

//form Validate Category
function validateCategory() {
    let categorySelect = document.getElementById("category");
    let errorDivCategory = document.querySelector(".error-validation-category");

    if (categorySelect.value === "") {
        errorDivCategory.classList.remove('toggle-display');
        categorySelect.classList.add('invalid');
        return false;
    } else {
        categorySelect.classList.remove('invalid');
        errorDivCategory.classList.add('toggle-display');
        return true;
    }
}

// Combining the Functions
function formvalidation() {
    let isTitleValid = validateTitle();
    let isDateValid = validateDate();
    let isCategoryValid = validateCategory();

    return isTitleValid && isDateValid && isCategoryValid;
}




