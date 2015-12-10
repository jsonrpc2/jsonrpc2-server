function Request(version, method, params, id) {
    this.jsonrpc = version;
    this.method = method;

    if (typeof params !== 'undefined') {
        this.params = params;
    }

    if (typeof id !== 'undefined') {
        this.id = id;
    }
}

Request.createRequest = function createRequest(data) {
    if (!('method' in data)) {
        throw new Error('method not defined.');
    }

    if (typeof data.method !== 'string') {
        throw new Error('Method string must be string');
    }

    if (!('jsonrpc' in data)) {
        throw new Error('jsonrpc not defined.');
    }

    return new Request(data.jsonrpc, data.method, data.params, data.id);
};

Request.prototype.isNotification = function isNotification() {
    return typeof this.id === 'undefined';
}

module.exports = Request;