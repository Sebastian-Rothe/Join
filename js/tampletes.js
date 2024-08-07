function getContactCardHTML(user, isNew) {
  return `
    <div class="contact-card${isNew ? ' new' : ''}">
      <p>${user.name}</p>
      <p>${user.email}</p>
    </div>`;
}

function addAlphabetHeader(contactDisplay, sortAlphabet) {
    contactDisplay.innerHTML += `
      <div class="alphabet-contact-list">
        <span>${sortAlphabet}</span>                        
      </div>
      <div class="line-contact-list"></div>`;
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
      <div id="contact-details-section-${user.email}" class="contact-details-section row ${isNew ? 'new-contact' : ''}" onclick='showContactDetails(${JSON.stringify(user)})'>
          <div class="contact-details-profile mt-3 mb-3" style="background-color:${assignRandomColors()}">
              ${getInitials(user.name)}
          </div>
          <div class="contact-details flex-column">
              <span class="contact-details-name mt-3">${user.name}</span>
              <span class="contact-details-email">${user.email}</span>
          </div>
      </div>`;
}
