module.exports = {
    catchErrors: function (fn) {
        return function (...args) {
            return fn(...args).catch(err => console.log(err));
        }
    },
    isEmpty: (data) => {
        console.log('here ', data)
        return data === null ||
            data === undefined ||
            (typeof (data) == 'obj') && Object.keys(data).length === 0 ||
            (typeof (data) == 'string') && data.trim().length === 0
    }
}