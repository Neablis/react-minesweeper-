var reactor = require('../../reactor');
var actionTypes = require('./actionTypes');


module.exports = {

    populate() {
        reactor.dispatch(actionTypes.POPULATE, [{
            id: 1,
            value: 2
        }, {
            id: 2,
            value: 4
        }, {
            id: 3,
            value: 8
        }, {
            id: 4,
            value: 16
        }]);
    }

};