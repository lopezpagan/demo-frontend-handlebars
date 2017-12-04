var  hdb = require('handlebars');
     
     hdb.registerHelper('Header', function(values, options) {
          
          var template = `
               <h1 class="title">{{pageTitle}}</h1>
               <p class="subtitle"> {{pageDesc}} </p>
               <a href="{{btnLink}}" class="btn btn-cta {{btnClass}} btn-lg">{{btnText}}</a>
          `;
          var  data =  hdb.compile(template);
               //console.log(JSON.parse(values));
               
          return data(JSON.parse(values));
          
     });

    hdb.registerHelper('helperMissing', function() {
       var options = arguments[arguments.length - 1];
           console.log (hdb.Exception('Unknown field: ' + this.name ));
    });