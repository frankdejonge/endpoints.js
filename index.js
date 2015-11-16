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

function Endpoints (root) {
    this.root = root;
    this.endpoints = {};
}

Endpoints.prototype.register = function (method, pattern, name, cb) {
    if (cb !== undefined) {
        this.nest(pattern, cb);
    }

    this.endpoints[name] = {
        method: method,
        pattern: prefixPattern(this.root, pattern)
    };
};

Endpoints.prototype._inspect = function (name) {
    if (this.endpoints.hasOwnProperty(name) === false) {
        throw new Error('Could not find endpoint named: ' + name);
    }

    return this.endpoints[name];
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

Endpoints.prototype.details = function (name) {
    var endpoint = this._inspect(name);

    return {
        name: name,
        pattern: endpoint.pattern,
        method: endpoint.method
    };
}

Endpoints.prototype.resolve = function (name, parameters) {
    var details = this.details(name);
    details.path = resolveParameters(details.pattern, parameters);

    return details;
};

Endpoints.prototype.method = function (name) {
    return this._inspect(name).method;
};

Endpoints.prototype.pattern = function (name) {
    return this._inspect(name).pattern;
};

module.exports = Endpoints;