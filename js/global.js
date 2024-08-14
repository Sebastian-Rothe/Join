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

function getInitials(fullName) {
    let nameParts = fullName.split(" ");
    let firstLetters = nameParts.map((part) => part.charAt(0));
    let initials = firstLetters.join("");
    assignRandomColors();
    return initials;
  }
  
  function assignRandomColors() {
    return profileColors[Math.floor(Math.random() * profileColors.length-1)]
  }