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
    let initials;
    if(nameParts.length==1)
      initials = nameParts[0].substring(0, 2).toUpperCase();
    else{
      let firstLetters = nameParts.map((part) => part.charAt(0));
      initials = firstLetters.join("");
    }
    assignRandomColors();
    return initials;
  }
  
  function assignRandomColors() {
    return profileColors[Math.floor(Math.random() * profileColors.length)]
  }

  function createProfileIcon(fullName) {
    let initials = getInitials(fullName);
    let color = assignRandomColors();

    return `
        <div style="
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


function initialProfileIcon(){
  console.log(localStorage.getItem("loggedInUserName"));
  let userName = localStorage.getItem("loggedInUserName");
  let initName = getInitials(userName);
  let initNameElement = document.getElementById("init-name");
  if(initNameElement)
      initNameElement.innerHTML = initName?initName:"";
}
