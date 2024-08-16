const BASE_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];
let tasks = [];

// contact functions
async function loadContacts(path = "/contacts") {
  users = [];
  let userResponse = await fetch(BASE_URL + path + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
    return users;
  }
}

async function postContact(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function deleteContact(id) {
  const detailDisplay = document.getElementById("contact-content");
  let response = await fetch(BASE_URL + `/contacts/${id}.json`, {
    method: "DELETE",
  });
  if (!response.ok) {
    return null;
  }
  let responseToJson = await response.json();
  await loadContacts("/contacts");
  displayContacts();
  detailDisplay.style.display = "none";
  return responseToJson;
}

async function displayContacts(newUser = null) {
  await loadContacts("/contacts");
  users.sort((a, b) => a.name.localeCompare(b.name));
  let contactDisplay = document.getElementById("contact-list");
  contactDisplay.innerHTML = "";

  let sortAlphabet = "";
  users.forEach((user) => {
    sortAlphabet = updateContactDisplay(
      contactDisplay,
      user,
      sortAlphabet,
      newUser
    );
  });
  highlightNewContact();
}

async function loadTasks(path = "/tasks") {
    tasks = [];
    try {
        let taskResponse = await fetch(BASE_URL + path + ".json");
        if (!taskResponse.ok) {
            throw new Error(`HTTP error! status: ${taskResponse.status}`);
        }
        let responseToJson = await taskResponse.json();
        console.log('Tasks loaded:', responseToJson); // Debugging

        if (responseToJson) {
            Object.keys(responseToJson).forEach((key) => {
                let task = responseToJson[key];
                tasks.push({
                    idNumber: key, // Verwende den Schlüssel als idNumber
                    status: task.status,
                    category: task.category || "Uncategorized",
                    title: task.title,
                    description: task.description || "Task without a description",
                    subtaskCount: task.subtaskCount || 0,
                    completedSubtasks: task.completedSubtasks || 0,
                    assignedTo: typeof task.contacts === 'string' ? task.contacts.split(", ") : [], // Typprüfung hinzugefügt 
                    priority: task.priority || "medium"
                });
            });
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }

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

async function putData(path = "", data) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    console.log('Data successfully updated:', response);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}
