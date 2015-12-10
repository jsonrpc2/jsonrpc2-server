function Response(id) {
    this.jsonrpc = '2.0';

    if (typeof id !== 'undefined') {
        this.id = id;
    }
}

module.exports = Response;