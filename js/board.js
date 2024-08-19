// new code for rendering board
let currentDraggedElement = null;

async function initBoard() {
  await loadTasks(); // Daten von Firebase laden
  updateBoard(); // Board aktualisieren
}

// function calculateProgress(completedSubtasks, subtaskCount) {
//   return (completedSubtasks / subtaskCount) * 100;
// }
function calculateSubtaskStats(subtasks) {
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const subtaskCount = subtasks.length;
  const progress = subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0;
  return { completedSubtasks, subtaskCount, progress };
}


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
      // Berechnung der Subtasks-Statistiken
      const { completedSubtasks, subtaskCount, progress } = calculateSubtaskStats(element.subtasks);
      
      // Erstellung des HTML-Codes für die Aufgabe
      content.innerHTML += generateTaskCardHTML({
        ...element, // Kopiere alle Eigenschaften von `element`
        completedSubtasks, // Berechnete Werte hinzufügen
        subtaskCount,
        progress
      });
    });
  }
}


function generateTaskCardHTML(element) {
  const { completedSubtasks, subtaskCount, progress } = calculateSubtaskStats(element.subtasks);
  
  return `
  <div class="task-card" draggable="true" ondragstart="startDragging('${element.idNumber}')" onclick="openDetailedTaskOverlay('${element.idNumber}')">
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
          <div class="progress" style="width: ${progress}%;"></div>
        </div>
        <div class="subtask-info">${completedSubtasks}/${subtaskCount} Subtasks</div>
      </div>

      <div class="task-footer">
        <div class="task-assigned">
  ${element.assignedTo.map(person => `<span class="avatar">${createProfileIcon(person)}</span>`).join("")}
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

async function moveTo(category) {
  let task = tasks.find((t) => t.idNumber === currentDraggedElement);
  if (task) {
    task.status = category;
    updateBoard();
    putData(`/tasks/${task.idNumber}`, task);
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

function getPopupHTML(task) {
  const priority = task?.priority || "No priority";
  const assignedTo = task?.assignedTo?.length
    ? task.assignedTo.map(person => `<li>${person}</li>`).join("")
    : "<li>No one assigned</li>";
  
  // Subtasks with checkbox and onclick event to toggle status
  const subtasks = task?.subtasks?.length
    ? task.subtasks.map((subtask, index) => `
      <label>
        <input type="checkbox" ${subtask.completed ? "checked" : ""} 
        onclick="toggleSubtaskStatus('${task.idNumber}', ${index})" />
        ${subtask.title || "No Title"}<br />
      </label>`).join("")
    : "<p>No subtasks</p>";
  
  const dueDate = task?.date ? formatDate(task.date) : "No due date";

  return `
    <div class="task-details-popup">
      <div class="board-popup-overlay" id="board-popupOverlay" style="display: none">
        <div class="board-popup-content">
          
          <div class="task-label-popup ${
          task.category === "UserStory"
                ? "user-story"
                : task.category === "TechnicalTask"
                ? "technical-task"
                : "default-label"
            }">${task.category}
          </div>
          
          <img class="closeWindowImage" src="./assets/icons/close.svg" onclick="closePopup()">

          <h3 id="taskTitle" class="taskTitleDetails">${task.title || "No title"}</h3>

          <p id="taskDescription" class="taskDescriptionDetails">${task.description || "No description"}</p>
          <p><span class=" titleDetails">Due date:</span> <span id="taskDueDate" class="board-popup-data dateTxtDetails">${dueDate}</span></p>
        
        
          <span class="align-priority-inline">
            <div class="titleDetails align-priority-inline"> Priority: 
            </div>
            <div class="align-priority">
              <div class="priority-icon ${task.priority}">
              </div>
              <span id="taskPriority" class="board-popup-data">${priority}
              </span>
            </div>
          </span>
        
          <p><span class="titleDetails">Assigned To:</span></p>
          <ul id="taskAssignedTo">${assignedTo}</ul>
          <div class="board-popup-subtasks" id="taskSubtasks">
            <p class="titleDetails">Subtasks:</p>
            ${subtasks}
          </div>

          <div class="editOptionsDetailsContain">
            <div onclick="deleteTask('${task.idNumber}')" class="deleteDetailsContain">
                <img src="../assets/icons/Property 1=Default.png" alt="delete"/>
            </div>
            <div class="seperator"></div>
            <div onclick="editTask()" class="editDetailsContain">
                <img src="assets/icons/Property 1=Edit2.png" alt="edit"/>
            </div>
          </div>
          
        </div>
      </div>
    </div>`;
}
function toggleSubtaskStatus(taskId, subtaskIndex) {
  let task = tasks.find(t => t.idNumber === taskId);
  task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;

  // Update progress
  updateProgress(taskId);

  // Save changes to Firebase
  saveTaskProgress(taskId);
}
function updateProgress(taskId) {
  let task = tasks.find(t => t.idNumber === taskId);
  let completedCount = task.subtasks.filter(subtask => subtask.completed).length;
  let totalCount = task.subtasks.length;

  let progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Update the task's progress property
  task.progress = progress;

  // Update the progress bar in the task card
  let progressBar = document.getElementById(`progress-bar-${taskId}`);
  if (progressBar) {
      progressBar.style.width = `${progress}%`;
  }
}
async function saveTaskProgress(taskId) {
  let task = tasks.find(t => t.idNumber === taskId);
  let path = `/tasks/${taskId}`;

  try {
      await fetch(BASE_URL + path + ".json", {
          method: 'PUT',
          body: JSON.stringify(task),
          headers: {
              'Content-Type': 'application/json'
          }
      });
      console.log("Task progress updated successfully!");
  } catch (error) {
      console.error('Error saving task progress:', error);
  }
}






// Funktion zur Formatierung des Datums von "YYYY-MM-DD" zu "DD.MM.YYYY"
function formatDate(dateString) {
  if (!dateString) return "No due date";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

// Funktion zum Erstellen des Popups im DOM
function createTaskPopup(task) {
  document.body.insertAdjacentHTML("beforeend", getPopupHTML(task));
}

// Funktion zum Aktualisieren des Popups im DOM
function updateTaskPopup(task) {
  const dueDate = task?.date ? formatDate(task.date) : "No due date";
  
  document.getElementById("taskTitle").innerText = task.title || "No title";
  document.getElementById("taskDescription").innerText = task.description || "No description";
  document.getElementById("taskDueDate").innerText = dueDate;
  document.getElementById("taskPriority").innerText = task.priority || "No priority";

  const assignedToElement = document.getElementById("taskAssignedTo");
  assignedToElement.innerHTML = task.assignedTo?.length
    ? task.assignedTo.map(person => `<li>${person}</li>`).join("")
    : "<li>No one assigned</li>";

  const subtasksElement = document.getElementById("taskSubtasks");
  subtasksElement.innerHTML = "<p class='titleDetails'>Subtasks:</p>" + (task.subtasks?.length
    ? task.subtasks.map(subtask => `
      <label>
        <input type="checkbox" ${subtask.completed ? "checked" : ""} />
        ${subtask.title || "No Title"}<br />
      </label>`).join("")
    : "<p>No subtasks</p>");
}


// Funktion zum Öffnen des Popups
function openPopup(task) {
  if (!document.getElementById("board-popupOverlay")) {
    createTaskPopup(task);
  } else {
    updateTaskPopup(task);
  }
  document.getElementById("board-popupOverlay").style.display = "flex";
}

// Funktion zum Schließen des Popups
function closePopup() {
  const existingPopup = document.querySelector('.task-details-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  const popupOverlay = document.getElementById("board-popupOverlay");
  if (popupOverlay) popupOverlay.style.display = "none";
  updateBoard();
}

// Event-Listener für das Schließen des Popups
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.id === "board-closePopup" || event.target.classList.contains("board-popup-overlay")) {
      closePopup();
    }
  });
});

// Globale Funktion zum Öffnen des Popups von außen
window.openDetailedTaskOverlay = (taskId) => {
  const task = tasks.find(t => t.idNumber === taskId);
  if (task) openPopup(task);
  else console.error("Task not found:", taskId);
};
