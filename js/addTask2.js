/**
 * Clears all input values, selections, and resets the form on the "Add Task" page.
 * @returns {void}
 */
function clearInputsAndSelections() {
    // Clear all input values
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = ""; 
    });
    // Clear all selected contacts and uncheck them
    selectedContacts = [];
    let dropdownContent = document.getElementById('contactsDropdown');
    let checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedBadges();
    // Clear subtasks and remove all of them
    createdSubTasks = [];
    let subTasks = document.querySelectorAll(".subtask-list");
    subTasks.forEach(function(subTask) {
        subTask.remove();
    });
    selectedFiles = [];
    displaySelectedFiles();
}

/**
 * Resets all priority buttons to their default state and ensures the "medium" priority is active.
 * Also resets the edit task popup if applicable.
 * @returns {void}
 */
function resetPriorityButtonsAndEditTask() { 
    const urgentBtn = document.getElementById('urgent');
    const mediumBtn = document.getElementById('medium');
    const lowBtn = document.getElementById('low');
    urgentBtn.className = 'priority-btn';
    mediumBtn.className = 'priority-btn';
    lowBtn.className = 'priority-btn';
    mediumBtn.classList.add('medium-prio-active');

    // Reset the edit task popup
    if (typeof resetPopupEditTask === 'function') {
        resetPopupEditTask();
    }
}

/**
 * Clears the task input form by resetting all inputs and selections, 
 * as well as resetting priority buttons and the task editor.
 * @returns {void}
 */
function clearAddTaskForm() {
    clearInputsAndSelections();
    resetPriorityButtonsAndEditTask();
}

/**
 * Saves the value of a new subtask into an array.
 * @returns {void}
 */
function saveAddTaskArray(){
    let subTaskValue = document.getElementById("sub-task-input").value
    createdSubTasks.push(subTaskValue);
}

/**
 * Validates the title input field, displaying an error message if the field is empty.
 * @returns {boolean} - Returns true if the title is valid, false otherwise.
 */
function validateTitle() {
    let titleInput = document.getElementById("title");
    let errorDivTitle = document.querySelector(".error-validation-title");

    if (titleInput.value.trim() === "") {
        titleInput.classList.add('invalid');
        errorDivTitle.classList.remove('toggle-display');
        return false;
    } else {
        titleInput.classList.remove('invalid');
        errorDivTitle.classList.add('toggle-display');
        return true;
    }
}

/**
 * Validates the date input field, displaying an error message if the field is empty.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
function validateDate() {
    let dateInput = document.getElementById("date");
    let errorDivDate = document.querySelector(".error-validation-date");

    if (dateInput.value.trim() === "") {
        errorDivDate.classList.remove('toggle-display');
        dateInput.classList.add('invalid');
        return false;
    } else {
        dateInput.classList.remove('invalid');
        errorDivDate.classList.add('toggle-display');
        return true;
    }
}

/**
 * Validates the category input field, displaying an error message if no category is selected.
 * @returns {boolean} - Returns true if the category is valid, false otherwise.
 */
function validateCategory() {
    let categorySelect = document.getElementById("category");
    let errorDivCategory = document.querySelector(".error-validation-category");

    if (categorySelect.value === "") {
        errorDivCategory.classList.remove('toggle-display');
        categorySelect.classList.add('invalid');
        return false;
    } else {
        categorySelect.classList.remove('invalid');
        errorDivCategory.classList.add('toggle-display');
        return true;
    }
}

/**
 * Combines the validation functions for title, date, and category inputs to determine 
 * if the form is valid for submission.
 * @returns {boolean} - Returns true if all fields are valid, false otherwise.
 */
function formvalidation() {
    let isTitleValid = validateTitle();
    let isDateValid = validateDate();
    let isCategoryValid = validateCategory();

    return isTitleValid && isDateValid && isCategoryValid;
}

/**
 * Displays the selected files below the file upload input.
 * @returns {void}
 */
function displaySelectedFiles() {
    const fileInput = document.getElementById('upload');
    fileInput.setAttribute('accept', 'image/jpeg, image/png, image/jpg, application/pdf'); // Accept only specific image types and PDF
    const fileListContainer = document.getElementById('file-list-container');
    const fileList = fileListContainer.querySelector('ul');
    fileList.innerHTML = ''; // Clear previous file list

    // Add new files to the selectedFiles array
    Array.from(fileInput.files).forEach(file => {
        if (validateFileType(file) && !selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });

    selectedFiles.forEach(file => {
        const li = document.createElement('li');
        li.classList.add('file-list-item');
        li.innerHTML = `
            <div class="file-list-left">
                <span>${file.name}</span>
            </div>
            <div class="file-list-right">
                <img src="assets/icons/delete.svg" alt="Delete Icon" onclick="removeFile('${file.name}')">
            </div>
        `;
        fileList.appendChild(li);
    });

    // const blob = convertFilesToBlob();
    // console.log(blob);
}

/**
 * Displays a custom popup with the given message.
 * @param {string} message - The message to display in the popup.
 */
function showFileErrorPopup(message) {
    const popup = document.getElementById('file-error-popup');
    const popupMessage = document.getElementById('file-error-message');
    popupMessage.innerText = message;
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

/**
 * Validates the file type to ensure it is an allowed image type or PDF.
 * @param {File} file - The file to validate.
 * @returns {boolean} - Returns true if the file type is valid, otherwise false.
 */
function validateFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showFileErrorPopup(`Invalid file type: ${file.name}. Only jpg, jpeg, png, and pdf files are allowed.`);
        return false;
    }
    return true;
}

/**
 * Removes a file from the list.
 * @param {string} fileName - The name of the file to remove.
 * @returns {void}
 */
function removeFile(fileName) {
    selectedFiles = selectedFiles.filter(file => file.name !== fileName);
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    document.getElementById('upload').files = dataTransfer.files;
 
    displaySelectedFiles();
}

/**
 * Converts the selected files to a Base64 format.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects containing the file metadata and Base64 string.
 */
async function convertFilesToBase64() {
    const filesArray = await Promise.all(selectedFiles.map(async file => {
        const base64 = await compressFile(file);
        return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64
        };
    }));
    return filesArray;
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
 * Compresses a file based on its type.
 * @param {File} file - The file to compress.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string of the compressed file.
 */
async function compressFile(file) {
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file.type.startsWith('image/')) {
        return compressImage(file);
    } else if (file.size > maxSize) {
        return compressOtherFileTypes(file);
    } else {
        return fileToBase64(file);
    }
}

/**
 * Compresses an image to a target size or quality.
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - The maximum width of the image.
 * @param {number} maxHeight - The maximum height of the image.
 * @param {number} quality - Quality of the compressed image (between 0 and 1).
 * @returns {Promise<string>} - Base64 string of the compressed image.
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new size to maintain aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    } else {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Export the image as Base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.onerror = () => reject('Error loading image.');
            img.src = event.target.result;
        };

        reader.onerror = () => reject('Error reading file.');
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses other file types using gzip compression.
 * @param {File} file - The file to compress.
 * @returns {Promise<string>} - Base64 string of the compressed file.
 */
async function compressOtherFileTypes(file) {
    const pako = await import('https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako.min.js');
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const compressed = pako.gzip(event.target.result);
                const compressedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(compressed)));
                resolve(`data:application/gzip;base64,${compressedBase64}`);
            } catch (error) {
                reject('Error compressing file.');
            }
        };

        reader.onerror = () => reject('Error reading file.');
        reader.readAsArrayBuffer(file);
    });
}





