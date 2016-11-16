
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyEBVQDL09ru6huz'
});

var base = Airtable.base('apprnzHcKjenpB8sM');

function initApp() {
    console.clear();
    showPages();
    loadPhotos();
    getVotes();
}



function loadPhotos() {

  base('Fotos').select({
      view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {

      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
        var url = record.get('Foto')["0"].url;
        var id = record.get('ID');
        $("#gallery").append(
          ' <div class="col-sm-3"><div class="card">'
          + '<a href="#" data-toggle="modal" data-target="#photoModal" data-url="'+ url +'" data-id="' + id +'">'
          + '<img class="card-img-top img-fluid" src="' + url + '" /></a>'
          + '<div class="card-block">'
          + '<p class="card-text">#' + id + '</p>'
          //+ '<p class="card-text">' + record.get('Fotograf: Name') + '</p>'
          + '</div>'
          + '</div></div>'
        );


      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(error) {
      if (error) {
          console.log(error);
      }
      $('#photoModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var url = button.data('url'); // Extract info from data-* attributes
        var id = button.data('id');
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text('Foto  #' + id)
        modal.find('.modal-body .img-fluid').attr("src", url);
      });
  });
}

function showPages() {
  base('Seiten').select({
      view: 'Main View'
  }).firstPage(function(error, records) {
      if (error) {
          console.log(error);
      } else {
          records.forEach(function(record) {
            var count =0;
            if(typeof record.get('Zugeordnete Fotos') != 'undefined') {
              var count = record.get('Zugeordnete Fotos').length;
            }
            $("#pageOverview").append(
              ' <div class="row">'
              + '<div class="col-sm-6">'
              + '<a href="' + record.get('entsprechender Link auf nak-sued.de') + '" target="_blank">'
              + record.get('Zielseite')
              + '</a></div>'
              + '<div class="col-sm-3"><progress class="progress progress-info" value="' + count + '" max="15" title="aktuell eingereichte Fotos: ' + count + '"></progress></div>'
              + '</div>'
            );
          });
      }
  });

}

function getVotes() {

  base('Bewertung').select({
      // Selecting the first 3 records in Main View:
      maxRecords: 5,
      view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {

      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
          console.log('Retrieved ', record.get('Name'));
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(error) {
      if (error) {
          console.log(error);

      }
  });

}
