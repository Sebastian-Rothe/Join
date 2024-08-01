// script.js
document.getElementById("openPopup").addEventListener("click", function () {
  document.getElementById("popup").classList.add("show");
  document.getElementById("overlay").classList.add("show");
  document.getElementById("overlay").classList.remove("hidden");
});

document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("popup").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
  }, 300); // Match this to the transition duration
});

document.getElementById("cancel").addEventListener("click", function () {
  document.getElementById("popup").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
  }, 300); // Match this to the transition duration
});

document.getElementById("overlay").addEventListener("click", function () {
  document.getElementById("popup").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
  }, 300); // Match this to the transition duration
});
