function assignedDropdown(users) {
    let dropdownContent = document.getElementById('contactsDropdown');
    dropdownContent.innerHTML = '';

    users.forEach(user => {
        let label = `
            <label style="display: flex; align-items: center; padding: 8px;">
                ${createProfileIcon(user.name)}
                <span>${user.name}</span>
                <input type="checkbox" value="${user.name}" style="margin-left: auto;" onclick="updateBadges()">
            </label>
        `;

        dropdownContent.innerHTML += label;
    });
}

function updateBadges() {
    let selectedBadgesContainer = document.getElementById('selectedBadges');
    selectedBadgesContainer.innerHTML = '';

    let checkboxes = document.querySelectorAll('#contactsDropdown input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        let profileIcon = createProfileIcon(checkbox.value);
        selectedBadgesContainer.innerHTML+=profileIcon;
    });
}

function toggleDropdown() {
    console.log("toggle clicked");
    let dropdownContent = document.getElementById('contactsDropdown');
    dropdownContent.classList.toggle('show');
}

async function onloadfunc() {
    console.log("user");
    let users = await loadAssignedPerson("/contacts");
    
    if (users) {
        assignedDropdown(users);
        
    }
    setMinDate();
}

// check that the date is not in the past!
// function checkDate(inputId) {
//     let dateInput = document.getElementById(inputId);
//     let today = new Date().toISOString().split("T")[0]; // Heutiges Datum im Format YYYY-MM-DD
  
//     if (dateInput.value < today) {
//       alert("Das Datum darf nicht in der Vergangenheit liegen.");
//       return false;
//     }
  
//     return true;
//   }
  
// minimum date of today and also checks that the selected date is not in the past
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById('date');
  dateInput.setAttribute('min', today);
}
// window.onload = setMinDate();

///////////////////////////////////////////////////////////// Change background color when priority buttons is active
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
        mediumBtn.firstElementChild.classList.remove('change-svg-color');
        lowBtn.firstElementChild.classList.remove('change-svg-color');
        mediumBtn.classList.remove('medium-prio-active');
        lowBtn.classList.remove('low-prio-active');

    } else if (priority === 'medium') {
        mediumBtn.classList.add('medium-prio-active');
        mediumBtn.firstElementChild.classList.add('change-svg-color');
        urgentBtn.firstElementChild.classList.remove('change-svg-color');
        lowBtn.firstElementChild.classList.remove('change-svg-color');
        urgentBtn.classList.remove('urgent-pri-active');
        lowBtn.classList.remove('low-prio-active');

    } else if (priority === 'low') {
        lowBtn.classList.add('low-prio-active');
        lowBtn.firstElementChild.classList.add('change-svg-color');
        urgentBtn.firstElementChild.classList.remove('change-svg-color');
        mediumBtn.firstElementChild.classList.remove('change-svg-color');
        mediumBtn.classList.remove('medium-prio-active');
        urgentBtn.classList.remove('urgent-pri-active');
    }
    document.getElementById("priority").value=priority;
}
