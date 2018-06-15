module.exports = {
    catchErrors: function (fn) {
        return function (...args) {
            return fn(...args).catch(err => console.log(err));
        }
    },
    isEmpty: value => {
        console.log(value)
        console.log(typeof value)
        if (typeof value === 'string') {

            console.log('if', value.trim().length)
        }
        const res = value === undefined ||
            value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0)
        console.log('res', res)
        return res;
    }
}