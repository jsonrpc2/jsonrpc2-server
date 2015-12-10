var util = require('util');
var EventEmitter = require('events');
var Error = require('./error');
var method = require('./method');
var ErrorResponse = require('./error_response');
var SuccessResponse = require('./success_response');
var Request = require('./request');

function Server(methods) {
    EventEmitter.call(this);
    this.methods = {};
    if (typeof methods !== 'undefined') {
        for (var name in methods) {
            this.register(name, methods[name]);
        };
    }
}

util.inherits(Server, EventEmitter);

Server.prototype.register = function register(name, handler) {
    this.methods[name] = method.parameterfy(handler);
};

Server.prototype.parse = function parse(requestStr) {
    this.emit('request', requestStr);

    try {
        var requestObj = JSON.parse(requestStr);
    } catch (err) {
        return Promise.resolve(new ErrorResponse(Error.PARSE_ERROR, null));
    }

    return this.handle(requestObj);
};

Server.prototype.handle = function handle(requestObj) {
    var self = this;
    // Batch
    if (Array.isArray(requestObj)) {
        if (requestObj.length <= 0) {
            return Promise.resolve(new ErrorResponse(Error.INVALID_REQUEST_ERROR, null));
        }

        return Promise.all(requestObj.map(function(obj) {
            return self.validate(obj);
        }).filter(function(promise) {
            return !!promise;
        }));
    }

    return this.validate(requestObj);
};

Server.prototype.validate = function validate(requestObj) {
    try {
        var request = Request.createRequest(requestObj);
    } catch (err) {
        return Promise.resolve(new ErrorResponse(Error.INVALID_REQUEST_ERROR, null));
    }

    return this.call(request.method, request.params, request.id);
};

Server.prototype.call = function call(method, params, id) {
    var self = this;

    if (!(method in this.methods)) {
        return Promise.resolve(new ErrorResponse(Error.METHOD_NOT_FOUND_ERROR, id));
    }

    var promise = new Promise(function(resolve, reject) {
        if (typeof id === 'undefined') {
            resolve();
        }

        try {
            var promise = self.methods[method].call(null, params);
        } catch (err) {
            reject(err);
            return;
        }

        if (typeof id === 'undefined') {
            return;
        }

        promise.then(function(result) {
            resolve(new SuccessResponse(result, id));
        }).catch(reject);
    });

    return promise.catch(function(err) {
        self.emit('error', err);
        throw err;
    });
};

module.exports = Server;