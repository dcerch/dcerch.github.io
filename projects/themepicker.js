var selectedtheme = localStorage.getItem("dtheme");
const themelist = {
  dark: ["light", "dark", "🌙"],
  light: ["dark", "light", "☀️"]
};

//If a theme hasn't been assigned yet
if (selectedtheme !== null) {
  setTheme(themelist[selectedtheme][1], themelist[selectedtheme][2]);
}
else {
  localStorage.setItem("dtheme", "light");
  setTheme(themelist[selectedtheme][1], themelist[selectedtheme][2]);
}

//If theme picker icon is clicked
document.getElementById("themepicker").addEventListener("click", function(){
  selectedtheme = localStorage.getItem("dtheme"); //set theme in local storage again in case user toggles more than 1 time without refreshing
  var nexttheme = themelist[selectedtheme][0]; //look at the first spot in the array to find the name of the next theme
  setTheme(themelist[nexttheme][1], themelist[nexttheme][2]); //pass second and third array positions for setting theme
  localStorage.setItem("dtheme", nexttheme); //store new theme in local storage
});

function setTheme(color, icon) {
  document.body.className = color; //change background color
  var items = document.getElementsByClassName("list-group-item"); //grab all list group items
  for (var i=0; i < items.length; i++) {
    items[i].className = "list-group-item list-group-item-action list-group-item-" + color; //change all list group item colors
  }
  //Icon
  document.getElementById("themepicker").innerHTML = icon; //change icon to newly set theme
}
