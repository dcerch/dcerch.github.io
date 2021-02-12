//Declare global database variables (note: this JS file must be declared first before any of the subsequent JS files)
const database = firebase.database();
const planRef = database.ref();

//Enable tooltip CSS
$(function () {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'manual',
    html: true,
    title: 'Copied! <i style="font-size: 12px;" class="material-icons">favorite_border</i>',
    placement: 'top'
  });
});

//Show tooltip then hide
$('[data-toggle="tooltip"]').click(function() {
  var clickedTooltip = $(this);
  $(clickedTooltip).tooltip("show");
  setTimeout(function(){
    $(clickedTooltip).tooltip("hide");
  }, 1500);
});

//Instantiate ClipboardJS
new ClipboardJS(document.querySelectorAll('[data-clipboard-target]'));
