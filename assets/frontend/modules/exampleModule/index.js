var reactor = require('../../reactor');

reactor.registerStores({
    'dataStore': require('./stores/DataStore')
});

module.exports = {
    actions: require('./actions'),
    getters: require('./getters')
};