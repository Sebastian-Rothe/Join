let currentDraggedElement = null;

/**
 * Initializes the board and loads all tasks.
 * @async
 */
async function initBoard() {
  await loadTasks();
  updateBoard();
}

/**
 * Calculates statistics for subtasks, including the count of completed subtasks, total subtasks, and progress.
 * @param {Array} subtasks - Array of subtask objects.
 * @returns {Object} - An object containing `completedSubtasks`, `subtaskCount`, and `progress`.
 */
function calculateSubtaskStats(subtasks) {
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const subtaskCount = subtasks.length;
  const progress =
    subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0;
  return { completedSubtasks, subtaskCount, progress };
}

/**
 * Updates the board by rendering tasks for different status types.
 * @param {Array} filteredTasks - Array of tasks to be displayed on the boards.
 */
function updateBoard(filteredTasks = tasks) {
  renderBoard("todo", "todoBoard", filteredTasks);
  renderBoard("inProgress", "inProgressBoard", filteredTasks);
  renderBoard("awaitFeedback", "awaitFeedbackBoard", filteredTasks);
  renderBoard("done", "doneBoard", filteredTasks);
}

/**
 * Filters tasks based on their status type.
 * @param {Array} tasks - Array of task objects.
 * @param {string} statusType - The status type to filter by.
 * @returns {Array} - Array of tasks that match the status type.
 */
function filterTasksByStatus(tasks, statusType) {
  return tasks.filter((task) => task.status === statusType);
}

/**
 * Renders an empty section message for a given status type.
 * @param {string} statusType - The status type to render the empty section for.
 * @returns {string} - HTML string for the empty section.
 */
function renderEmptySection(statusType) {
  return `<div id="empty-section-note" class="empty-section-note">
      <span>No tasks ${statusType.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
    </div>`;
}

/**
 * Renders a task card for a given task element.
 * @param {Object} element - The task object to render.
 * @returns {string} - HTML string for the task card.
 */
function renderTaskCard(element) {
  const { completedSubtasks, subtaskCount, progress } = calculateSubtaskStats(element.subtasks);
  return generateTaskCardHTML({ ...element, completedSubtasks, subtaskCount, progress });
}

/**
 * Renders the board by updating the content for a specified status type.
 * @param {string} statusType - The status type to render tasks for.
 * @param {string} boardElementId - The ID of the HTML element to render the tasks in.
 * @param {Array} tasks - Array of task objects to be filtered and displayed.
 */
function renderBoard(statusType, boardElementId, tasks) {
  const filteredTasks = filterTasksByStatus(tasks, statusType);
  const content = document.getElementById(boardElementId);
  content.innerHTML = "";

  if (filteredTasks.length === 0) {
    content.innerHTML = renderEmptySection(statusType);
  } else {
    filteredTasks.forEach((element) => {
      content.innerHTML += renderTaskCard(element);
    });
  }
}

/**
 * Generates the HTML for a task card based on the provided task element.
 * @param {Object} element - The task element containing task details.
 * @param {string} element.idNumber - The unique identifier of the task.
 * @param {string} element.title - The title of the task.
 * @param {string} element.description - The description of the task.
 * @param {Array} element.subtasks - An array of subtasks associated with the task.
 * @param {string} element.category - The category of the task.
 * @param {string} element.priority - The priority level of the task.
 * @param {Array<string>} element.assignedTo - An array of users assigned to the task.
 * @returns {string} - The HTML string representing the task card.
 */
function generateTaskCardHTML(element) {
    const { completedSubtasks, subtaskCount, progress } = calculateSubtaskStats(element.subtasks);

    const avatarsHTML = generateAvatarsHTML(element.assignedTo);
    const subtasksHTML = generateSubtasksHTML(subtaskCount, completedSubtasks, progress);
    
    return `
        <div class="task-card" draggable="true" ondragstart="startDragging('${element.idNumber}')" onclick="openDetailedTaskOverlay('${element.idNumber}')">
            ${generateTaskHeader(element)}
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>
            ${subtasksHTML}
            <div class="task-footer">
                <div class="task-assigned">
                    ${avatarsHTML}
                </div>
                <div class="priority-icon ${element.priority}"></div>
            </div>
        </div>`;
}

/**
 * Generates the header HTML for a task card.
 * @param {Object} element - The task element containing task details.
 * @param {string} element.idNumber - The unique identifier of the task.
 * @param {string} element.category - The category of the task.
 * @returns {string} - The HTML string representing the task header.
 */
function generateTaskHeader(element) {
    return `
        <div class="align-task-card-head">
            <div class="task-label ${getTaskCategoryClass(element.category)}">${element.category}</div>
            <div class="task-head-menu-background" onclick="toggleTaskMenu(event, '${element.idNumber}')">
                <img src="./assets/icons/menu-mobile-board.svg" alt="">
                <div class="task-menu" style="display: none;" id="task-menu-${element.idNumber}">
                    <div class="menu-content">
                        ${generateTaskMenu(element.idNumber)}
                    </div>
                </div>
            </div>
        </div>`;
}

/**
 * Gets the CSS class based on the task category.
 * @param {string} category - The category of the task.
 * @returns {string} - The corresponding CSS class for the task category.
 */
function getTaskCategoryClass(category) {
    switch (category) {
        case "UserStory":
            return "user-story";
        case "TechnicalTask":
            return "technical-task";
        default:
            return "default-label";
    }
}

/**
 * Generates the HTML for the task menu with options to move the task.
 * @param {string} taskId - The unique identifier of the task.
 * @returns {string} - The HTML string representing the task menu.
 */
function generateTaskMenu(taskId) {
    return `
        <div onclick="moveTaskTo(event, 'todo', '${taskId}');">To Do</div>
        <div onclick="moveTaskTo(event, 'inProgress', '${taskId}');">In Progress</div>
        <div onclick="moveTaskTo(event, 'awaitFeedback', '${taskId}');">Await Feedback</div>
        <div onclick="moveTaskTo(event, 'done', '${taskId}');">Done</div>`;
}

/**
 * Generates the HTML for displaying user avatars assigned to a task.
 * @param {Array<string>} assignedTo - An array of users assigned to the task.
 * @returns {string} - The HTML string for displaying avatars, including a count of extra users if applicable.
 */
function generateAvatarsHTML(assignedTo) {
    const maxAvatarsToShow = 3;
    const avatarsHTML = assignedTo
        .slice(0, maxAvatarsToShow)
        .map(person => `<span class="avatar style-avatar-overlap">${createProfileIcon(person)}</span>`)
        .join("");

    const extraAvatarsCount = assignedTo.length - maxAvatarsToShow;
    const extraAvatarsHTML = extraAvatarsCount > 0 
        ? `<span class="align-assignedTo-count">+${extraAvatarsCount}</span>` 
        : "";

    return avatarsHTML + extraAvatarsHTML;
}

/**
 * Generates the HTML for displaying subtasks information and progress bar.
 * @param {number} subtaskCount - The total number of subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} progress - The progress percentage of subtasks.
 * @returns {string} - The HTML string representing the subtasks information and progress bar, or an empty string if there are no subtasks.
 */
function generateSubtasksHTML(subtaskCount, completedSubtasks, progress) {
    if (subtaskCount > 0) {
        return `
            <div class="task-subtasks">
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%;"></div>
                </div>
                <div class="subtask-info">${completedSubtasks}/${subtaskCount} Subtasks</div>
            </div>`;
    }
    return '';
}

/**
 * Sets the currently dragged element by its ID.
 * @param {string} id - The ID of the element being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows dropping on the specified element by preventing default behavior.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a new category and updates the board.
 * @param {string} category - The new category for the task.
 * @async
 */
async function moveTo(category) {
  let task = tasks.find((t) => t.idNumber === currentDraggedElement);
  if (task) {
    task.status = category;
    updateBoard();
    await putData(`/tasks/${task.idNumber}`, task);
  }
  removeHighlightFromAll()
}

/**
 * Highlights a drop area by adding a highlight class.
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes highlight classes from all elements in the drag area.
 * This function selects all elements with the classes 'drag-area-highlight' and 'dragging'
 * and removes those classes from each element.
 * @returns {void} - This function does not return a value.
 */
function removeHighlightFromAll() {
  document.querySelectorAll('.drag-area-highlight, .dragging').forEach((element) => {
    element.classList.remove('drag-area-highlight', 'dragging');
  });
}

/**
 * Removes highlight from a drop area by removing the highlight class.
 * @param {string} id - The ID of the element to remove highlight from.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Returns the appropriate CSS class for the task label based on its category.
 * @param {string} category - The category of the task.
 * @returns {string} - The CSS class for the task label.
 */
function getTaskLabelClass(category) {
  switch(category) {
    case "UserStory":
      return "user-story";
    case "TechnicalTask":
      return "technical-task";
    default:
      return "default-label";
  }
}

/**
 * Creates an HTML list of assigned users for a given task.
 * @param {Object} task - The task object containing assigned users.
 * @returns {string} - HTML string for the assigned users list.
 */
function createAssignedToList(task) {
  if (!task?.assignedTo?.length) {
    return "<li>No one assigned</li>";
  }
  return task.assignedTo.map(person => `
    <li class="assigned-person">
      <span class="avatar">${createProfileIcon(person)}</span>
      <span class="person-name">${person}</span>
    </li>
  `).join("");
}

/**
 * Creates an HTML list of subtasks for a given task.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - HTML string for the subtasks list.
 */
function createSubtasksList(task) {
  if (!task?.subtasks?.length) {
    return "<p>No subtasks</p>";
  }

  return task.subtasks.map((subtask, index) => `
    <label class="custom-checkbox align-checkbox-subtasks">
      <input type="checkbox" ${subtask.completed ? "checked" : ""} onchange="toggleSubtaskStatus('${task.idNumber}', ${index})" />
      <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="unchecked" x="1.38818" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"></rect>
        <path class="checked" d="M17.3882 8V14C17.3882 15.6569 16.045 17 14.3882 17H4.38818C2.73133 17 1.38818 15.6569 1.38818 14V4C1.38818 2.34315 2.73133 1 4.38818 1H12.3882" stroke="#2A3647" stroke-width="2" stroke-linecap="round"></path>
        <path class="checked" d="M5.38818 9L9.38818 13L17.3882 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      ${subtask.title || "No Title"}<br />
    </label>
  `).join("");
}

/**
 * Creates HTML for the task details section in the popup.
 * @param {Object} task - The task object to generate details for.
 * @returns {string} - HTML string for the task details.
 */
function createTaskDetails(task) {
  const priority = task?.priority || "No priority";
  const dueDate = task?.date ? formatDate(task.date) : "No due date";

  return `
    <div class="task-label-popup ${getTaskLabelClass(task.category)}">${task.category}</div>
    <img class="closeWindowImage" src="./assets/icons/close.svg" onclick="closePopup()">
    <h3 id="taskTitle" class="taskTitleDetails">${task.title || "No title"}</h3>
    <p id="taskDescription" class="taskDescriptionDetails">${task.description || "No description"}</p>
    <p><span class="titleDetails">Due date:</span> <span id="taskDueDate" class="board-popup-data dateTxtDetails">${dueDate}</span></p>
    <span class="align-priority-inline">
      <div class="titleDetails align-priority-inline">Priority:</div>
      <div class="align-priority">
        <div class="priority-icon ${task.priority}"></div>
        <span id="taskPriority" class="board-popup-data">${priority}</span>
      </div>
    </span>
  `;
}

/**
 * Generates the HTML for the task details popup.
 * @param {Object} task - The task object to generate the popup HTML for.
 * @returns {string} - HTML string for the task details popup.
 */
function getPopupHTML(task) {
  const assignedTo = createAssignedToList(task);
  const subtasks = createSubtasksList(task);
  const taskDetails = createTaskDetails(task);

  return `
    <div class="task-details-popup">
      <div class="board-popup-overlay" id="board-popupOverlay" style="display: none">
        <div class="board-popup-content">
          ${taskDetails}

          <p><span class="titleDetails">Assigned To:</span></p>
          <ul id="taskAssignedTo">
            ${assignedTo}
          </ul>

          <div class="board-popup-subtasks" id="taskSubtasks">
            <p class="titleDetails">Subtasks:</p>
            ${subtasks}
          </div>
        
          <div class="editOptionsDetailsContain">
            <div onclick="deleteTask('${task.idNumber}')" class="deleteDetailsContain">
              <img src="./assets/icons/Property 1=Default.png" alt="delete"/>
            </div>
            <div class="seperator"></div>
            <div onclick="openPopupEditTask('${task.idNumber}')" class="editDetailsContain">
              <img src="assets/icons/Property 1=Edit2.png" alt="edit"/>
            </div>
          </div>
      
        
        </div>
      </div>
    </div>`;
}

/**
 * Toggles the completion status of a subtask for a given task.
 * @param {string} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask to toggle.
 */
function toggleSubtaskStatus(taskId, subtaskIndex) {
  let task = tasks.find((t) => t.idNumber === taskId);

  task.subtasks[subtaskIndex].completed =
    !task.subtasks[subtaskIndex].completed;

  updateProgress(taskId);
  saveTaskProgress(taskId);

  const checkbox = document.querySelector(
    `input[type="checkbox"][data-task-id="${taskId}"][data-subtask-index="${subtaskIndex}"]`
  );
  if (checkbox) {
    checkbox.checked = task.subtasks[subtaskIndex].completed;
  }
}

/**
 * Updates the progress of a task based on its subtasks' completion status.
 * @param {string} taskId - The ID of the task to update progress for.
 */
function updateProgress(taskId) {
  let task = tasks.find((t) => t.idNumber === taskId);
  let completedCount = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  let totalCount = task.subtasks.length;
  let progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  task.progress = progress;
  let progressBar = document.getElementById(`progress-bar-${taskId}`);
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
}

/**
 * Saves the updated task progress to the server.
 * @param {string} taskId - The ID of the task to save progress for.
 * @async
 */
async function saveTaskProgress(taskId) {
  let task = tasks.find((t) => t.idNumber === taskId);
  let path = `/tasks/${taskId}`;

  try {
    await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error saving task progress:", error);
  }
}

/**
 * Formats a date from "YYYY-MM-DD" to "DD.MM.YYYY".
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(dateString) {
  if (!dateString) return "No due date";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Creates a task details popup in the DOM.
 * @param {Object} task - The task object to create a popup for.
 */
function createTaskPopup(task) {
  document.body.insertAdjacentHTML("beforeend", getPopupHTML(task));
}

/**
 * Updates the existing task popup with new task details.
 * @param {Object} task - The task object to update the popup with.
 */
function updateTaskPopup(task) {
  updateTaskDetails(task);
  updateAssignedToList(task);
  updateSubtasksList(task);
}

/**
 * Updates the assigned users list in the task popup.
 * @param {Object} task - The task object to get assigned users from.
 */
function updateAssignedToList(task) {
  const assignedToElement = document.getElementById("taskAssignedTo");
  assignedToElement.innerHTML = task.assignedTo?.length
    ? task.assignedTo
        .map((person) => `<li>${person}</li>`)
        .join("")
    : "<li>No one assigned</li>";
}

/**
 * Updates the subtasks list in the task popup.
 * @param {Object} task - The task object to get subtasks from.
 */
function updateSubtasksList(task) {
  const subtasksElement = document.getElementById("taskSubtasks");
  subtasksElement.innerHTML =
    "<p class='titleDetails'>Subtasks:</p>" +
    (task.subtasks?.length
      ? task.subtasks
          .map(
            (subtask, index) => `
      <label class="custom-checkbox align-checkbox-subtasks">
        <input type="checkbox" ${subtask.completed ? "checked" : ""} onchange="toggleSubtaskStatus('${task.idNumber}', ${index})"/>
        ${subtask.title || "No Title"}<br />
      </label>`
          )
          .join("")
      : "<p>No subtasks</p>");
}

/**
 * Updates the task details in the task popup with the current task information.
 * @param {Object} task - The task object to update the details with.
 */
function updateTaskDetails(task) {
  const dueDate = task?.date ? formatDate(task.date) : "No due date";

  document.getElementById("taskTitle").innerText = task.title || "No title";
  document.getElementById("taskDescription").innerText = task.description || "No description";
  document.getElementById("taskDueDate").innerText = dueDate;
  document.getElementById("taskPriority").innerText = task.priority || "No priority";
}

/**
 * Opens the task details popup for a specific task.
 * @param {Object} task - The task object to display in the popup.
 */
function openPopup(task) {
  if (!document.getElementById("board-popupOverlay")) {
    createTaskPopup(task);
  } else {
    updateTaskPopup(task);
  }
  document.getElementById("board-popupOverlay").style.display = "flex";
}

/**
 * Closes the task details popup and updates the board.
 */
function closePopup() {
  const existingPopup = document.querySelector(".task-details-popup");
  if (existingPopup) {
    existingPopup.remove();
  }
  const popupOverlay = document.getElementById("board-popupOverlay");
  if (popupOverlay) popupOverlay.style.display = "none";
  updateBoard();
  let searchInput = document.getElementById('search-input');
  searchInput.value = '';
}

/**
 * Sets up event listeners for the application, including the close popup functionality.
 */
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (
      event.target.id === "board-closePopup" ||
      event.target.classList.contains("board-popup-overlay")
    ) {
      closePopup();
    }
  });
});

/**
 * Opens the detailed task overlay for a specific task ID.
 * @param {string} taskId - The ID of the task to open in the overlay.
 */
window.openDetailedTaskOverlay = (taskId) => {
  const task = tasks.find((t) => t.idNumber === taskId);
  if (task) openPopup(task);
  else console.error("Task not found:", taskId);
};

/**
 * Opens the modal for adding a new task.
 * This function displays the modal overlay and the add task modal. It fetches the HTML
 * content from 'add_task.html', removes unnecessary elements, and loads the content 
 * into the modal.
 *
 * @returns {void} - This function does not return a value.
 */
function openPopupAddTask() {
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('addTaskModal').style.display = 'block';

    fetch('add_task.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const headSideFootDiv = doc.getElementById('head-side-foot');
            if (headSideFootDiv) {
                headSideFootDiv.remove();
            }
            const content = doc.querySelector('.container-main');
            if (content) {
                document.getElementById('addTaskContent').innerHTML = content.outerHTML;
            }
            onloadfunc();
        })  
}

/**
 * Closes the modal for adding a new task.
 * This function hides the modal overlay and the add task modal. It also clears any content
 * within the add task modal and resets the edit task popup if the function exists.
 *
 * @returns {void} - This function does not return a value.
 */
function closePopupAddTask() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('addTaskModal').style.display = 'none';
    document.getElementById('addTaskContent').innerHTML = '';
    if (typeof resetPopupEditTask === 'function') {
      resetPopupEditTask();
  }
}

/**
 * Initializes drag and scroll functionality for task sections.
 * This function adds event listeners to each task section to enable dragging 
 * and scrolling when the user clicks and drags on the section.
 * @returns {void} - This function does not return a value.
 */
document.querySelectorAll('.task-section').forEach(section => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  section.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - section.offsetLeft;
    scrollLeft = section.scrollLeft;
    section.style.cursor = 'grabbing';
  });

  section.addEventListener('mouseleave', () => {
    isDragging = false;
    section.style.cursor = 'grab';
  });

  section.addEventListener('mouseup', () => {
    isDragging = false;
    section.style.cursor = 'grab';
  });

  section.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - section.offsetLeft;
    const walk = (x - startX) * 2; 
    section.scrollLeft = scrollLeft - walk;
  });
});

/**
 * Moves a task to a new status.
 * This function updates the status of a task and refreshes the task board. 
 * It also sends the updated task data to the server.
 * @param {Event} event - The event object associated with the action.
 * @param {string} newStatus - The new status to assign to the task.
 * @param {string} taskId - The unique identifier of the task to be moved.
 * @returns {void} - This function does not return a value.
 */
function moveTaskTo(event, newStatus, taskId) {
  event.stopPropagation(); 
  let task = tasks.find((t) => t.idNumber === taskId);
  if (task) {
    task.status = newStatus;
    updateBoard();
    putData(`/tasks/${task.idNumber}`, task)
  }
}

/**
 * Toggles the visibility of the task menu.
 * This function displays or hides the task menu based on its current state.
 * @param {Event} event - The event object associated with the action.
 * @param {string} taskId - The unique identifier of the task for which the menu is toggled.
 * @returns {void} - This function does not return a value.
 */
function toggleTaskMenu(event, taskId) {
  event.stopPropagation(); 
  const taskMenu = document.getElementById(`task-menu-${taskId}`);
  taskMenu.style.display = taskMenu.style.display === "block" ? "none" : "block";
}

/**
 * Searches for tasks based on user input.
 * This function retrieves the search input value, filters tasks based on the title 
 * or description, and updates the task board to display the filtered results.
 * @returns {void} - This function does not return a value.
 */
function searchTasks() {
  let searchInput = document.getElementById('search-input');
  let searchedTask = searchInput.value.trim().toLowerCase();

  let filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchedTask) ||
      (task.description && task.description.toLowerCase().includes(searchedTask))
  );
  updateBoard(filteredTasks);
}


