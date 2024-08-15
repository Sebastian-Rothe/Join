document.addEventListener("DOMContentLoaded", function () {
  const backIcon = document.querySelector(".backIcon");
  if (backIcon) {
    backIcon.addEventListener("click", function () {
      window.history.back();
    });
  }
});
