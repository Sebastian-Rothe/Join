/**
 * Adds an event listener to the document that waits for the DOM to fully load.
 * Once loaded, it checks for an element with the class 'backIcon' and adds a click event listener to it.
 * This event listener triggers a navigation back to the previous page when the icon is clicked.
 */
document.addEventListener("DOMContentLoaded", function () {
  const backIcon = document.querySelector(".backIcon");
  if (backIcon) {
    backIcon.addEventListener("click", function () {
      window.history.back();
    });
  }
});
