'use strict';

function login() {
  
  digest = asmCrypto.SHA256.hex("The quick brown fox jumps over the lazy dog");
  
}


function loadPhotos(base) {
    var spinner = new Spinner(opts).spin(document.getElementById('main'));
    var galleryDiv = $("#gallery");
    base('Fotos').select({
        view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
            var url = record.get('Foto')["0"].url;
            var id = record.get('ID');
            var stars = getLocalRateStars(record.id);

            var cardDiv = $("#gallery")
              .append('<div class="card">'
                + '<a href="#" data-toggle="modal" data-target="#photoModal" data-url="' + url + '" data-id="' + id + '">'
                + '  <img class="card-img-top img-fluid" src="' + url + '" />'
                + '</a>'
                + '<div class="card-block">'
                        + '<p class="card-text">#' + id
                        + ' <span class="rare" id="x-rate' + id + '" data-stars="'+stars+'"> </span> '
                        + '<br />'
                        + '<em><b>Fotograf:</b></em> ' + record.get('Fotograf: Name') + '</em><hr />'
                        + ((typeof record.get('Notiz') == 'undefined') ? '' : '<small>' +record.get('Notiz') + '</small>')
                      + '</p>'
                + '</div>'
                + '</div>');

            $(document).ready(function () {
                $.ratePicker("#x-rate" + id, {
                    max: 5
                    , rate: function (stars) {
                        console.log(record.id + ' - Rate is ' + stars);
                        setLocalRateStars(record.id, stars);
                    }
                });
            });
        });
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    }, function done(error) {
        if (error) {
            console.log(error);
        }
        else {
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
        }
        spinner.stop();
    });
}

function getVotes(base) {
    base('Bewertung').select({
        // Selecting the first 3 records in Main View:
        maxRecords: 5
        , view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
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

function getLocalRateStars(id) {
  var stars = localStorage.getItem(id);
  if(typeof stars == 'undefined') {
    stars = 0;
  }
  return stars;
}

function setLocalRateStars(id, stars) {

  localStorage.setItem(id, stars);
}
