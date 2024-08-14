// set minimum date

// brauchen wir das noch hier???
function setMinDate(inputId) {
  let dateInput = document.getElementById(inputId);
  let today = new Date().toISOString().split("T")[0]; // Heutiges Datum im Format YYYY-MM-DD
  dateInput.setAttribute("min", today);
}

document.addEventListener("DOMContentLoaded", function () {
  setMinDate("date"); // Setzt das Mindestdatum für das Input-Feld mit der ID "date"
});


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
