// set minimum date

// brauchen wir das noch hier???
// function setMinDate(inputId) {
//   let dateInput = document.getElementById(inputId);
//   let today = new Date().toISOString().split("T")[0]; // Heutiges Datum im Format YYYY-MM-DD
//   dateInput.setAttribute("min", today);
// }

// document.addEventListener("DOMContentLoaded", function () {
//   setMinDate("date"); // Setzt das Mindestdatum für das Input-Feld mit der ID "date"
// });

// -----------------------------

// das brauchen wir dann auch nicht mehr
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

// -----------------------

// Suchfunktionalität

document.getElementById("search-input").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const taskSections = document.querySelectorAll(".task-section");

  let noResults = true;

  taskSections.forEach((section) => {
    const tasks = section.querySelectorAll(".task");
    let sectionHasResults = false;

    tasks.forEach((task) => {
      const taskTitle = task
        .querySelector(".task-title")
        .textContent.toLowerCase();
      const taskDescription = task
        .querySelector(".task-description")
        .textContent.toLowerCase();

      if (
        taskTitle.includes(searchTerm) ||
        taskDescription.includes(searchTerm)
      ) {
        task.style.display = "block";
        sectionHasResults = true;
      } else {
        task.style.display = "none";
      }
    });

    if (sectionHasResults) {
      section.parentElement.querySelector(".empty-section-note").style.display =
        "none";
      noResults = false;
    } else {
      section.parentElement.querySelector(".empty-section-note").style.display =
        "block";
    }
  });

  if (searchTerm === "") {
    taskSections.forEach((section) => {
      section.parentElement.querySelector(".empty-section-note").style.display =
        "none";
    });
  }

  if (noResults && searchTerm !== "") {
    // test Suchfeld "No results found"
    alert("No tasks match your search .");
  }
});



// new code for rendering board
let currentDraggedElement = null;

async function initBoard() {
  await loadTasks(); // Daten von Firebase laden
  updateBoard(); // Board aktualisieren
}

function calculateProgress(completedSubtasks, subtaskCount) {
  return (completedSubtasks / subtaskCount) * 100;
}

// function getCategoryStyle(category) {
//     switch (category) {
//         case "User Story":
//             return { labelClass: "user-story-label", labelText: "User Story" };
//         case "Technical Task":
//             return { labelClass: "technical-task-label", labelText: "Technical Task" };
//         default:
//             return { labelClass: "default-label", labelText: category };
//     }
// }

function updateBoard() {
  renderBoard("todo", "todoBoard");
  renderBoard("inProgress", "inProgressBoard");
  renderBoard("awaitFeedback", "awaitFeedbackBoard");
  renderBoard("done", "doneBoard");
}

function renderBoard(statusType, boardElementId) {
  let filteredTasks = tasks.filter((t) => t.status === statusType);
  let content = document.getElementById(boardElementId);
  content.innerHTML = "";

  if (filteredTasks.length === 0) {
    content.innerHTML = `<div id="empty-section-note" class="empty-section-note">
                            <span>No tasks ${statusType
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}</span>
                         </div>`;

  } else {
    filteredTasks.forEach((element) => {
      element.progress = calculateProgress(
        element.completedSubtasks,
        element.subtaskCount
      );
      // const categoryStyle = getCategoryStyle(element.category);
      // element.labelClass = categoryStyle.labelClass;
      // element.labelText = categoryStyle.labelText;
      content.innerHTML += generateTaskCardHTML(element);
    });
  }
}

function generateTaskCardHTML(element) {
  return `
        <div class="task-card" draggable="true" ondragstart="startDragging('${
          element.idNumber
        }')" onclick="openDetailedTaskOverlay('${element.idNumber}')">
            <div class="task-label ${
              element.category === "UserStory"
                ? "user-story"
                : element.category === "TechnicalTask"
                ? "technical-task"
                : "default-label"
            }">${element.category}</div>
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>
            
            <div class="task-subtasks">
                <div class="progress-bar">
                    <div class="progress" style="width: ${
                      element.progress
                    }%;"></div>
                </div>
                <div class="subtask-info">${element.completedSubtasks}/${
    element.subtaskCount
  } Subtasks</div>
            </div>
            
            <div class="task-footer">
                <div class="task-assigned">
                    ${element.assignedTo
                      .map((person) => `<span class="avatar">${person}</span>`)
                      .join("")}
                </div>
                <div class="priority-icon ${element.priority}"></div>
            </div>
        </div>`;
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  let task = tasks.find((t) => t.idNumber === currentDraggedElement);
  if (task) {
    task.status = category;
    updateBoard();
  }
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function openDetailedTaskOverlay(taskId) {
  console.log("Opening detailed overlay for task ID:", taskId);
  // Implementiere hier die Logik, um ein detailliertes Overlay anzuzeigen.
}

// end section of: new code for rendering board
// --------------------------------------------