function displayAlignment(e) {
  let wallWidth = Math.floor(document.getElementById('wallWidth').value);
  let artWidth = Math.floor(document.getElementById('artWidth').value);
  let artCount = Math.floor(document.getElementById('artCount').value);

  //If any values are blank, assign 1 as default
  if(wallWidth == '') { wallWidth = 1; }
  if(artWidth == '') { artWidth = 1; }
  if(artCount == '') { artCount = 1; }

  let artSpacing = (wallWidth-(artWidth*artCount))/(artCount+1);

  let alignmentViewHTML = '';

  //Build start of table and first header row
  alignmentViewHTML = `<table style="table-layout: fixed" class="table table-bordered border-dark table-sm"><tr class="table-secondary text-center"><th class="py-2" scope="col" colspan="${wallWidth}">This will show you where to hang the art evenly (assuming center hanging as well) with a ruler for reference</th></tr>`;

  //Add ruler row
  alignmentViewHTML += `<tr class="text-right">`;
  for (let i = 1; i <= wallWidth; i++) {
    alignmentViewHTML += `<td class="py-2">${i}</td>`;
  }
  alignmentViewHTML += `</tr>`;

  //Add art row
  alignmentViewHTML += `<tr class="text-center">`;
  for (let i = 1; i <= artCount; i++) {
    alignmentViewHTML += `<td class="py-5" colspan="${Math.round(artSpacing)}"></td><td class="py-5 bg-dark text-light" colspan="${artWidth}">Art #${i}</td>`;
  }
  alignmentViewHTML += `</tr>`;

  //Close the table
  alignmentViewHTML += `</table>`;

  //Overwrite the table
  document.getElementById('alignmentView').innerHTML = alignmentViewHTML;
  document.getElementById('artSpacing').value = `~` + artSpacing;

  //Testing values
  console.log(`
    wallWidth=${wallWidth}
    artWidth=${artWidth}
    artCount=${artCount}
    artSpacing=${artSpacing}
  `);
}

//Listen for when the inputs change
document.getElementById('wallWidth').addEventListener("change", displayAlignment);
document.getElementById('artWidth').addEventListener("change", displayAlignment);
document.getElementById('artCount').addEventListener("change", displayAlignment);
