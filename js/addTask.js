
const BASE_URL = "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadAssignedPerson(path = "/contacts") {
    let users = [];
    let userResponse = await fetch(BASE_URL + path + ".json");
    let responseToJson = await userResponse.json();
console.log();
    if (responseToJson) {
        Object.keys(responseToJson).forEach((key) => {
            users.push({
                name: responseToJson[key]["name"],          
            });
        });
    }
    return users;
}

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

/////////////////////////////////////////////////////////////// firebase
async function addTask() {
    if (!checkDate("date")) return;
  
    const fields = [
      "title",
      "description",
      "contacts",
      "date",
      "priority",
      "category",
      "subtasks",
      "taskState",
    ];
    const newTask = {};
  
    fields.forEach((id) => {
      newTask[id] = document.getElementById(id).value;
      console.log(newTask[id],id);
      document.getElementById(id).value = ""; // Clear input field
    });
  
    await postTask("/tasks", newTask);
   
  }
  
  async function postTask(path = "", data = {}) {
    try {
      let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to post task");
      }
  
      let responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error posting task:", error);
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
