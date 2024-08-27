let profileColors = [
    '#FF5733', // Rot
    '#33FF57', // Grün
    '#3357FF', // Blau
    '#FF33A6', // Pink
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#8A2BE2', // Blauviolett
    '#7FFFD4', // Aquamarin
    '#FF4500', // Orangerot
    '#3E6020'  // Dunkelolivgrün
  ];

  /**
 * Retrieves the initials from a full name. If the name consists of one word, the first two letters are used.
 * If the name consists of multiple words, the initials of the first letters of each word are used.
 * @param {string} fullName - The full name of the user.
 * @returns {string} - The initials derived from the full name.
 */
function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') {
      return "";
  }
  let nameParts = fullName.trim().split(" ");
  let initials;

  if (nameParts.length === 1) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
  } else {
      let firstLetters = nameParts.map((part) => part.charAt(0).toUpperCase());
      initials = firstLetters.join("");
  }
  assignRandomColors();
  return initials;
}

/**
 * Assigns a random color from the `profileColors` array.
 * @returns {string} - A random color code.
 */
  function assignRandomColors() {
    return profileColors[Math.floor(Math.random() * profileColors.length)]
  }

/**
 * Creates a profile icon with the user's initials and assigns a random background color.
 * @param {string} fullName - The full name of the user.
 * @returns {string} - The HTML string for the profile icon.
 */
  function createProfileIcon(fullName) {
    let initials = getInitials(fullName);
    let color = assignRandomColors();

    return `
        <div class="badge" 
            data-contact="${fullName}" 
            style="
            background-color: ${color};
            color: #ffffff;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 8px;
        ">
            ${initials}
        </div>
    `;
}

/**
 * Initializes the profile icon with the user's initials from local storage.
 * Updates the HTML element with the ID 'init-name' with the initials.
 */
function initialProfileIcon(){  
  let userName = localStorage.getItem("loggedInUserName");
  let initName = getInitials(userName);
  let initNameElement = document.getElementById("init-name");
  if(initNameElement)
      initNameElement.innerHTML = initName?initName:"";
}


/**
 * Navigates the browser to the previous page in the history.
 */
function BackToPreviousPage() {
  window.history.back();
}