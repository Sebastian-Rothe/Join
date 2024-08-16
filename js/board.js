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
document.addEventListener("DOMContentLoaded", function () {
  let closeButton = document.getElementById("board-closePopup");
  let popupOverlay = document.getElementById("board-popupOverlay");

  function openPopup() {
    popupOverlay.style.display = "flex";
  }

  function closePopup() {
    popupOverlay.style.display = "none";
  }

  closeButton.addEventListener("click", closePopup);

  popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) {
      closePopup();
    }
  });

  window.openDetailedTaskOverlay = function (taskId) {
    let task = tasks.find((t) => t.idNumber === taskId);

    if (task) {
      // Das Popup mit Aufgabeninformationen befüllen
      document.getElementById("taskTitle").innerText = task.title || "No title";
      document.getElementById("taskDescription").innerText =
        task.description || "No description";
      document.getElementById("taskDueDate").innerText =
        task.dueDate || "No due date";
      document.getElementById("taskPriority").innerText =
        task.priority || "No priority";

      let assignedToElement = document.getElementById("taskAssignedTo");
      assignedToElement.innerHTML = "";
      if (task.assignedTo && task.assignedTo.length > 0) {
        task.assignedTo.forEach((person) => {
          let li = document.createElement("li");
          li.textContent = person;
          assignedToElement.appendChild(li);
        });
      } else {
        assignedToElement.innerHTML = "<li>No one assigned</li>";
      }

      let subtasksElement = document.getElementById("taskSubtasks");
      subtasksElement.innerHTML = "<p>Subtasks:</p>";
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((subtask) => {
          let label = document.createElement("label");
          label.innerHTML = `<input type="checkbox" ${
            subtask.completed ? "checked" : ""
          } /> ${subtask.title}<br />`;
          subtasksElement.appendChild(label);
        });
      } else {
        subtasksElement.innerHTML += "<p>No subtasks</p>";
      }

      openPopup();
    } else {
      console.error("Task not found:", taskId);
    }
  };
});
