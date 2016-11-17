'use strict';



function loadPhotos(base) {
    var spinner = new Spinner(opts).spin(document.getElementById('main'));
    var galleryDiv = $("#gallery");
    base('Fotos').select({
        view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {

      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
        var url = record.get('Foto')["0"].url;
        var id = record.get('ID');
        var cardDiv =galleryDiv.append(
          ' <div class="col-sm-3"><div class="card">'
        + '<a href="#" data-toggle="modal" data-target="#photoModal" data-url="'+ url +'" data-id="' + id +'">'
          + '<img class="card-img-top img-fluid" src="' + url + '" /></a>'
            + '<div class="card-block">'
          + '<p class="card-text">#' + id + '</p>');
         var xRateDivDiv = cardDiv.append('<div id="x-rate' + id + '"> </div>');
         xRateDivDiv.append(
             //+ '<p class="card-text">' + record.get('Fotograf: Name') + '</p>'
          + '</div>'
          + '</div></div>'
        );

          var d = document.createElement('rate' + id);
          $(d).jRate({
                rating: 1,
        				strokeColor: 'black',
        				precision: 1,
        				minSelected: 1,
        				onChange: function(rating) {
        					//console.log("OnChange: Rating: "+rating);
        				},
        				onSet: function(rating) {
        					console.log("OnSet: Rating: "+rating);
        				}
          })
          .appendTo(xRateDivDiv);


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
      spinner.stop();
  });
}


function getVotes(base) {

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
