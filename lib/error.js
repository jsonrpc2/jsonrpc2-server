function Error(code, message, data) {
    this.code = code;
    this.message = message;

    if (typeof data !== 'undefined') {
        this.data = data;
    }
}

module.exports = Error;

// Pre-defined error
module.exports.PARSE_ERROR = new Error(-32700, 'Parse error');
module.exports.INVALID_REQUEST_ERROR = new Error(-32600, 'Invalid Request');
module.exports.METHOD_NOT_FOUND_ERROR = new Error(-32601, 'Method not found');
module.exports.INVALID_PARAMS_ERROR = new Error(-32602, 'Invalid params');
module.exports.INTERNAL_ERROR = new Error(-32603, 'Internal error');