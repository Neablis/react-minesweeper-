var MiddlewareProcessor = require('./middleware-processor');
var React = require('react');
var {render} = require('react-dom');
var {Router, Route} = require('react-router');
var HomePage = require('./components/home');


var history = require('./pushState');
var reactor = require('./reactor');

class App extends React.Component {
    processRouteProps(props) {
        var activeRoute = props.routes[props.routes.length - 1];
        var params = props.params;

        return {
            path: props.location.pathname,
            activeRoute: activeRoute,
            params: props.params
        };
    }

    componentWillMount() {
        var routeState = this.processRouteProps(this.props);
        MiddlewareProcessor.execute(routeState);
    }

    componentWillReceiveProps(nextProps) {
        var routeState = this.processRouteProps(nextProps);
        MiddlewareProcessor.execute(routeState);
    }

    render() {
        return (
            <div>{this.props.children || <HomePage />}</div>
        );
    }
}


const rootRoute = {
    component: 'div',
    childRoutes: [{
        path: '/',
        component: App,
        childRoutes: [
        ]
    }]
};

exports.run = () => {
    setupRedirectListeners();
    let appContainerElm = document.getElementsByClassName('frontend-container')[0];

    if (appContainerElm) {
        render(<Router history={history} routes={rootRoute} />, appContainerElm);
    }
};

// Helper functions
//
//
function setupRedirectListeners() {
    reactor.observe(
        require('./modules/common/getters').lastRedirect,
        (routeData) => {
            var route = routeData.get('path').split('@')[0];
            history.replaceState(null, route);
        }
    );
}