var pattern = /function[^(]*\(([^)]*)\)/;

module.exports.parameterfy = parameterfy;

function parameterfy(func) {
    var args = func.toString().match(pattern)[1].split(/,\s*/);
    return function(params) {
        if (Array.isArray(params)) {
            return func.apply(this, params);
        }

        return func.apply(this, args.map(function(arg) {
            return params[arg];
        }));
    }
}