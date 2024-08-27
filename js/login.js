/**
 * Hides the login section and the header login content.
 */
function hideLoginSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('header-login-content').style.display = 'none';
}

/**
 * Displays the sign-up section by setting its display style to 'flex'.
 */
function showSignUpSection() {
    document.getElementById('signupSection').style.display = 'flex';
}

/**
 * Opens the sign-up page by hiding the login section and showing the sign-up section.
 */
function openSignUpPage() {
    hideLoginSection();
    showSignUpSection();
}


/**
 * Displays the login section and the header login content.
 */
function showLoginSection() {
    document.getElementById('header-login-content').style.display = 'flex';
    document.getElementById('loginSection').style.display = 'flex';
}

/**
 * Hides the sign-up section by setting its display style to 'none'.
 */
function hideSignUpSection() {
    document.getElementById('signupSection').style.display = 'none';
}

/**
 * Returns to the login page by hiding the sign-up section and showing the login section.
 */
function backToLoginPage() {
    hideSignUpSection();
    showLoginSection();
}


/**
 * Retrieves the form data from the sign-up form fields and returns it as an object.
 * @returns {Object} - The sign-up form data including username, email, password, confirmPassword, policyCheckbox, and policyError elements.
 */
function getSignUpFormData() {
    return {
        username: document.getElementById("username-signup").value.trim(),
        email: document.getElementById("email-signup").value.trim(),
        password: document.getElementById("password-signup").value.trim(),
        confirmPassword: document.getElementById("confirm-password-signup").value.trim(),
        policyCheckbox: document.getElementById("policy-checkbox"),
        policyError: document.getElementById("policy-error")
    };
}

/**
 * Validates if the privacy policy checkbox is checked. If not, displays an error message.
 * @param {HTMLElement} policyCheckbox - The checkbox element for the privacy policy.
 * @param {HTMLElement} policyError - The element where the error message will be displayed.
 * @returns {boolean} - Returns true if the checkbox is checked, otherwise false.
 */
function validatePolicyCheckbox(policyCheckbox, policyError) {
    if (!policyCheckbox.checked) {
        policyError.textContent = "You must accept the Privacy policy to sign up.";
        policyError.style.display = "inline";
        return false;
    }
    return true;
}

/**
 * Clears the sign-up form fields and resets the privacy policy checkbox and error message display.
 * @param {HTMLElement} policyCheckbox - The checkbox element for the privacy policy.
 * @param {HTMLElement} policyError - The element where the error message is displayed.
 */
function clearSignUpForm(policyCheckbox, policyError) {
    document.getElementById("username-signup").value = "";
    document.getElementById("email-signup").value = "";
    document.getElementById("password-signup").value = "";
    document.getElementById("confirm-password-signup").value = "";
    
    policyCheckbox.checked = false;
    policyError.style.display = "none";
}

/**
 * Handles the sign-up process including form validation, user creation, and showing a success popup.
 */
async function SignUp() {
    if (!formvalidationSignUp()) {       
        return;
    }

    const formData = getSignUpFormData();
    formData.policyError.style.display = "none";

    if (!validatePolicyCheckbox(formData.policyCheckbox, formData.policyError)) {
        return;
    }

    const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password
    };

    await postContact("/users", newUser);

    document.getElementById("success-popup").style.display = "flex";

    setTimeout(() => {
        document.getElementById("success-popup").style.display = "none";
        backToLoginPage();
    }, 2000);

    clearSignUpForm(formData.policyCheckbox, formData.policyError);
}


/**
 * Clears the email error message by toggling its display class.
 */
function clearEmailError() {
    document.querySelector(".error-validation-email").classList.add('toggle-display');
}

/**
 * Clears the password error message by toggling its display class.
 */
function clearPasswordError() {
    document.querySelector(".error-validation-password").classList.add('toggle-display');
}

/**
 * Clears error messages for the email or password fields based on the event target.
 * @param {Event} event - The event object representing the user interaction.
 */
function clearErrorMessages(event) {
    if (event.target.id === "username") {
        clearEmailError();
    }
    if (event.target.id === "password") {
        clearPasswordError();
    }
}


/**
 * Retrieves the form data from the login form fields and returns it as an object.
 * @returns {Object} - The login form data including email and password.
 */
function getLoginFormData() {
    return {
        email: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };
}

/**
 * Handles the display of login errors by showing the appropriate error message.
 * @param {string} type - The type of error (e.g., 'email' or 'password').
 * @param {string} message - The error message to display.
 */
function handleLoginError(type, message) {
    const errorDiv = document.querySelector(`.error-validation-${type}`);
    errorDiv.textContent = message;
    errorDiv.classList.remove('toggle-display');
}

/**
 * Validates the user credentials by checking the email and password against the user data.
 * @param {Object} users - The object containing all registered users.
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 * @returns {Object} - An object containing a boolean indicating if the user was found and the username if found.
 */
function validateUser(users, email, password) {
    let userFound = false;
    let userName = "";

    for (let key in users) {
        if (users[key].email === email) {
            if (users[key].password === password) {
                userFound = true;
                userName = users[key].username;
                break;
            } else {
                handleLoginError("password", "Incorrect password.");
                return { userFound, userName };
            }
        }
    }

    if (!userFound) {
        handleLoginError("email", "Email not found.");
    }

    return { userFound, userName };
}

/**
 * Handles the login process, including form validation, user verification, and redirection upon success.
 */
async function loginUser() {
    if (!formvalidationLogIn()) {
        return;
    }

    const formData = getLoginFormData();

    try {
        const userResponse = await fetch(BASE_URL + "/users.json");
        const users = await userResponse.json();

        const { userFound, userName } = validateUser(users, formData.email, formData.password);

        if (userFound) {
            localStorage.setItem("loggedInUserName", userName);
            window.location.replace("summary.html");
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

/**
 * Logs in the user as a guest and redirects to the summary page.
 */
function loginGuest(){
    localStorage.setItem("loggedInUserName", "Guest");
    window.location.replace("summary.html");
}


/**
 * Validates the login email field. Checks if it is empty and displays an error message if so.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateLoginEmail() {
    let emailInput = document.getElementById("username");
    let errorDivEmail = document.querySelector(".error-validation-email");
    let isValid = true;

    if (emailInput.value.trim() === "") {
        emailInput.classList.add('invalid');
        errorDivEmail.classList.remove('toggle-display');
        isValid = false;
    } else {
        emailInput.classList.remove('invalid');
        errorDivEmail.classList.add('toggle-display');
    }

    return isValid;
}

/**
 * Validates the login password field. Checks if it is empty and displays an error message if so.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
function validateLoginPassword() {
    let passwordInput = document.getElementById("password");
    let errorDivPassword = document.querySelector(".error-validation-password");
    let isValid = true;

    if (passwordInput.value.trim() === "") {
        passwordInput.classList.add('invalid');
        errorDivPassword.classList.remove('toggle-display');
        isValid = false;
    } else {
        passwordInput.classList.remove('invalid');
        errorDivPassword.classList.add('toggle-display');
    }

    return isValid;
}

/**
 * Validates the login form by checking the email and password fields.
 * @returns {boolean} - Returns true if both fields are valid, otherwise false.
 */
function formvalidationLogIn() {
    let isEmailValid = validateLoginEmail();
    let isPasswordValid = validateLoginPassword();

    return isEmailValid && isPasswordValid;
}

// Helper Functions 
// These functions will be used to perform common tasks like checking if a field is empty or showing/hiding error messages.
function isFieldEmpty(field) {
    return field.value.trim() === "";
}

/**
 * Displays an error message for a form field.
 * @param {HTMLElement} field - The form field element where the error occurred.
 * @param {HTMLElement} errorDiv - The element where the error message will be displayed.
 * @param {string} [message="This field is required"] - The error message to display (optional).
 */
function showError(field, errorDiv, message = "This field is required") {
    field.classList.add('invalid');
    errorDiv.textContent = message;
    errorDiv.classList.remove('toggle-display');
}

/**
 * Hides an error message for a form field.
 * @param {HTMLElement} field - The form field element where the error occurred.
 * @param {HTMLElement} errorDiv - The element where the error message is displayed.
 */
function hideError(field, errorDiv) {
    field.classList.remove('invalid');
    errorDiv.classList.add('toggle-display');
}

/**
 * Validates an email address format using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email address is valid, otherwise false.
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Checks if the provided password and confirm password fields match.
 * @param {HTMLElement} password - The password field element.
 * @param {HTMLElement} confirmPassword - The confirm password field element.
 * @returns {boolean} - Returns true if the passwords match, otherwise false.
 */
function doPasswordsMatch(password, confirmPassword) {
    return password.value.trim() === confirmPassword.value.trim();
}


/**
 * Validates the sign-up username field by checking if it is empty.
 * @returns {boolean} - Returns true if the username is valid, otherwise false.
 */
function validateSignUpUsername() {
    let usernameSignup = document.getElementById("username-signup");
    let errorDivUsername = document.querySelector(".error-username");

    if (isFieldEmpty(usernameSignup)) {
        showError(usernameSignup, errorDivUsername);
        return false;
    } else {
        hideError(usernameSignup, errorDivUsername);
        return true;
    }
}

/**
 * Validates the sign-up email field by checking if it is empty and if it has a valid email format.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateSignUpEmail() {
    let emailSignup = document.getElementById("email-signup");
    let errorDivEmail = document.querySelector(".error-email");

    if (isFieldEmpty(emailSignup)) {
        showError(emailSignup, errorDivEmail);
        return false;
    } else if (!isValidEmail(emailSignup.value.trim())) {
        showError(emailSignup, errorDivEmail, "Please enter a valid email address.");
        return false;
    } else {
        hideError(emailSignup, errorDivEmail);
        return true;
    }
}

/**
 * Validates the sign-up password fields by checking if they are empty and if they match.
 * @returns {boolean} - Returns true if the passwords are valid, otherwise false.
 */
function validateSignUpPassword() {
    let passwordSignup = document.getElementById("password-signup");
    let confirmPasswordSignup = document.getElementById("confirm-password-signup");
    let errorDivPassword = document.querySelector(".error-Password");
    let errorDivConfirmPassword = document.querySelector(".error-confirm-password");

    let isValid = true;

    if (isFieldEmpty(passwordSignup)) {
        showError(passwordSignup, errorDivPassword);
        isValid = false;
    } else {
        hideError(passwordSignup, errorDivPassword);
    }

    if (isFieldEmpty(confirmPasswordSignup)) {
        showError(confirmPasswordSignup, errorDivConfirmPassword);
        isValid = false;
    } else if (!doPasswordsMatch(passwordSignup, confirmPasswordSignup)) {
        showError(confirmPasswordSignup, errorDivConfirmPassword, "Passwords do not match");
        isValid = false;
    } else {
        hideError(confirmPasswordSignup, errorDivConfirmPassword);
    }

    return isValid;
}

/**
 * Validates the entire sign-up form by checking the username, email, and password fields.
 * @returns {boolean} - Returns true if all fields are valid, otherwise false.
 */
function formvalidationSignUp() {
    let isUsernameValid = validateSignUpUsername();
    let isEmailValid = validateSignUpEmail();
    let isPasswordValid = validateSignUpPassword();

    return isUsernameValid && isEmailValid && isPasswordValid;
}