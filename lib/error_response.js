var util = require('util');
var Response = require('./response');

function ErrorResponse(error, id) {
    Response.call(this, id);
    this.error = error;
}

util.inherits(ErrorResponse, Response);

module.exports = ErrorResponse;