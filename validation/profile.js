const validator = require('validator');
const isEmpty = require('../common/func').isEmpty;

module.exports = function validateProfileInput(data) {
    const errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // handle validation
    if (!validator.isLength(data.handle, {
            min: 2,
            max: 40,
        }))
        errors.handle = 'Profile handle must be between 2 and 40 characters';
    if (validator.isEmpty(data.handle))
        errors.handle = 'Profile handle is required';
    // status validation
    if (validator.isEmpty(data.handle))
        errors.status = 'Status field is required';
    // skills validation
    if (validator.isEmpty(data.skills))
        errors.skills = 'Skills field is required';
    // website validation
    if (!isEmpty(data.website))
        if (!validator.isURL(data.website))
            errors.website = 'Not a valid URL';
    // twitter validation
    if (!isEmpty(data.twitter))
        if (!validator.isURL(data.twitter))
            errors.twitter = 'Not a valid URL';
    // youtube validation
    if (!isEmpty(data.youtube))
        if (!validator.isURL(data.youtube))
            errors.youtube = 'Not a valid URL';
    // facebook validation
    if (!isEmpty(data.facebook))
        if (!validator.isURL(data.facebook))
            errors.facebook = 'Not a valid URL';
    // instagram validation
    if (!isEmpty(data.instagram))
        if (!validator.isURL(data.instagram))
            errors.instagram = 'Not a valid URL';
    // linkedin validation
    if (!isEmpty(data.linkedin))
        if (!validator.isURL(data.linkedin))
            errors.linkedin = 'Not a valid URL';

    return {
        errors,
        isValid: isEmpty(errors)
    }
}