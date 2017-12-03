var  hdb = require('handlebars');
     hdb.registerHelper('GetPage', function(value, options) {
          
          var template = `
               <h1 class="title">{{pageTitle}}</h1>
               <p class="subtitle"> {{pageDescription}} </p>
               <a href="#" class="btn btn-cta-on btn-lg">Call To Action</a>
               <a href="#" class="btn btn-cta-off btn-lg">Call To Action</a>
          `;
          var  data =  hdb.compile(template);
               
            if(value === "index") {
               return data({pageTitle: "Front Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            } else if(value === "about") {
               return data({pageTitle: "About Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            } else if(value === "projects") {
               return data({pageTitle: "Projects Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            } else if(value === "services") {
               return data({pageTitle: "Services Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            } else if(value === "blog") {
               return data({pageTitle: "Blog Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            } else if(value === "contact") {
               return data({pageTitle: "Contact Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});
            } else {
               return data({pageTitle: "Other Page", pageDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."});

            }
     });

    hdb.registerHelper('helperMissing', function() {
       var options = arguments[arguments.length - 1];
           console.log (hdb.Exception('Unknown field: ' + this.name ));
    });