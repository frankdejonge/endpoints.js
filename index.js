"use strict";

function resolveParameters(pattern, parameters) {
    parameters = parameters || {};

    return pattern.replace(/:([a-zA-z0-9_-]+)/g, function (match, contents) {
        if (parameters.hasOwnProperty(contents) === false) {
            throw new Error('Could not resolve parameter "' + match + '"');
        }
        return parameters[contents];
    });
}

function prefixPattern(base, pattern) {
    return [base.replace(/\/$/, ''), pattern.replace(/^\//, '')].join('/');
}

function getEndpoint(collection, name) {
    if (collection.endpoints.hasOwnProperty(name) === false) {
        throw new Error('Could not find endpoint named: ' + name);
    }
    return collection.endpoints[name];
}

function determineCallback() {
    return Array.prototype.slice.apply(arguments)
        .filter(function (candidate) { return typeof candidate == 'function'; })
        .shift();
}

function Endpoints (root) {
    this.root = root;
}

Endpoints.prototype.root = '';
Endpoints.prototype.endpoints = {};

Endpoints.prototype.register = function (method, pattern, name, defaults, cb) {
    let callback = determineCallback(defaults, cb);
    defaults = (typeof defaults == 'object' && defaults.constructor == Object) ? defaults : {};

    if (callback) {
        this.nest(pattern, callback);
    }

    this.endpoints[name] = {
        method: method,
        pattern: prefixPattern(this.root, pattern),
        defaults: defaults
    };
};

Endpoints.prototype.nest = function (prefix, cb) {
    var root = this.root;
    this.root = prefixPattern(this.root, prefix);

    try {
        cb(this);
    } catch (e) {
        this.root = root;
        throw e;
    }

    this.root = root;
};

function methodCall (method) {
    return function (pattern, name, cb) {
        this.register(method, pattern, name, cb);
    }
}

Endpoints.prototype.get = methodCall('GET');
Endpoints.prototype.put = methodCall('PUT');
Endpoints.prototype.post = methodCall('POST');
Endpoints.prototype.patch = methodCall('PATCH');
Endpoints.prototype.options = methodCall('OPTIONS');
Endpoints.prototype.head = methodCall('HEAD');
Endpoints.prototype.delete = methodCall('DELETE');

Endpoints.prototype.path = function (name, parameters) {
    return resolveParameters(this.pattern(name), parameters);
};

Endpoints.prototype.blueprint = function (name) {
    var endpoint = getEndpoint(this, name);

    return {
        name: name,
        pattern: endpoint.pattern,
        method: endpoint.method
    };
}

Endpoints.prototype.resolve = function (name, parameters) {
    var route = this.blueprint(name);
    console.log(Object.assign({}, route.defaults, parameters));
    let path = resolveParameters(route.pattern, Object.assign({}, route.defaults, parameters));

    return Object.assign({}, route, {path});
};

Endpoints.prototype.method = function (name) {
    return getEndpoint(this, name).method;
};

Endpoints.prototype.pattern = function (name) {
    return getEndpoint(this, name).pattern;
};

module.exports = Endpoints;
