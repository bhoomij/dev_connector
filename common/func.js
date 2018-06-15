module.exports = {
    catchErrors: function (fn) {
        return function (...args) {
            return fn(...args).catch(err => console.log(err));
        }
    },
    isEmpty: value => value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
}