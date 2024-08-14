
function assignedDropdown(users) {
    let dropdown = document.getElementById('contacts');    
    dropdown.innerHTML = "";

    
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        dropdown.appendChild(option);
    }
}

async function onloadfunc() {
    console.log("user");
    let users = await loadAssignedPerson("/contacts");
    
    if (users) {
        assignedDropdown(users);
    }
    
}

// check that the date is not in the past!
function checkDate(inputId) {
    let dateInput = document.getElementById(inputId);
    let today = new Date().toISOString().split("T")[0]; // Heutiges Datum im Format YYYY-MM-DD
  
    if (dateInput.value < today) {
      alert("Das Datum darf nicht in der Vergangenheit liegen.");
      return false;
    }
  
    return true;
  }
  
  

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
