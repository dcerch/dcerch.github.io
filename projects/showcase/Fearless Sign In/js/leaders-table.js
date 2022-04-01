var db = firebase.firestore();
var usersRef = db.collection('users');

/*
BUILD LEADERS TABLE
*/
var tabledata = [];
var table;

//Get all users and pushed to indexed array
usersRef.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    tabledata.push(doc.data());
  });
  buildTable();
});

$('#export').click(function() {
  table.download('csv', 'fearless_export.csv');
});

function buildTable() {
  table = new Tabulator('#userstable', {
   	data: tabledata,
    layout: 'fitDataFill',
    responsiveLayout: 'collapse',
    responsiveLayoutCollapseStartOpen: false,
   	columns: [
      { formatter: 'responsiveCollapse', minWidth: 30, align: 'center', resizable: false, headerSort: false },
  	 	{ title: 'First Name', field: 'userfirst' },
      { title: 'Last Name', field: 'userlast' },
      { title: 'Phone', field: 'phone' },
      { title: 'Birthday', field: 'birthday', sorter: 'date' },
      { title: 'Grade', field: 'grade' },
      { title: 'Parent First Name', field: 'parentfirst' },
      { title: 'Parent Last Name', field: 'parentlast' },
      { title: 'Parent Email', field: 'parentemail' },
      { title: 'Parent Phone', field: 'parentphone' },
      { title: 'Streak', field: 'streak' },
      { title: 'Last Sign In', field: 'lastsignin' },
      { title: 'Is Leader?', field: 'leader', formatter: 'tickCross' },
   	],
    initialSort: [
      { column: 'leader', dir: 'asc' },
      { column: 'userlast', dir: 'asc' },
    ],
  });
}
