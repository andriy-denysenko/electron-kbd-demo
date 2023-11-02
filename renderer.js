// Code to handle keyboard shortcuts in browser window
function handleKeyPress(event) {
  document.getElementById("log").innerText = event.key;
  console.log(`You pressed ${event.key}`);
}

window.addEventListener("keyup", handleKeyPress, true);
// ---------------------------------------------------------------
