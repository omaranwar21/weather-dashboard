// Select the toggle button
const toggleButton = document.getElementById("toggle-dark-mode");
const toggleIcon = document.getElementsByClassName("toggle-icon");

// Function to toggle between dark and light themes
toggleButton.addEventListener("click", () => {
  const htmlElement = document.documentElement; // Access <html> element
  const currentTheme = htmlElement.dataset.theme; // Get current theme

  // Toggle theme and save preference to localStorage
  if (currentTheme === "dark") {
    htmlElement.dataset.theme = "light";
    localStorage.setItem("theme", "light");
    toggleIcon[1].classList.add("d-none");
    toggleIcon[0].classList.remove("d-none");
  } else {
    htmlElement.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
    toggleIcon[0].classList.add("d-none");
    toggleIcon[1].classList.remove("d-none");
  }
});

// Initialize theme from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    savedTheme === "dark"
      ? toggleIcon[1].classList.remove("d-none")
      : toggleIcon[0].classList.remove("d-none");
  } else {
    localStorage.setItem("theme", "light");
    toggleIcon[0].classList.remove("d-none")
    toggleIcon[1].classList.remove("d-none");
    document.documentElement.dataset.theme = "light"; // Default theme
  }
});
