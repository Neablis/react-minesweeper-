class MiddlewareProcessor {
    constructor(options) {
        this.middleware = {};
    }

    /*
     * For a given path, register one or more middleware functions
     */
    register(path, fns) {
        if (!path) {
            console.error('Path required to register middleware'); //eslint-disable-line no-console
            return;
        }

        if (typeof(fns) === 'function') {
            fns = [fns];
        }

        if (!this.middleware[path]) {
            this.middleware[path] = [];
        }

        fns.forEach((fn) => {
            this.middleware[path].push(fn);
        });
    }

    /*
     * For a given path, receive the routeState and execute all registered
     * middleware with that routeState
     */
    execute(routeState) {
        if (!routeState.activeRoute) return;

        var stack = this.middleware[routeState.activeRoute.path] || [];
        stack.forEach((fn) => {
            fn(routeState);
        });
    }
}

module.exports = new MiddlewareProcessor();
