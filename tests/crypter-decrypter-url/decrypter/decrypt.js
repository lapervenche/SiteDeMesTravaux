/**
 * Created by Jacob Strieb
 * May 2020
 */



/*******************************************************************************
 * Helper Functions
 ******************************************************************************/

// Highlight the text in an input with a given id
function highlight(id) {
  let output = document.querySelector("#" + id);
  output.focus();
  output.select()
  output.setSelectionRange(0, output.value.length + 1);
  return output;
}


// Display a message in the "alert" area
function error(text) {
  const alertText = document.querySelector(".alert");
  alertText.innerText = text;
  alertText.style.opacity = 1;
}



/*******************************************************************************
 * Main UI Functions
 ******************************************************************************/

async function onDecrypt() {
  // Fail if the b64 library or API was not loaded
  if (!("b64" in window && "apiVersions" in window)) {
    error("Bibliothèques importantes non chargées!");
    return;
  }

  // Try to get page data from the URL if possible
  const urlText = document.querySelector("#encrypted-url").value;
  let url;
  try {
    url = new URL(urlText);
  } catch {
    error("Le texte saisi n'est pas une URL valide. Assurez-vous qu'il inclut également \"https://\" !");
    return;
  }

  let params;
  try {
    params = JSON.parse(b64.decode(url.hash.slice(1)));
  } catch {
    error("Le lien semble corrompu.");
    return;
  }

  // Check that all required parameters encoded in the URL are present
  if (!("v" in params && "e" in params)) {
    error("Le lien semble corrompu.L'URL codée manque de paramètres nécessaires.");
    return;
  }

  // Check that the version in the parameters is valid
  if (!(params["v"] in apiVersions)) {
    error("Version API non prise en charge.Le lien peut être corrompu.");
    return;
  }

  const api = apiVersions[params["v"]];

  // Get values for decryption
  const encrypted = b64.base64ToBinary(params["e"]);
  const salt = "s" in params ? b64.base64ToBinary(params["s"]) : null;
  const iv = "i" in params ? b64.base64ToBinary(params["i"]) : null;

  const password = document.querySelector("#password").value;

  // Decrypt if possible
  let decrypted;
  try {
    decrypted = await api.decrypt(encrypted, password, salt, iv);
  } catch {
    error("Mot de passe incorrect!");
    return;
  }

  // Print the decrypted link to the output area
  document.querySelector("#output").value = decrypted;
  error("Url Décryptée !");

  // Update the "Open in New Tab" button to link to the correct place
  document.querySelector("#open").href = decrypted;
}


// Activated when the "Copy" button is pressed
function onCopy(id) {
  // Select and copy
  const output = highlight(id);
  document.execCommand("copy");

  // Alert the user that the text was successfully copied
  const alertArea = document.querySelector("#copy-alert");
  alertArea.innerText = `Copied ${output.value.length} characters`;
  alertArea.style.opacity = "1";
  setTimeout(() => { alertArea.style.opacity = 0; }, 3000);

  // Deselect
  output.selectionEnd = output.selectionStart;
  output.blur();
}

function main() {
  if (window.location.hash) {
    document.querySelector("#encrypted-url").value =
      `https://lapervenche.github.io/link-lock/${window.location.hash}`;
  }
}
