var toImmutable = require('nuclear-js').toImmutable;

module.exports = {
    list: ['dataStore'],
    list_ids: [
        ['dataStore'],
        function(ds) {
            return ds.map(function(item) {
                return item.get('id');
            });
        }
    ]
};