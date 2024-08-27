/**
 * Attaches an event listener to the DOMContentLoaded event, which ensures the DOM is fully loaded before running the code.
 * It then adds a click event listener to the element with the class 'backIcon', which triggers a navigation back to the previous page.
 */
document.addEventListener("DOMContentLoaded", function () {
  const backIcon = document.querySelector(".backIcon");
  if (backIcon) {
    backIcon.addEventListener("click", function () {
      window.history.back();
    });
  }
});
