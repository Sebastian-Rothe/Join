function openPopupEditTask(taskId) {
  closePopup();
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('addTaskModal').style.display = 'block';
  document.getElementById('addTaskModal').style.padding = '0';
  document.getElementById('addTaskModal').classList.add('board-popup-content');

  fetch('add_task.html')
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const content = doc.querySelector('.container-main');
          if (content) {
              document.getElementById('addTaskContent').innerHTML = content.outerHTML;
              document.getElementById('titleHeaderAdust').innerHTML = "Edit Task";
              document.getElementById('left-right-container').classList.add('left-right-container-to-edit');
              document.getElementById('left-right-container').classList.remove('left-right-container');
              document.getElementById('left-side').classList.add('left-side-to-edit');
              document.getElementById('left-side').classList.remove('left-side');
              document.getElementById('right-side').classList.add('right-side-to-edit');
              document.getElementById('right-side').classList.remove('right-side');
              document.getElementById('footer-add-task-left').style.display = "none";
              document.getElementById('divider').style.display = "none";
              document.getElementById('footer-add-task').classList.add('footer-add-task-to-edit');
              document.getElementById('footer-add-task').classList.remove('footer-add-task');
              document.getElementById('footer-add-task-right').classList.add('footer-add-task-right-to-edit');
              document.getElementById('footer-add-task-right').classList.remove('footer-add-task');

            }
          
          const task = tasks.find(t => t.idNumber === taskId);

          if (task) {
              document.getElementById('title').value = task.title || '';
              document.getElementById('description').value = task.description || '';
              document.getElementById('date').value = task.date || '';
              document.getElementById('category').value = task.category || '';

              const priorityButton = document.getElementById(task.priority);
              if (priorityButton) {
                  priorityButton.classList.add('priority-btn-active');
              }

              fillAssignedToDropdown(task.assignedTo || []);
              fillSubtasks(task.subtasks || []);

              const selectedBadgesContainer = document.getElementById('selectedBadges');
              selectedBadgesContainer.innerHTML = '';
              task.assignedTo.forEach(contact => {
                  selectedBadgesContainer.innerHTML += createProfileIcon(contact);
              });
          }

          const saveButton = document.querySelector('.create-task-btn');
          saveButton.textContent = 'Save Task';
          saveButton.onclick = function() {
              updateTask(taskId);
          };

          onloadfunc();
      })
      .catch(error => {
          console.error('Error loading add_task.html:', error);
      });
}


// function selectPrio(priority) {
//   document.querySelectorAll('.priority-btn').forEach(button => {
//       button.classList.remove('priority-btn-active');
//   });
//   document.getElementById(priority).classList.add('priority-btn-active');
// }




function fillAssignedToDropdown(assignedTo) {
  const dropdown = document.getElementById("contactsDropdown");
  const selectedBadgesContainer = document.getElementById("selectedBadges");
  selectedBadgesContainer.innerHTML = "";

  updateDropdownOptions(dropdown, assignedTo, selectedBadgesContainer);
}

function updateDropdownOptions(dropdown, assignedTo, selectedBadgesContainer) {
  const options = [...dropdown.querySelectorAll(".dropdown-option")];

  options.forEach((option) => {
    const contactName = option.textContent.trim();
    const checkbox = option.querySelector('input[type="checkbox"]');

    if (checkbox) {
      checkbox.checked = assignedTo.includes(contactName);
      updateBadgeState(checkbox, contactName, selectedBadgesContainer);
    }
  });
}

function updateBadgeState(checkbox, contactName, container) {
  if (checkbox.checked) {
    container.innerHTML += createProfileIcon(contactName);
  } else {
    removeBadge(contactName, container);
  }
}

function removeBadge(contactName, container) {
  const badge = container.querySelector(`[data-contact="${contactName}"]`);
  if (badge) {
    badge.remove();
  }
}

function addBadge(fullname, container) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = fullname;
  badge.setAttribute("data-fullname", fullname);
  badge.onclick = () => {
    badge.remove();
    const checkbox = document.querySelector(
      `input[type="checkbox"][value="${fullname}"]`
    );
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  container.appendChild(badge);
}

function updateAssignedContacts(task) {
    const contactsDropdown = document.getElementById("contactsDropdown");

    if (contactsDropdown) {
        const selectedOptions = [
            ...contactsDropdown.querySelectorAll('input[type="checkbox"]:checked'),
        ].map(option => option.value);

        // Setze die zugewiesenen Kontakte zusammen
        task.assignedTo = Array.from(new Set([...task.assignedTo, ...selectedOptions]));
    } else {
        console.error(
            "Das Dropdown-Element mit der ID 'contactsDropdown' wurde nicht gefunden."
        );
    }
}


// #########################################################


function fillSubtasks(subtasks) {
  const subtaskContainer = document.getElementById("subtask-list-container");
  const subtaskList = subtaskContainer.querySelector("ul");
  subtaskList.innerHTML = "";

  toggleSubtaskListVisibility(subtaskList, subtasks.length);
  appendSubtasks(subtaskList, subtasks);
}

function toggleSubtaskListVisibility(subtaskList, subtaskCount) {
  if (subtaskCount > 0) {
    subtaskList.classList.remove("toggle-display");
  } else {
    subtaskList.classList.add("toggle-display");
  }
}

function appendSubtasks(subtaskList, subtasks) {
  subtasks.forEach((subtask) => {
    const li = createSubtaskListItem(subtask);
    subtaskList.appendChild(li);
  });
}

function createSubtaskListItem(subtask) {
  const li = document.createElement("li");
  li.id = subtask.title;
  li.classList.add("subtask-list");
  
  const checkedClass = subtask.completed ? "subtask-completed" : "";

  li.innerHTML = `
      <div class="subtask-list-left ${checkedClass}">
          <input type="checkbox" ${subtask.completed ? "checked" : ""} 
          onchange="toggleSubtaskCompletion(this, '${subtask.title}')" class="d-none">
          <span>${subtask.title}</span>
      </div>
      <div class="subtask-list-right">
          <span><img src="../assets/icons/EditAddTask.svg" alt="" class="toggle-display" onclick="editSubTask('${subtask.title}')"></span>
          <div class="subtask-list-divider toggle-display"></div>
          <span><img src="../assets/icons/delete.svg" alt="" class="toggle-display" onclick="removeSubTask('${subtask.title}')"></span>
      </div>
    `;
  return li;
}

function toggleSubtaskCompletion(checkbox) {
  const subtaskElement = checkbox.closest('li');
  const subtaskTitleElement = subtaskElement.querySelector('.subtask-list-left span');

  if (checkbox.checked) {
    subtaskTitleElement.classList.add('subtask-completed');
  } else {
    subtaskTitleElement.classList.remove('subtask-completed');
  }
}

function updateSubtasks(task) {
  const subtasks = [
    ...document.getElementById("subtask-list-container").querySelectorAll("li"),
  ].map((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const subtaskTitleElement = li.querySelector('.subtask-list-left span');
    
    return {
      title: subtaskTitleElement ? subtaskTitleElement.textContent.trim() : '',
      completed: checkbox ? checkbox.checked : false,
    };
  });

  task.subtasks = subtasks;
}




// end of subtasks


function updateTask(taskId) {
  const task = findTaskById(taskId);

  if (task) {
    updateTaskDetails(task);
    updateTaskPriority(task);
    updateAssignedContacts(task);
    updateSubtasks(task);

    sendUpdatedTask(taskId, task);
  }
  updateBoard();
}

function findTaskById(taskId) {
  return tasks.find((t) => t.idNumber === taskId);
}

function updateTaskDetails(task) {
  task.title = document.getElementById("title").value.trim();
  task.description = document.getElementById("description").value.trim();
  task.date = document.getElementById("date").value;
  task.category = document.getElementById("category").value;
}

function updateTaskPriority(task) {
  const selectedPriority = [...document.querySelectorAll(".priority-btn")].find(
    (btn) => btn.classList.contains("priority-btn-active")
  );
  task.priority = selectedPriority ? selectedPriority.id : "low";
}


function sendUpdatedTask(taskId, task) {
  putData(`/tasks/${taskId}`, task).then(() => {
    closePopupAddTask();
    updateBoard();
    resetPopupEditTask();
  });
}


function resetPopupEditTask() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('addTaskModal').style.display = 'none';
  document.getElementById('addTaskModal').style.padding = ''; 
  document.getElementById('addTaskModal').classList.remove('board-popup-content');
  document.getElementById('addTaskContent').innerHTML = '';

}

