'use strict';

function login() {
  
  digest = asmCrypto.SHA256.hex("The quick brown fox jumps over the lazy dog");
  
}

/**
 * Load Photos of contest for admin overview.
 */
function loadPhotos(base) {
    var spinner = new Spinner(opts).spin(document.getElementById('main'));
    
    //load pages references
    loadPages(base);
    
    var galleryDiv = $("#gallery");
    base('Fotos').select({
        view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
            var url = record.get('Foto')["0"].url;
            var id = record.get('ID');
            var stars = getLocalRateStars(record.id);

            $("#gallery").append('<div class="grid-item col-xl-3 col-md-4 col-sm-6 col-xs-12" data-order="' + id + '" >'
                + '<div class="grid-item-content album">'
                + '<a href="#" data-toggle="modal" data-target="#photoModal" data-url="' + url + '" data-id="' + id + '">'
                + '  <img class="card-img-top img-fluid" src="' + url + '" title="Click to zoom"/>'
                + '</a>'
                + '<div class="card-block">'
                        + '<p class="card-text">#' + id
                        + ' <span  id="rate' + id + '" data-stars="'+stars+'"> </span> '
                        + '<br />'
                        + '<em><b>Fotograf(in):</b> ' + record.get('Fotograf: Name') + '</em>'
                        + ((typeof record.get('Notiz') == 'undefined') ? '' : '<hr /><small>' +record.get('Notiz') + '</small>')
                      + '</p>'
                + '</div>'
                + '</div></div>');

            $(document).ready(function () {
                $.ratePicker("#rate" + id, {
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

function loadPages(base) {


    base('Seiten').select({
        // Selecting the first 3 records in Main View:
        maxRecords: 20,
        view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {

        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('ID ', record.get('id'));
            console.log('Retrieved ', record.get('Zielseite'));
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
