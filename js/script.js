/**
 * Loads HTML content from external files into elements that have the 'w3-include-html' attribute.
 * Fetches the content asynchronously and inserts it into the element's innerHTML.
 * If the content cannot be loaded, displays a 'Page not found' message.
 * After including the content, it initializes the profile icon.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html");
      let resp = await fetch(file);
      if (resp.ok) {
          element.innerHTML = await resp.text();
      } else {
          element.innerHTML = 'Page not found';
      }
      initialProfileIcon();
  }
}

/**
 * Toggles the visibility of the dropdown menu.
 * If the dropdown menu is hidden or not displayed, it sets the display to 'flex'.
 * If the dropdown menu is visible, it hides it.
 */
 function openDropdownMenu(){
    let dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
        dropdownMenu.style.display = 'flex'; 
    } else {
        dropdownMenu.style.display = 'none'; 
    }
}

/**
 * Adds an event listener to the document that closes the dropdown menu when clicking outside of it.
 * If the user clicks outside of the profile avatar or the dropdown menu, the menu will be hidden.
 */
document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const profileAvatar = document.getElementById('profile-avatar');

    if (!profileAvatar.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none'; // Hide dropdown if clicking outside
    }
});

/**
 * Logs out the user by clearing localStorage and redirecting to the login page.
 * Clears all data stored in localStorage and navigates the user to 'login.html'.
 */
function logoutUser() {
    localStorage.clear();
    window.location.replace("login.html");
  }
 