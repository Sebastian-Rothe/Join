function addAlphabetHeader(contactDisplay, sortAlphabet) {
    contactDisplay.innerHTML += `
    <li class="letter-heading">
      <span>${sortAlphabet}</span>
    </li>
    <li class="contact-separator"></li>`;
}

function getContactDetailHTML(user){
    return`
      <div class="contact-card">
        <div>
          <div class="avatar-contact-details-section row">
            <div class="avatar" style="background-color:${assignRandomColors()}">${getInitials(user.name)}</div>
            <div class="name-actions-section-contact">
              <span>${user.name}</span>
              <div class="contact-actions">
                <div class="contact-actions-edit"><a href="#" onclick="editContact('${user.id}')"><img src="./assets/img/edit.svg" alt="Edit">Edit</a></div>
                <div class="contact-actions-delete"><a href="#" onclick="deleteContact('${user.id}')"><img src="./assets/img/delete.svg" alt="Delete">Delete</a></div>
              </div>
            </div>
          </div>
          <div class="contact-info">
            <div class="info">contact information</div>
            <p><strong>Email</strong></p>
            <p><a href="mailto:${user.email}">${user.email}</a></p>
            <p><strong>Phone</strong></p>
            <p>${user.phone}</p>
          </div>
        </div>
      </div>`;
}
  
function getContactCardHTML(user, isNew) {
    return `
    <li id="contact-item-${user.email}" class="single-contact contact-hover-effect ${isNew ? 'new-contact' : ''}" onclick='showContactDetails(${JSON.stringify(user)})' style="cursor: pointer;">
      <div class="avatar-placeholder" style="background-color: ${assignRandomColors()};">
        <span class="avatar-overlay">
        ${getInitials(user.name)}
        </span>
      </div>
      <div class="contact-details">
        <span>${user.name}</span>
      <address class="contact-email ellipsis-text">${user.email}</address>
      </div>
    </li>`;
}
