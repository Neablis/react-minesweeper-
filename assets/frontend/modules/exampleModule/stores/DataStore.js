var Nuclear = require('nuclear-js');
var toImmutable = Nuclear.toImmutable;

var actionTypes = require('../actionTypes');


module.exports = new Nuclear.Store({

    getInitialState: function() {
        return toImmutable([]);
    },

    initialize: function() {
        this.on(actionTypes.POPULATE, function(state, data) {
            return toImmutable(data);
        });
    }

});