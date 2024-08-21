/**
 * Searches for tasks based on input and displays relevant results.
 */
function searchTaskFromInput() {
    let value = escapeHTML(document.getElementById('search-input').value.toLowerCase());

    tasks.forEach(task => {
        let taskSection = document.getElementById(`section${task.id}`);

        if (!taskSection) return;

        showOrHideTask(taskSection, task, value);
    });
}

/**
 * Displays or hides a task section based on search criteria.
 *
 * @param {HTMLElement} taskSection - The section element of the task.
 * @param {object} task - The task object.
 * @param {string} value - The search input value.
 */
function showOrHideTask(taskSection, task, value) {
    let title = task.title.toLowerCase();
    let description = task.description.toLowerCase();

    if (title.includes(value) || description.includes(value)) {
        taskSection.style.display = '';
    } else {
        taskSection.style.display = 'none';
    }
}