// In order for all stores to be registered, we need to pull in
// all modules
var Common = require('./modules/common');
var RoutesInit = require('./routes-init');
var NavInit = require('../js/common/menu');

NavInit.init();
RoutesInit.run();