'use strict';

var filter_loaded = false; //global flag to check if filter is already loaded in select option

function login() {
    
}

/**
 * Load Photos of contest for admin overview.
 */
function loadPhotos(base) {
    var spinner = new Spinner(opts).spin(document.getElementById('main'));
    
    
    var galleryDiv = $("#gallery");
    base('Fotos').select({
        view: "Main View",
        filterByFormula: $('#filter').val()
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
            var url = record.get('Foto')["0"].url;
            var id = record.get('ID');

            $("#gallery").append(' <div class="col-xs-12 col-sm-6 col-md-3"><div class="card" data-order="' + id + '" >'

                + '<a href="#" data-toggle="modal" data-target="#photoModal" data-url="' + url + '" data-id="' + id + '">'
                + '  <img class="card-img-top img-fluid" src="' + url + '" title="Click to zoom"/>'
                + '</a>'
                + '<div class="card-block">'
                        + '<p class="card-text">#' + id
                        + '<br />'
                        + '<em><b>Fotograf(in):</b> ' + record.get('Fotograf: Name') + '</em>'
                        + ((typeof record.get('Notiz') == 'undefined') ? '' : '<hr /><small class="text-muted">' +record.get('Notiz') + '</small>')
                        + ((typeof record.get('Für welche Seite(n)?') == 'undefined') ? '' : '<hr /><small class="text-muted">' 
                        + '<span id="' + record.get('Für welche Seite(n)?') + '" class="">' + record.get('Für welche Seite(n)?') + '</span>'
                        + '</small>')
                      + '</p>'
                + '</div></div></div>');

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

                var angle = 0;
                $('#rotate').on('click', function() {
                    angle += 90;
                    modal.find('.modal-body .img-fluid').css('transform','rotate(' + angle + 'deg)');
                });
            });
            $('#photoModal').on('hidden.bs.modal', function (e) {
                modal.find('.modal-body .img-fluid').css('transform','none');
            })
            
            //load pages references
            loadPages(base);    
        }
        spinner.stop();
    });
}

function loadPages(base) {


    base('Seiten').select({
        maxRecords: 20,
        view: "Main View"
    }).eachPage(function page(records, fetchNextPage) {

        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            //update filter 
            if(filter_loaded == false) {       
                $('#filter').append($('<option>', { 
                    value: "FIND( '" + record.get('Zielseite') + "', ARRAYJOIN({Für welche Seite(n)?}, ';'))",
                    text : record.get('Zielseite')
                }));
            }
            replaceText('*', record.id, " " + record.get('Zielseite'), 'g');
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(error) {
        if (error) {
            console.log(error);
        }
        filter_loaded = true;
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

function replaceText(selector, text, newText, flags) {
  var matcher = new RegExp(text, flags);
  $(selector).each(function () {
    var $this = $(this);
    if (!$this.children().length)
       $this.text($this.text().replace(matcher, newText));
  });
}


var angle = 0;
$('#button').on('click', function() {
    angle += 90;
    $("#image").rotate(angle);
});
