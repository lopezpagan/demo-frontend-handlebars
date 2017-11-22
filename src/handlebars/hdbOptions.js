var src = './src/';
var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
    partials : {
        copyright : '<copy>&copy; 2017 Tony Lopez</copy>'
    },
    batch : [src+'templates/partials'],
    helpers : {
        capitals : function(str){
            return str.toUpperCase();
        } 
    }
};

module.exports = options;