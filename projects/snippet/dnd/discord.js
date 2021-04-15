var buttons = document.getElementsByTagName("button");
const hook_gameplay = "https://discord.com/api/webhooks/830975152380313641/4K70lQGeWgLDmpJm2KtwGsDTeXL-Nmpe0uy0-isr_jeDkktFpBCQnMJ5hLix9gPrhUDX";
const hook_characters = "https://discord.com/api/webhooks/832047424373522473/-m47UpfQm9Rgwxaf8AadOApUAo-kqUcZ2otqBYgA95Tbbz1gNfWeBI6b6xhfawzoJD0x";
const hook_reminders = "https://discord.com/api/webhooks/832056599572906004/s08D4U4tnIWb7MjrPOszx3ieMfYcCrspRB7r51O7lHUBfbGOL5XTJnlo9aPZUQnfNVDb";

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", verifyInfo, false);
}

function verifyInfo(ev) {
  var hook_assignment = "";
  switch(ev.target.id) {
    case "characters":
    case "dice":
    case "systems":
    case "classes":
      postInfo(hook_gameplay, window[ev.target.id]);
      break;
    case "reminderzero":
    case "reminderone":
    case "remindertwo":
      postInfo(hook_reminders, window[ev.target.id]);
      break;
    case "augustin":
      postInfo(hook_characters, window[ev.target.id]);
      break;
  }
}

function postInfo(hook, content) {
  var request = new XMLHttpRequest();
  request.open("POST", hook);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(content));
}
