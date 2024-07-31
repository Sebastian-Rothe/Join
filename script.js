const CONTACTS_URL =
  "https://joincontacts-e7692-default-rtdb.europe-west1.firebasedatabase.app/";

async function getContacts(path = "") {
  let response = await fetch(CONTACTS_URL + path + ".json");
  let responseAsJson = await response.json();
  console.log(responseAsJson);
}

async function postContact(path = "", data = {}) {
  let response = await fetch(CONTACTS_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseAsJson = await response.json());
}

getContacts("contacts");
postContact("contacts/contact5", {
  name: "Erika Mustermann",
  email: "erika.mustermann@example.com",
  tele: "0987654321",
  password: "geheim123",
});
