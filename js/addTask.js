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

function updateSelectedBadges() {
    let selectedBadgesContainer = document.getElementById('selectedBadges');
    selectedBadgesContainer.innerHTML = '';

    selectedContacts.forEach(contact => {
        let profileIcon = createProfileIcon(contact);
        let badge = document.createElement('div');
        badge.classList.add('badge');
        badge.innerHTML = profileIcon;
        selectedBadgesContainer.appendChild(badge);
    });
}

function toggleDropdown() {
    let dropdownContent = document.getElementById('contactsDropdown');
    dropdownContent.classList.toggle('show');
}

async function onloadfunc() {
    let users = await loadAssignedPerson("/contacts");
    
    if (users) {
        assignedDropdown(users);
    }
    setMinDate();
}

function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', today);
}

function selectPrio(priority) {
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');

    // Reset all buttons
    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';

    // Apply active priority
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
//////////////////////////////////////////////////////////////////////Create Task
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

    newTask.contacts = selectedContacts;
    newTask.subtasks = createdSubTasks;
    newTask.status = "todo";

    await postTask("/tasks", newTask);
    clearAddTaskForm();
}

////////////////////////////////////////////////////////// subTask function whenever the input value changes. 
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

// ///////////////////////////////////////////////////when the user clicks on the image the input field will be cleared

function clearInput(){
    document.getElementById("sub-task-input").value= '';  
    subTask();
}
////////////////////////////////////////////////////// addSubTask 

function addSubTask() {
    let subTaskValue = document.getElementById("sub-task-input").value.trim();
    
    if (subTaskValue !== '') {

        if (!createdSubTasks.includes(subTaskValue)) {
            createdSubTasks.push(subTaskValue);
        }

        let subtaskListContainer = document.getElementById('subtask-list-container');
        let subtaskList = subtaskListContainer.querySelector('ul');
        subtaskList.classList.remove('toggle-display');
        subtaskList.innerHTML += `
        <li id="${subTaskValue}" class="subtask-list">
            <div class="subtask-list-left">
                <span>${subTaskValue}</span>
            </div>
            <div class="subtask-list-right">
                <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display"></span>
                <div class="subtask-list-divider toggle-display"></div>
                <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask(${subTaskValue})"></span>
            </div>
        </li>`;
        document.getElementById("sub-task-input").value = '';
    }
}
////////////////////////////////////////////////////////////////////RemoveSubTask
function removeSubTask(id)
{
    document.getElementById(id).remove();
    createdSubTasks = createdSubTasks.filter(subtask => subtask !== id);
}
//////////////////////////////////////////////////////clear all input value in add task page 

function clearAddTaskForm()
{
    //clear all input values
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = ""; 
    });

    //clear all selected contacts and uncheck them
    selectedContacts = [];
    let dropdownContent = document.getElementById('contactsDropdown');
    let checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedBadges();

    //clear subtasks and remove all of them
    createdSubTasks = [];
    let subTasks = document.querySelectorAll(".subtask-list");
    subTasks.forEach(function(subTask) {
        subTask.remove();
    });

    // Reset all buttons
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');

    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';
    mediumBtn.classList.add('medium-prio-active');
}

// /////////////////////////////////////////////////*css*/`
    
function saveAddTaskArray(){
    let subTaskValue = document.getElementById("sub-task-input").value
    createdSubTasks.push(subTaskValue);
}

/////////////////////////////////////////////////////form validation

function formvalidation() {
    let titleInput = document.getElementById("title");
    let dateInput = document.getElementById("date");
    let categorySelect = document.getElementById("category");
    let errorDivDate = document.querySelector(".error-validation-date");
    let errorDivTitle = document.querySelector(".error-validation-title");
    let errorDivCategory = document.querySelector(".error-validation-category");
    
    let isValid = true;

    // Checking the title field
    if (titleInput.value.trim() === "") {
        titleInput.classList.add('invalid');
        errorDivTitle.classList.remove('toggle-display');
        
        isValid = false;
    } else {
        titleInput.classList.remove('invalid');
        errorDivTitle.classList.add('toggle-display');
    }
    // Checking the date field
    if (dateInput.value.trim() === "") {
        errorDivDate.classList.remove('toggle-display');
        dateInput.classList.add('invalid');
        isValid = false;
    } else {
        dateInput.classList.remove('invalid');
        errorDivDate.classList.add('toggle-display');
    }
       // Checking the drop-down Category
       if (categorySelect.value === "") {
        errorDivCategory.classList.remove('toggle-display');
        categorySelect.classList.add('invalid');
        isValid = false;
    } else {
        categorySelect.classList.remove('invalid');
        errorDivCategory.classList.add('toggle-display');
    }
    return isValid;
}
    




