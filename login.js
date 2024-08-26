// openSignUpPage
function hideLoginSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('header-login-content').style.display = 'none';
}


function showSignUpSection() {
    document.getElementById('signupSection').style.display = 'flex';
}


function openSignUpPage() {
    hideLoginSection();
    showSignUpSection();
}


// backToLoginPage
function showLoginSection() {
    document.getElementById('header-login-content').style.display = 'flex';
    document.getElementById('loginSection').style.display = 'flex';
}


function hideSignUpSection() {
    document.getElementById('signupSection').style.display = 'none';
}


function backToLoginPage() {
    hideSignUpSection();
    showLoginSection();
}


// SignUp
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


function validatePolicyCheckbox(policyCheckbox, policyError) {
    if (!policyCheckbox.checked) {
        policyError.textContent = "You must accept the Privacy policy to sign up.";
        policyError.style.display = "inline";
        return false;
    }
    return true;
}


function clearSignUpForm(policyCheckbox, policyError) {
    document.getElementById("username-signup").value = "";
    document.getElementById("email-signup").value = "";
    document.getElementById("password-signup").value = "";
    document.getElementById("confirm-password-signup").value = "";
    
    policyCheckbox.checked = false;
    policyError.style.display = "none";
}


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


// clearErrorMessages
function clearEmailError() {
    document.querySelector(".error-validation-email").classList.add('toggle-display');
}

function clearPasswordError() {
    document.querySelector(".error-validation-password").classList.add('toggle-display');
}

function clearErrorMessages(event) {
    if (event.target.id === "username") {
        clearEmailError();
    }
    if (event.target.id === "password") {
        clearPasswordError();
    }
}


// loginUser
function getLoginFormData() {
    return {
        email: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };
}


function handleLoginError(type, message) {
    const errorDiv = document.querySelector(`.error-validation-${type}`);
    errorDiv.textContent = message;
    errorDiv.classList.remove('toggle-display');
}


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


// formvalidationLogIn
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

function showError(field, errorDiv, message = "This field is required") {
    field.classList.add('invalid');
    errorDiv.textContent = message;
    errorDiv.classList.remove('toggle-display');
}

function hideError(field, errorDiv) {
    field.classList.remove('invalid');
    errorDiv.classList.add('toggle-display');
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function doPasswordsMatch(password, confirmPassword) {
    return password.value.trim() === confirmPassword.value.trim();
}


// Validation Functions
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


// validateSignUpEmail
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


// validateSignUpPassword
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


// formvalidationSignUp
function formvalidationSignUp() {
    let isUsernameValid = validateSignUpUsername();
    let isEmailValid = validateSignUpEmail();
    let isPasswordValid = validateSignUpPassword();

    return isUsernameValid && isEmailValid && isPasswordValid;
}