/* List of Audio File URLs + CORS Reverse Proxy */
const audioFiles = [
  'https://drive.google.com/uc?export=download&id=1soeYbn3tU2dm6LpUD01Yy6o-4gR6K8cQ',
  'https://drive.google.com/uc?export=download&id=1oHi4gZDkl2LjcMwEkjBWrpb8OLcdJG1x',
  'https://drive.google.com/uc?export=download&id=1RKEUOgcFX5CIbGrTRshDK_j2UZdxz6yC',
  'https://drive.google.com/uc?export=download&id=1n3f0gILnIjI5aU8vWRoSkcOjmt_Nhml6',
  'https://drive.google.com/uc?export=download&id=11Uuq5GydIiUeODsWb4NtjJ8g1UiKIrJI',
  'https://drive.google.com/uc?export=download&id=1ibkfCm4uFnfK3Qwzr5gvWX1G-6Kisebb',
  'https://drive.google.com/uc?export=download&id=1uP68X1M3o6I3B4l1nCa6PXaNhOe_SW8K',
  'https://drive.google.com/uc?export=download&id=1Xbn3dZd4FqtC27Cm0WsqpZrp9YfXF273',
];
const corsBypass = 'https://cors-anywhere.herokuapp.com/';

/* List of metadata variables */
var title = '';
var artist = '';
var album = '';
var year = '';
var comments = '';

/* Loop through each audio file */
$(audioFiles).each(function(key, url) {
  generateAudioCard(url);
});

/* Creates a Bootstrap card for each audio file */
function generateAudioCard(url) {
  jsmediatags.read(corsBypass + url, {
    onSuccess: function(tag) {
      var metadata = tag.tags;
      title = metadata.title;
      artist = metadata.artist;
      album = metadata.album;
      year = metadata.year;
      comment = metadata.comment.text;

      $("#audioMetadata").append(
        '<div class="card text-white bg-secondary mb-3" style="width: 23rem;">' +
          '<div class="card-body">' +
            '<h5 class="card-title">' + title + '</h5>' +
            '<p class="card-text">' + comment + '</p>' +
          '</div>' +
          '<ul class="list-group list-group-flush text-body">' +
            '<li class="list-group-item"><b>Artist:</b> ' + artist + '</li>' +
            '<li class="list-group-item"><b>Album:</b> ' + album + '</li>' +
            '<li class="list-group-item"><b>Year:</b> ' + year + '</li>' +
          '</ul>' +
          '<div class="card-footer text-center">' +
            '<audio controls>' +
              '<source src="' + url + '" type="audio/mpeg">' +
              'Your browser does not support the audio tag.' +
            '</audio>' +
          '</div>' +
        '</div>'
      );
    },
    onError: function(error) {
      console.log(error);
    }
  });
}
