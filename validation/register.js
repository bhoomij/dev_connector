const validator = require('validator');
const isEmpty = require('../common/func').isEmpty;

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    console.log(data)
    //name validation
    if (!validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if (!validator.isLength(data.name, {
            min: 2,
            max: 50
        })) {
        errors.name = 'Name must be between 2 and 50 characters';
    }

    // email validation
    if (!validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // password validation
    if (!validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if (!validator.isLength(data.password, {
            min: 8,
            max: 50
        })) {
        errors.password = 'Password must be between 8 and 50 characters';
    }

    // confirm password validation
    console.log('here 11 ', typeof (data.password2))
    if (!validator.isEmpty(data.password2)) {
        console.log('111')
        errors.password2 = 'Confirm password field is required';
    }
    if (!validator.equals(data.password, data.password2)) {
        console.log('222')
        errors.password2 = 'Passwords must match';
    }
    console.log('333')

    return {
        errors,
        isValid: isEmpty(errors)
    }
}