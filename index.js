var assign = require('object-assign');

function resolveParameters(pattern, parameters) {
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

var acceptors = {
    get: function (pattern, name, cb) {
        this.register('GET', pattern, name, cb);
    },
    post: function (pattern, name, cb) {
        this.register('POST', pattern, name, cb);
    },
    patch: function (pattern, name, cb) {
        this.register('PATCH', pattern, name, cb);
    },
    put: function (pattern, name, cb) {
        this.register('PUT', pattern, name, cb);
    },
    delete: function (pattern, name, cb) {
        this.register('DELETE', pattern, name, cb);
    },
    options: function (pattern, name, cb) {
        this.register('OPTIONS', pattern, name, cb);
    },
    head: function (pattern, name, cb) {
        this.register('HEAD', pattern, name, cb);
    },
    nest: function (prefix, cb) {
        var proxy = new EndpointProxy(this, prefix);
        cb(proxy);
    }
};

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

Endpoint.prototype.resolve = function (name, parameters) {
    return resolveParameters(this.pattern(name), parameters || {});
};

Endpoint.prototype.method = function (name) {
    return this._inspect(name).method;
};

Endpoint.prototype.pattern = function (name) {
    return this._inspect(name).pattern;
};

assign(Endpoint.prototype, acceptors);

function EndpointProxy (acceptor, root) {
    this.acceptor = acceptor;
    this.root = root;
}

EndpointProxy.prototype.register = function (method, pattern, name, cb) {
    this.acceptor.register(method, prefixPattern(this.root, pattern), name, cb);
};

assign(EndpointProxy.prototype, acceptors);

module.exports = Endpoint;