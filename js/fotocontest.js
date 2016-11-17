
var Airtable = require('airtable');
var base;

var opts = {
  lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}

function initApp() {
        
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: 'keyEBVQDL09ru6huz'
    });
    base = Airtable.base('apprnzHcKjenpB8sM');
}


function showPages(base) {
    var spinner = new Spinner(opts).spin(document.getElementById('main'));
    var target = $("#pageOverview");
    
    base('Seiten').select({
      view: 'Main View'
    }).firstPage(function(error, records) {
        
        if (error) {
          console.log(error);
        } else {
          records.forEach(function(record) {
            var imgCount = 0;
            if(typeof record.get('Zugeordnete Fotos') != 'undefined') {
               imgCount = record.get('Zugeordnete Fotos').length;
            }

            target.append(
              ' <div class="row">'
              + '<div class="col-sm-6">'
              + '<a href="' + record.get('entsprechender Link auf nak-sued.de') + '" target="_blank">'
              + record.get('Zielseite')
              + '</a></div>'
              + '<div class="col-sm-3"><progress class="progress progress-info" value="' + imgCount + '" max="15" title="' + imgCount + ' eingereichte Fotos"></progress></div>'
              + '</div>'
            );
          });
        }
        spinner.stop();
    });
    
    

}
