// Bestehende Funktionen für das Laden, Hinzufügen und Posten von Tasks

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
    console.log(newTask[id],id);
    document.getElementById(id).value = ""; // Clear input field
  });

  await postTask("/tasks", newTask);
  await loadTasks("/tasks");
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

// set minimum date
function setMinDate(inputId) {
  let dateInput = document.getElementById(inputId);
  let today = new Date().toISOString().split("T")[0]; // Heutiges Datum im Format YYYY-MM-DD
  dateInput.setAttribute("min", today);
}

document.addEventListener("DOMContentLoaded", function () {
  setMinDate("date"); // Setzt das Mindestdatum für das Input-Feld mit der ID "date"
});

// Popup management
document.addEventListener("DOMContentLoaded", function () {
  let openButton = document.getElementById("openboardButton");
  let closeButton = document.getElementById("board-closePopup");
  let popupOverlay = document.getElementById("board-popupOverlay");

  function openPopup() {
    popupOverlay.style.display = "flex";
  }

  function closePopup() {
    popupOverlay.style.display = "none";
  }

  openButton.addEventListener("click", openPopup);
  closeButton.addEventListener("click", closePopup);

  popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) {
      closePopup();
    }
  });
});

// Suchfunktionalität

document.getElementById('search-input').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const taskSections = document.querySelectorAll('.task-section');

  let noResults = true;

  taskSections.forEach(section => {
    const tasks = section.querySelectorAll('.task');
    let sectionHasResults = false;

    tasks.forEach(task => {
      const taskTitle = task.querySelector('.task-title').textContent.toLowerCase();
      const taskDescription = task.querySelector('.task-description').textContent.toLowerCase();

      if (taskTitle.includes(searchTerm) || taskDescription.includes(searchTerm)) {
        task.style.display = 'block';
        sectionHasResults = true;
      } else {
        task.style.display = 'none';
      }
    });

    if (sectionHasResults) {
      section.parentElement.querySelector('.empty-section-note').style.display = 'none';
      noResults = false;
    } else {
      section.parentElement.querySelector('.empty-section-note').style.display = 'block';
    }
  });

  if (searchTerm === '') {
    taskSections.forEach(section => {
      section.parentElement.querySelector('.empty-section-note').style.display = 'none';
    });
  }

  if (noResults && searchTerm !== '') {
    // test Suchfeld "No results found"
    alert('No tasks match your search .');
  }
});
