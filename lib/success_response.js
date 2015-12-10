var util = require('util');
var Response = require('./response');

function SuccessResponse(result, id) {
    Response.call(this, id);
    this.result = result;
}

util.inherits(SuccessResponse, Response);

module.exports = SuccessResponse;