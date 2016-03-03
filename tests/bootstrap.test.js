var jsdom = require('jsdom').jsdom;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
   userAgent: 'node.js'
};

var Sails = require('sails');
var sails;

var jsdom = require('jsdom');

before(function(done) {
    Sails.lift({
        //configuration for testing purposes
        ,
        port: 9999
    }, function(err, server) {
        sails = server;
        if (err) return done(err);
        // here you can load fixtures, etc.
        done(err, sails);
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});