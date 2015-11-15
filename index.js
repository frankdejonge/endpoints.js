"use strict";

function resolveParameters(pattern, parameters) {
    parameters = parameters || {};

    return pattern.replace(/(?![\/|^]):([a-zA-z0-9_-]+)/g, function (match, contents) {
        if (parameters.hasOwnProperty(contents) === false) {
            throw new Error('Could not resolve parameter "' + match + '"');
        }
        return parameters[contents];
    });
}

function prefixPattern(base, pattern) {
    return [base.replace(/\/$/, ''), pattern.replace(/^\//, '')].join('/');
}

function Endpoint (root) {
    this.root = root;
    this.endpoints = {};
}

Endpoint.prototype.register = function (method, pattern, name, cb) {
    if (cb !== undefined) {
        this.nest(pattern, cb);
    }

    this.endpoints[name] = {
        method: method,
        pattern: prefixPattern(this.root, pattern)
    };
};

Endpoint.prototype._inspect = function(name) {
    if (this.endpoints.hasOwnProperty(name) === false) {
        throw new Error('Could not get URI named: ' + name);
    }

    return this.endpoints[name];
};

Endpoint.prototype.nest = function (prefix, cb) {
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

Endpoint.prototype.get = methodCall('GET');
Endpoint.prototype.put = methodCall('PUT');
Endpoint.prototype.post = methodCall('POST');
Endpoint.prototype.patch = methodCall('PATCH');
Endpoint.prototype.options = methodCall('OPTIONS');
Endpoint.prototype.head = methodCall('HEAD');
Endpoint.prototype.delete = methodCall('DELETE');

Endpoint.prototype.path = function (name, parameters) {
    return resolveParameters(this.pattern(name), parameters);
};

Endpoint.prototype.resolve = function (name, parameters) {
    var endpoint = this._inspect(name);

    return {
        name: name,
        path: resolveParameters(endpoint.pattern, parameters),
        pattern: endpoint.pattern,
        method: endpoint.method
    };
};

Endpoint.prototype.method = function (name) {
    return this._inspect(name).method;
};

Endpoint.prototype.pattern = function (name) {
    return this._inspect(name).pattern;
};

module.exports = Endpoint;