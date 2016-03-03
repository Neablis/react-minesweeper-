"use strict";

var expiration = 1 * 24 * 60 * 60 * 1000; // in ms, 1 day
var cache = {};

module.exports = { //TODO: cleanup, generalize, test

  get: function(key) {
    var entry = cache[key];
    if (!!entry) {
      var timestamp = entry.timestamp;
      var currenttime = new Date();
      if (currenttime - timestamp < expiration) {
        return entry.data;
      }
    }
    return null;
  },

  set: function(key, data) {
    var timestamp = new Date();
    cache[key] = { 
      data: data,
      timestamp: timestamp 
    };
  }

};