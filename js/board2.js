
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
  
  