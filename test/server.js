var expect = require('expect.js');
var Server = require('../lib/server');

describe('Server', function() {
    beforeEach(function() {
        this.server = new Server({
            subtract: function(minuend, subtrahend) {
                return Promise.resolve(minuend - subtrahend);
            },

            update: function(a, b, c, d, e) {
                return Promise.resolve();
            },

            foobar: function() {
                return Promise.resolve();
            }
        });
    });

    it('rpc call with positional parameters', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                result: 19,
                id: 1
            });
            done();
        }).catch(done);
    });

    it('rpc call with positional parameters#2', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "subtract", "params": [23, 42], "id": 2}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                result: -19,
                id: 2
            });
            done();
        }).catch(done);
    });

    it('rpc call with named parameters', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                result: 19,
                id: 3
            });
            done();
        }).catch(done);
    });

    it('rpc call with named parameters#2', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "subtract", "params": {"minuend": 42, "subtrahend": 23}, "id": 4}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                result: 19,
                id: 4
            });
            done();
        }).catch(done);
    });

    it('a Notification', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "update", "params": [1,2,3,4,5]}').then(function(response) {
            expect(response).to.be(undefined);
            done();
        }).catch(done);
    });

    it('a Notification#2', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "foobar"}').then(function(response) {
            expect(response).to.be(undefined);
            done();
        }).catch(done);
    });

    it('rpc call of non-existent method', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "non_exist", "id": "1"}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32601,
                    message: 'Method not found'
                },
                id: '1'
            });
            done();
        }).catch(done);
    });

    it('rpc call with invalid JSON', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": "foobar, "params": "bar", "baz]').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32700,
                    message: 'Parse error'
                },
                id: null
            });
            done();
        }).catch(done);
    });

    it('rpc call with invalid Request object', function(done) {
        this.server.parse('{"jsonrpc": "2.0", "method": 1, "params": "bar"}').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            done();
        }).catch(done);
    });

    it('rpc call Batch, invalid JSON', function(done) {
        this.server.parse('[{"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},{"jsonrpc": "2.0", "method"]').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32700,
                    message: 'Parse error'
                },
                id: null
            });
            done();
        }).catch(done);
    });

    it('rpc call with an empty Array', function(done) {
        this.server.parse('[]').then(function(response) {
            expect(response).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            done();
        }).catch(done);
    });

    it('rpc call with an invalid Batch (but not empty)', function(done) {
        this.server.parse('[1]').then(function(response) {
            expect(response).to.have.length(1);
            expect(response[0]).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            done();
        }).catch(done);
    });

    it('rpc call with invalid Batch', function(done) {
        this.server.parse('[1,2,3]').then(function(response) {
            expect(response).to.have.length(3);
            expect(response[0]).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            expect(response[1]).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            expect(response[2]).to.eql({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request'
                },
                id: null
            });
            done();
        }).catch(done);
    });
});