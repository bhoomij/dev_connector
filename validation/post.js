const validator = require('validator');
const isEmpty = require('../common/func').isEmpty;

module.exports = function validatePostInput(data) {
    let errors = {};
    data.text = !isEmpty(data.text) ? data.text : '';

    // text field validation
    if (!validator.isLength(data.text, {
            min: 10,
            max: 1000
        })) {
        errors.text = 'Text must be between 10 and 1000 characters';
    }
    if (validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}