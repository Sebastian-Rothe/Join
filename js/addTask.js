
const BASE_URL = "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadAssignedPerson(path = "/contacts") {
    let users = [];
    let userResponse = await fetch(BASE_URL + path + ".json");
    let responseToJson = await userResponse.json();

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
    let dropdown = document.getElementById('assignedDropdown');    
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
    let users = await loadAssignedPerson("/contacts");
    if (users) {
        assignedDropdown(users);
    }
}



///////////////////////////////////////////////////////////// Change background color when priority buttons is active

const priorityColors = {
    urgent: '#FF3D00',  
    medium: '#FFA800', 
    low: '#7AE229'  
};

function setPriority(priority) {
    
    const buttons = document.getElementsByClassName('priority-btn');
   
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = '';
        buttons[i].classList.remove('active');
        }

    
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains(priority)) {
            buttons[i].style.backgroundColor = priorityColors[priority];
            buttons[i].classList.add('active');
        }
    }
}