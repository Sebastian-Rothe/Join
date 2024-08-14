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

// tasks functions
async function loadTasks(path = "/tasks") {
  tasks = [];
  let taskResponse = await fetch(BASE_URL + path + ".json");
  let responseToJson = await taskResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      tasks.push({
        id: key,
        title: responseToJson[key]["title"],
        description: responseToJson[key]["description"],
        assigned: responseToJson[key]["contacts"], // don't know how this is going to work
        date: responseToJson[key]["date"],
        priority: responseToJson[key]["priority"],
        category: responseToJson[key]["category"],
        subtasks: responseToJson[key]["subtasks"], // also tricky
        taskState: responseToJson[key]["taskState"],
      });
    });
    return tasks;
  }
}

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
    console.log(newTask[id], id);
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
