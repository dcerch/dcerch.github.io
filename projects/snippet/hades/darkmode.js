function toggleDarkmode() {
  var element = document.getElementById("boontable");

  if (element.classList) {
    element.classList.toggle("table-dark");
  } else {
    var classes = element.className.split(" ");
    var i = classes.indexOf("table-dark");

    if (i >= 0)
      classes.splice(i, 1);
    else
      classes.push("table-dark");
      element.className = classes.join(" ");
  }
}
