const validator = require('validator');
const isEmpty = require('../common/func').isEmpty;

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    //name validation
    if (!validator.isLength(data.name, {
            min: 2,
            max: 50
        })) {
        errors.name = 'Name must be between 2 and 50 characters';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    // email validation
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // password validation
    if (!validator.isLength(data.password, {
            min: 8,
            max: 50
        })) {
        errors.password = 'Password must be between 8 and 50 characters';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // confirm password validation
    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }
    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}