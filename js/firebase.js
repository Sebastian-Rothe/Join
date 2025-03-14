const BASE_URL =
  "https://join-d97d9-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];
let tasks = [];

/**
 * Loads contacts from a JSON file.
 * @async
 * @param {string} [path="/contacts"] - The path to the JSON file containing the contacts.
 * @returns {Promise<Array<{id: string, name: string, email: string, phone: string}>>} - An array of user objects.
 */
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

/**
 * Adds a new contact via a POST request.
 * @async
 * @param {string} path - The path to the JSON file where the contact should be added.
 * @param {Object} data - The data of the new contact.
 * @returns {Promise<void>} - A promise that resolves to nothing.
 */
async function postContact(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a contact based on the ID.
 * @async
 * @param {string} id - The ID of the contact to be deleted.
 * @returns {Promise<Object|null>} - The server's response or null if an error occurs.
 */
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

/**
 * Loads and displays contacts.
 * @async
 * @param {Object|null} [newUser=null] - A new user to display, if any.
 * @returns {Promise<void>} - A promise that resolves to nothing.
 */
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

/**
 * Loads tasks from a JSON file.
 * @async
 * @param {string} [path="/tasks"] - The path to the JSON file containing the tasks.
 * @returns {Promise<Array>} - An array of task objects.
 */
async function loadTasks(path = "/tasks") {
  tasks = [];
  try {
      const taskResponse = await fetch(BASE_URL + path + ".json");
      if (!taskResponse.ok) throw new Error(`HTTP error! status: ${taskResponse.status}`);

      const responseToJson = await taskResponse.json();
      if (responseToJson) {
          tasks = Object.keys(responseToJson).map(key => createTaskObject(key, responseToJson[key]));
      }
  } catch (error) {
      console.error('Error loading tasks:', error);
  }
}

/**
 * Creates a task object based on the provided data.
 * @param {string} key - The key of the task.
 * @param {Object} task - The data of the task.
 * @returns {Object} - A task object.
 */
function createTaskObject(key, task) {
  return {
      idNumber: key,
      status: task.status || "todo",
      category: task.category || "Uncategorized",
      title: task.title || "No Title",
      description: task.description || "Task without a description",
      date: task.date || null,
      subtasks: createSubtasksArray(task.subtasks),
      assignedTo: getAssignedToArray(task.assignedTo),
      priority: task.priority || "medium"
  };
}

/**
 * Creates an array of subtasks based on the provided data.
 * @param {Array} subtasks - The subtasks as an array.
 * @returns {Array<Object>} - An array of subtask objects.
 */
function createSubtasksArray(subtasks) {
  return (Array.isArray(subtasks) ? subtasks : []).map(subtask => ({
      title: subtask.title || "No Title",
      completed: subtask.completed || false
  }));
}

/**
 * Creates an array of assigned persons from the provided data.
 * @param {Array|string} assignedTo - The assigned persons as an array or a comma-separated string.
 * @returns {Array<string>} - An array of names of assigned persons.
 */
function getAssignedToArray(assignedTo) {
  if (Array.isArray(assignedTo)) {
      return assignedTo;
  }
  if (typeof assignedTo === 'string') {
      return assignedTo.split(", ").map(name => name.trim());
  }
  return [];
}

/**
 * Adds a new task via a POST request.
 * @async
 * @param {string} path - The path to the JSON file where the task should be added.
 * @param {Object} data - The data of the new task.
 * @returns {Promise<Object>} - The server's response or undefined in case of an error.
 */
async function postTask(path = "", data = {}) {
  try {
    // Convert files to Base64 and add to the task data
    if (data.files) {
      const filesArray = await Promise.all(data.files.map(async file => {
        const base64 = await fileToBase64(file);
        return {
          fileName: file.name,
          type: file.type,
          file: base64
        };
      }));
      data.files = filesArray;
    }

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

/**
 * Converts a file to a Base64 string.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Loads assigned persons from a JSON file.
 * @async
 * @param {string} [path="/contacts"] - The path to the JSON file containing the contacts.
 * @returns {Promise<Array<{name: string}>>} - An array of objects with the names of users.
 */
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

/**
 * Updates data via a PUT request.
 * @async
 * @param {string} path - The path to the JSON file to be updated.
 * @param {Object} data - The new data to be saved.
 * @returns {Promise<void>} - A promise that resolves to nothing.
 */
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
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

/**
 * Deletes a task based on the ID.
 * @async
 * @param {string} id - The ID of the task to be deleted.
 * @returns {Promise<Object|null>} - The server's response or null if an error occurs.
 */
async function deleteTask(id) {
  let response = await fetch(BASE_URL + `/tasks/${id}.json`, {
    method: "DELETE",
  });
  if (!response.ok) {
    return null;
  }
  let responseToJson = await response.json();
  await loadTasks("/tasks");
  updateBoard();
  closePopup();
  return responseToJson;
}

