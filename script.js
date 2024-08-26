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
// //////////////////////////////////////////////////
 function openDropdownMenu(){
    let dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
        dropdownMenu.style.display = 'flex'; 
    } else {
        dropdownMenu.style.display = 'none'; 
    }
}
// Add an event listener to the document to close the dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const profileAvatar = document.getElementById('profile-avatar');

    if (!profileAvatar.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none'; // Hide dropdown if clicking outside
    }
});

// //////////////////////////////////////////////////////////////////////log uot
function logoutUser() {
    localStorage.clear();
    window.location.replace("login.html");
  }
 