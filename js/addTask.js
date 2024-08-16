let selectedContacts = [];

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
        // badge.innerHTML = profileIcon + `<span>${contact}</span>`;
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

async function addTask() {
    const fields = [
        "title",
        "description",
        "date",
        "priority",
        "category",
        "subtasks",
        "status",
    ];
    const newTask = {};

    fields.forEach(id => {
        const element = document.getElementById(id);
        newTask[id] = element ? element.value : '';
        if (element) element.value = ""; // Clear input field
    });

    // Add selected contacts to the newTask object
    newTask.contacts = selectedContacts;

    console.log("New Task: ", newTask);

    // Clear the selected contacts array and badges after task creation
    selectedContacts = [];
    updateSelectedBadges();

    await postTask("/tasks", newTask);
}
