
var Airtable = require('airtable');
var base;



function initApp() {
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: 'keyEBVQDL09ru6huz'
    });
    base = Airtable.base('apprnzHcKjenpB8sM');
}


function showPages(base) {
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
              + '<div class="col-sm-3"><progress class="progress progress-info" value="' + count + '" max="15" title="' + count + ' eingereichte Fotos"></progress></div>'
              + '</div>'
            );
          });
      }
  });

}
